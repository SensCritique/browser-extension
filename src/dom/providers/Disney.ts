import Cache from '../../storage/Cache'
import Ratings from '../Ratings'
import md5 from 'blueimp-md5'
import { Service } from '../../http/Service'
import { Provider } from '../../http/Provider'
import Logger from '../../logging/Logger'
import Manager from '../Manager'
import { VideoType } from '../../http/VideoType'
import { VideoInfo } from '../../http/Client'
import RatingFactory from '../RatingFactory'
import {
  ABTestModal,
  AbTestModalId,
  NotSupportedModal,
  NotSupportedModalId
} from '../Modals'

export default class Disney extends Manager {
  refreshRatings () {
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

  getVideoName (): string | null {
    const detailModalVideoName = document
      .querySelector('#unauth-navbar-target')
      ?.firstElementChild
      ?.getAttribute('alt')

    return detailModalVideoName || null
  }

  getVideoYear (): string {
    const element = document.querySelector('.metadata.text-color--primary').querySelector('span')
    const innerText = element?.innerText
    const year = innerText.split('•')[0]
    return year
  }

  getVideoType (): VideoType {
    const element = document.querySelectorAll('nav')[1]?.firstElementChild
    const innerHtml = element?.innerHTML
    return innerHtml !== 'ÉPISODES' ? VideoType.MOVIE : VideoType.TVSHOW
  }

  getSeasons (): string | null {
    const element = document.querySelector('.metadata.text-color--primary').querySelector('span')
    const innerText = element?.innerText
    const seasons = innerText.split('•')?.[1].match(/\d+/)?.[0]
    return seasons
  }

  getRating (videoName: string, jawbone: Element, service: Service, hash: string): void {
    const videoInfoFound = null
    if (!videoInfoFound) {
      this.getVideoInfo(
        service,
        videoName,
        this.getVideoYear(),
        this.getVideoType(),
        this.getSeasons(),
        (videoInfo: VideoInfo) => {
          this.renderRating(service, jawbone, videoInfo, hash)
        }
      )
    }
    if (videoInfoFound) {
      this.renderRating(service, jawbone, videoInfoFound, hash)
    }
  }

  renderRating (service: Service, element: Element, videoInfo: VideoInfo, hash: string): void {
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

  logVideoInfo (videoName: string, rating: string, service: Service): void {
    if (rating) {
      this.logger.info(`Rating fetched for video ${videoName}`, {
        name: videoName,
        rating: rating,
        serviceWebsite: service,
        disney_id: this.currentVideoId(),
        provider: Provider.DISNEY
      })
    } else {
      this.logger.error(`Cannot fetch rating for video ${videoName}`, {
        name: videoName,
        serviceWebsite: service,
        disney_id: this.currentVideoId(),
        provider: Provider.DISNEY
      })
    }
  }

  currentVideoId (): string {
    const urlQuery = new URL(window.location.toString()).pathname.split(
      '/'
    )
    return urlQuery.length > 0 && urlQuery[4] ? urlQuery[4] : null
  }

  /*
   * Todo: On garde ou pas ?
   */
  showAbTestModal (): void {
    const cacheKey = 'senscritique_extension_help'
    const helpModalAlreadyDisplayed = sessionStorage.getItem(cacheKey)

    if (
      document.getElementById(AbTestModalId) == null &&
      !helpModalAlreadyDisplayed
    ) {
      this.logger.error(
        'Netflix GUI seems to be differents, user is part of an AB Test'
      )
      document.body.appendChild(ABTestModal())
      sessionStorage.setItem(cacheKey, '1')

      document.getElementById(AbTestModalId).addEventListener('click', () => {
        document.getElementById(AbTestModalId).remove()
      })
    }
  }

  showNotSupportedModal (): void {
    const cacheKey = 'senscritique_extension_not_supported'
    const NotSupportedModalIdDisplayed = sessionStorage.getItem(cacheKey)

    if (
      document.getElementById(NotSupportedModalId) == null &&
      !NotSupportedModalIdDisplayed
    ) {
      this.logger.error('A newer GUI version seems available')
      document.body.appendChild(NotSupportedModal())
      sessionStorage.setItem(cacheKey, '1')

      document
        .getElementById(NotSupportedModalId)
        .addEventListener('click', () => {
          document.getElementById(NotSupportedModalId).remove()
        })
    }
  }
}
