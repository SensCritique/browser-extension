import Cache from '../storage/Cache'
import MessageEventEnum from './MessageEventEnum'
import VideoTypeEnum from '../http/VideoTypeEnum'
import Ratings from './Ratings'
import * as md5 from 'blueimp-md5'
import RatingFactory from './RatingFactory'
import { ServiceEnum } from '../http/ServiceEnum'
import Logger from '../logging/Logger'
import { HelpModal, HelpModalId } from './HelpModal'

export default class Manager {
  constructor () {
    this.cache = new Cache()
    this.logger = new Logger()
  }

  getVideoInfo (service, videoName, videoYear, videoType, callback) {
    chrome.runtime.sendMessage({ type: MessageEventEnum.INFO, service, videoName, videoYear, videoType }, callback)
  }

  refreshRatings () {
    const jawbones = this.getJawbones()

    for (const jawbone of jawbones) {
      const videoName = this.getVideoName(jawbone)
      const hash = md5(videoName)

      if (videoName && jawbone.getElementsByClassName(hash).length === 0) {
        // Create main div for Ratings
        const jawboneOverviewInfo = jawbone.getElementsByClassName('jawbone-overview-info')[0]
        if (jawboneOverviewInfo) {
          const ratingsElement = Ratings.render(hash)
          jawboneOverviewInfo.prepend(ratingsElement)
        }
        this.getRating(videoName, jawbone, ServiceEnum.SENSCRITIQUE)
        this.getRating(videoName, jawbone, ServiceEnum.ALLOCINE)
      }
    }
  }

  getJawbones () {
    return document.getElementsByClassName('jawBone')
  }

  getVideoName (jawbone) {
    const element = jawbone.querySelector('.logo')
    return element ? element.getAttribute('alt') : null
  }

  getVideoYear (jawbone) {
    const yearElement = jawbone.querySelector('.year')
    return yearElement == null ? null : yearElement.innerText
  }

  getVideoType (jawbone) {
    const episodesElement = jawbone.querySelector('.Episodes')

    return episodesElement == null ? VideoTypeEnum.MOVIE : VideoTypeEnum.SERIE
  }

  getRating (videoName, jawbone, service) {
    const videoInfoFound = this.cache.get(videoName, service)
    if (!videoInfoFound) {
      this.getVideoInfo(service, videoName, this.getVideoYear(jawbone), this.getVideoType(jawbone), videoInfo => {
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
    const urlQuery = new URL(window.location).pathname.split('/title/')
    const firstJawboneId = urlQuery.length > 0 && !isNaN(parseInt(urlQuery[1])) ? urlQuery[1] : null
    const secondJawboneId = new URLSearchParams(window.location.search).get('jbv')

    return secondJawboneId || firstJawboneId
  }

  showHelp () {
    const cacheKey = 'noteflix_help_already_displayed'
    const helpModalAlreadyDisplayed = sessionStorage.getItem(cacheKey)

    if (document.getElementById(HelpModalId) == null && !helpModalAlreadyDisplayed) {
      this.logger.error('Netflix GUI seems to be differents, maybe user is part of an AB Test')
      document.body.appendChild(HelpModal())

      setTimeout(() => {
        document.getElementById(HelpModalId).remove()
        sessionStorage.setItem(cacheKey, '1')
      }, 10000)
    }
  }
}
