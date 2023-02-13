import Ratings from '../Ratings'
import md5 from 'blueimp-md5'
import { Service } from '../../enum/Service'
import { Provider } from '../../enum/Provider'
import Manager from '../Manager'
import { VideoType } from '../../enum/VideoType'
import { VideoInfo } from '../../http/Client'
import RatingFactory from '../RatingFactory'

export default class Disney extends Manager {
  refreshRatings(): void {
    const videoName = this.getVideoName()
    const modal = document.querySelector("[data-gv2containerkey='contentMeta']")
    const hash = md5(videoName)

    if (videoName && modal?.getElementsByClassName(hash).length === 0) {
      if (modal) {
        const ratingsElement = Ratings.render(hash, Provider.DISNEY)
        modal.prepend(ratingsElement)
      }
      this.getRating(videoName, modal, Service.SENSCRITIQUE, hash)
    }
  }

  getVideoName(): string | null {
    const detailModalVideoName = document
      .querySelector('#unauth-navbar-target')
      ?.firstElementChild?.getAttribute('alt')

    return detailModalVideoName || null
  }

  getVideoYear(): string {
    const element = document
      .querySelector('.metadata.text-color--primary')
      .querySelector('span')
    const innerText = element?.innerText
    const year = innerText.split('•')[0]
    return year
  }

  getVideoType(): VideoType {
    const element = document.querySelectorAll('nav')[1]?.firstElementChild
    const innerHtml = element?.innerHTML
    return innerHtml !== 'ÉPISODES' ? VideoType.MOVIE : VideoType.TVSHOW
  }

  getSeasons(): string | null {
    const element = document
      .querySelector('.metadata.text-color--primary')
      .querySelector('span')
    const innerText = element?.innerText
    const seasons = innerText.split('•')?.[1].match(/\d+/)?.[0]
    return seasons
  }

  getRating(
    videoName: string,
    jawbone: Element,
    service: Service,
    hash: string
  ): void {
    const videoInfoFound = this.cache.get(videoName, service)

    if (!videoInfoFound) {
      this.getVideoInfo(
        service,
        videoName,
        this.getVideoYear(),
        this.getVideoType(),
        this.getSeasons(),
        Provider.DISNEY,
        (videoInfo: VideoInfo) => {
          this.renderRating(service, jawbone, videoInfo, hash)
        }
      )
    }
    if (videoInfoFound) {
      this.renderRating(service, jawbone, videoInfoFound, hash)
    }
  }

  renderRating(
    service: Service,
    element: Element,
    videoInfo: VideoInfo,
    hash: string
  ): void {
    this.cache.save(videoInfo, service)

    const serviceRating = new RatingFactory().create(service, videoInfo)
    const ratingElement = serviceRating.render()

    document
      .querySelectorAll(`.${service}_${hash}`)
      .forEach((serviceElement) => {
        if (serviceElement.childNodes.length === 0) {
          serviceElement.innerHTML = ratingElement.outerHTML
          this.logVideoInfo(videoInfo.name, serviceRating.rating, service)
        }
      })
  }

  logVideoInfo(videoName: string, rating: string, service: Service): void {
    if (rating) {
      this.logger.info(`Rating fetched for video ${videoName}`, {
        name: videoName,
        rating: rating,
        serviceWebsite: service,
        disney_id: this.currentVideoId(),
        provider: Provider.DISNEY,
      })
    } else {
      this.logger.error(`Cannot fetch rating for video ${videoName}`, {
        name: videoName,
        serviceWebsite: service,
        disney_id: this.currentVideoId(),
        provider: Provider.DISNEY,
      })
    }
  }

  currentVideoId(): string {
    const urlQuery = new URL(window.location.toString()).pathname.split('/')
    return urlQuery.length > 0 && urlQuery[4] ? urlQuery[4] : null
  }
}
