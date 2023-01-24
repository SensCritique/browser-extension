import Cache from '../../storage/Cache'
import Ratings from '../Ratings'
import md5 from 'blueimp-md5'
import { Service } from '../../enum/Service'
import { Provider } from '../../enum/Provider'
import Manager from '../Manager'
import { VideoType } from '../../enum/VideoType'
import { VideoInfo } from '../../http/Client'
import RatingFactory from '../RatingFactory'
import {
  ABTestModal,
  AbTestModalId,
  NotSupportedModal,
  NotSupportedModalId
} from '../Modals'

export default class Canal extends Manager {
  removePreviousRating (videoName: string) {
    const element = document.getElementById('sc_rating')
    var name = element?.getAttribute('name')
    if (element && (videoName !== name)) {
      element.remove()
    }
  }

  refreshRatings () {
    const videoName = this.getVideoName()
    this.removePreviousRating(videoName)
    const modal = document.querySelector("[data-e2e='mediaCardBody__info']")
    const hash = md5(videoName)

    if (videoName && modal?.getElementsByClassName(hash).length === 0) {
      if (modal) {
        const ratingsElement = Ratings.render(hash, videoName, Provider.CANAL)
        modal.prepend(ratingsElement)
      }
      this.getRating(videoName, modal, Service.SENSCRITIQUE, hash)
    }
  }

  getVideoName (): string | null {
    const detailModalVideoName = document
      .querySelector('.bodyTitle___HwRP2')
      ?.innerHTML

    return detailModalVideoName || null
  }

  getVideoYear (): string {
    const element = document.querySelector('.meta__title___d6mTo')
    const innerHtml = element?.innerHTML
    const year = innerHtml?.match(/(\d{4}-\d{4}|\d{4})/g)?.[0]
    return year
  }

  getVideoType (): VideoType {
    const element = document.querySelector('.seasonSwitcher__title___xT1da')
    const innerHtml = element?.innerHTML
    return !innerHtml || innerHtml !== 'Saison' ? VideoType.MOVIE : VideoType.TVSHOW
  }

  getSeasons (): string | null {
    const element = document.querySelectorAll('.seasonSwitcher__item___7raR7')
    const nbrSeasons = element?.length
    return nbrSeasons.toString()
  }

  getRating (videoName: string, jawbone: Element, service: Service, hash: string): void {
    // const videoInfoFound = this.cache.get(videoName, service)
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
        provider: Provider.CANAL
      })
    } else {
      this.logger.error(`Cannot fetch rating for video ${videoName}`, {
        name: videoName,
        serviceWebsite: service,
        disney_id: this.currentVideoId(),
        provider: Provider.CANAL
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
