import Cache from '../storage/Cache'
import {MessageEvent} from './MessageEventEnum'
import VideoTypeEnum from '../http/VideoTypeEnum'
import Ratings from './Ratings'
import md5 from 'blueimp-md5'
import RatingFactory from './RatingFactory'
import { ServiceEnum } from '../http/ServiceEnum'
import Logger from '../logging/Logger'
import { ABTestModal, AbTestModalId, NotSupportedModal, NotSupportedModalId } from './Modals'

export default class Manager {
  private cache: Cache;
  private logger: Logger;

  constructor () {
    this.cache = new Cache()
    this.logger = new Logger()
  }

  getVideoInfo (service, videoName, videoYear, videoType, callback) {
    chrome.runtime.sendMessage({ type: MessageEvent.INFO, service, videoName, videoYear, videoType }, callback)
  }

  refreshRatings () {
    const videoName = this.getVideoName()
    const modal = document.querySelector('.detail-modal')
    const hash = md5(videoName)

    if (videoName && modal.getElementsByClassName(hash).length === 0) {
      // Create main div for Ratings
      const infoElement = modal.querySelector('.previewModal--detailsMetadata-info')
      if (infoElement) {
        const ratingsElement = Ratings.render(hash)
        infoElement.prepend(ratingsElement)
      }
      this.getRating(videoName, modal, ServiceEnum.SENSCRITIQUE)
      this.getRating(videoName, modal, ServiceEnum.ALLOCINE)
    }
  }

  getVideoName () {
    const detailModalVideoName = document
      .querySelector('.previewModal--player-titleTreatment-logo')
      ?.getAttribute('alt')

    return detailModalVideoName || null
  }

  getVideoYear () {
    const yearElement: HTMLElement = document.querySelector('.detail-modal .year')

    return yearElement?.innerText
  }

  getVideoType () {
    const episodesElement = document.querySelector('.detail-modal .episodeSelector')

    return episodesElement == null ? VideoTypeEnum.MOVIE : VideoTypeEnum.SERIE
  }

  getRating (videoName, jawbone, service) {
    const videoInfoFound = this.cache.get(videoName, service)
    if (!videoInfoFound) {
      this.getVideoInfo(service, videoName, this.getVideoYear(), this.getVideoType(), videoInfo => {
        this.renderRating(service, jawbone, videoInfo)
      })
    }
    if (videoInfoFound) {
      this.renderRating(service, jawbone, videoInfoFound)
    }
  }

  renderRating (service, element, videoInfo) {
    this.cache.save(videoInfo, service)

    const serviceRating = (new RatingFactory()).create(service, videoInfo)
    const ratingElement = serviceRating.render()

    document.querySelectorAll(`.${service}_${md5(videoInfo.name)}`).forEach(serviceElement => {
      if (serviceElement.childNodes.length === 0) {
        serviceElement.innerHTML = ratingElement.outerHTML
        this.logVideoInfo(videoInfo.name, serviceRating.rating, service)
      }
    })
  }

  logVideoInfo (videoName, rating, service) {
    if (rating) {
      this.logger.info(`Rating fetched for video ${videoName}`, {
        name: videoName,
        rating: rating,
        service,
        netflix_id: this.currentVideoId()
      })
    } else {
      this.logger.error(`Cannot fetch rating for video ${videoName}`, {
        name: videoName,
        service,
        netflix_id: this.currentVideoId()
      })
    }
  }

  currentVideoId () {
    const urlQuery = new URL(window.location.toString()).pathname.split('/title/')
    const firstJawboneId = urlQuery.length > 0 && !isNaN(parseInt(urlQuery[1])) ? urlQuery[1] : null
    const secondJawboneId = new URLSearchParams(window.location.search).get('jbv')

    return secondJawboneId || firstJawboneId
  }

  showAbTestModal () {
    const cacheKey = 'noteflix_help'
    const helpModalAlreadyDisplayed = sessionStorage.getItem(cacheKey)

    if (document.getElementById(AbTestModalId) == null && !helpModalAlreadyDisplayed) {
      this.logger.error('Netflix GUI seems to be differents, user is part of an AB Test')
      document.body.appendChild(ABTestModal())
      sessionStorage.setItem(cacheKey, '1')

      document.getElementById(AbTestModalId).addEventListener('click', () => {
        document.getElementById(AbTestModalId).remove()
      })
    }
  }

  showNotSupportedModal () {
    const cacheKey = 'noteflix_not_supported'
    const helpModalAlreadyDisplayed = sessionStorage.getItem(cacheKey)

    if (document.getElementById(NotSupportedModalId) == null && !helpModalAlreadyDisplayed) {
      this.logger.error('A newer GUI version seems available')
      document.body.appendChild(NotSupportedModal())
      sessionStorage.setItem(cacheKey, '1')

      document.getElementById(NotSupportedModalId).addEventListener('click', () => {
        document.getElementById(NotSupportedModalId).remove()
      })
    }
  }
}
