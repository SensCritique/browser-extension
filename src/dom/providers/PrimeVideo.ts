import Cache from '../../storage/Cache'
import Ratings from '../Ratings'
import md5 from 'blueimp-md5'
import { Service } from '../../enum/Service'
import { Provider } from '../../enum/Provider'
import Logger from '../../logging/Logger'
import Manager from '../Manager'
import { VideoType } from '../../enum/VideoType'
import { VideoInfo } from '../../http/Client'
import RatingFactory from '../RatingFactory'

const manager = new Manager()

export default class PrimeVideo {
  private cache: Cache
  private logger: Logger

  constructor() {
    this.cache = new Cache()
    this.logger = new Logger()
  }

  refreshRatings(): void {
    const videoName = this.getVideoName()
    const modal = document.querySelector('.dv-node-dp-badges')
    const hash = md5(videoName)

    if (videoName && modal?.getElementsByClassName(hash).length === 0) {
      if (modal) {
        const ratingsElement = Ratings.render(hash, Provider.PRIME)
        modal.prepend(ratingsElement)
      }
      this.getRating(videoName, modal, Service.SENSCRITIQUE, hash)
    }
  }

  getVideoName(): string | null {
    let detailModalVideoName = null
    detailModalVideoName = document.querySelector('._2IIDsE').textContent

    if (!detailModalVideoName) {
      detailModalVideoName = document
        .querySelector('._1GS1_C')
        ?.getAttribute('alt')
    }

    return detailModalVideoName || null
  }

  getVideoYear(): string {
    const element = document.querySelectorAll(
      '[data-automation-id="release-year-badge"]'
    )[0]
    const year = element.innerHTML
    return year
  }

  getVideoType(): VideoType {
    const element = document.querySelector('._36qUej')
    const textContent = element?.textContent.toLowerCase()
    return textContent?.includes('saison') ? VideoType.TVSHOW : VideoType.MOVIE
  }

  getSeasons(): string | null {
    const element = document.querySelector('._36qUej')
    const innerHTML = element?.innerHTML
    const seasons = innerHTML.split(' ')[1]
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
      manager.getVideoInfo(
        service,
        videoName,
        this.getVideoYear(),
        this.getVideoType(),
        this.getSeasons(),
        Provider.PRIME,
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
        prime_video_id: this.currentVideoId(),
        provider: Provider.PRIME,
      })
    } else {
      this.logger.error(`Cannot fetch rating for video ${videoName}`, {
        name: videoName,
        serviceWebsite: service,
        prime_video_id: this.currentVideoId(),
        provider: Provider.PRIME,
      })
    }
  }

  currentVideoId(): string {
    const urlQuery = new URL(window.location.toString()).pathname.split('/')
    return urlQuery.length > 0 && urlQuery[2] ? urlQuery[2] : null
  }
}
