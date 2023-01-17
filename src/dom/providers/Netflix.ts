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

export default class Netflix extends Manager {
  refreshRatings () {
    const videoName = this.getVideoName()
    const modal = document.querySelector('.detail-modal')
    const hash = md5(videoName)

    if (videoName && modal?.getElementsByClassName(hash).length === 0) {
      // Create main div for Ratings
      const infoElement = modal.querySelector(
        '.previewModal--detailsMetadata-info'
      )
      if (infoElement) {
        const ratingsElement = Ratings.render(hash, Provider.NETFLIX)
        infoElement.prepend(ratingsElement)
      }
      this.getRating(videoName, modal, Service.SENSCRITIQUE, hash)
    }
  }

  getVideoName (): string | null {
    const detailModalVideoName = document
      .querySelector('.previewModal--player-titleTreatment-logo')
      ?.getAttribute('alt')

    return detailModalVideoName || null
  }

  getVideoYear (): string {
    const yearElement: HTMLElement = document.querySelector(
      '.detail-modal .year'
    )

    return yearElement?.innerText
  }

  getVideoType (): VideoType {
    const episodesElement = document.querySelector(
      '.detail-modal .episodeSelector'
    )

    return episodesElement == null ? VideoType.MOVIE : VideoType.TVSHOW
  }

  getSeasons (): string | null {
    const element = document.querySelector('.duration')
    const innerHtml = element?.innerHTML
    const seasons = innerHtml?.split(' ')?.[0]
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
        netflix_id: this.currentVideoId(),
        provider: Provider.NETFLIX
      })
    } else {
      this.logger.error(`Cannot fetch rating for video ${videoName}`, {
        name: videoName,
        serviceWebsite: service,
        netflix_id: this.currentVideoId(),
        provider: Provider.NETFLIX
      })
    }
  }

  currentVideoId (): string {
    const urlQuery = new URL(window.location.toString()).pathname.split(
      '/title/'
    )
    const firstJawboneId =
      urlQuery.length > 0 && !isNaN(parseInt(urlQuery[1])) ? urlQuery[1] : null
    const secondJawboneId = new URLSearchParams(window.location.search).get(
      'jbv'
    )

    return secondJawboneId || firstJawboneId
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
