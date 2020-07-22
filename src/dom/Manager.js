import Cache from '../storage/Cache'
import MessageEventEnum from './MessageEventEnum'
import VideoTypeEnum from '../http/VideoTypeEnum'
import Ratings from './Ratings'
import * as md5 from 'blueimp-md5'
import RatingFactory from './RatingFactory'
import { ServiceEnum } from '../http/ServiceEnum'

export default class Manager {
  constructor () {
    this.cache = new Cache()
  }

  getVideoInfo (service, videoName, videoYear, videoType, callback) {
    chrome.runtime.sendMessage({ type: MessageEventEnum.INFO, service, videoName, videoYear, videoType }, callback)
  }

  getRating (service, videoInfo, callback) {
    chrome.runtime.sendMessage({ type: MessageEventEnum.RATING, service, value: videoInfo }, callback)
  }

  refreshRatings () {
    const jawbones = this.getJawbones()

    for (const jawbone of jawbones) {
      const videoName = this.getVideoName(jawbone)
      // Create main div for Ratings
      const jawboneOverviewInfo = jawbone.getElementsByClassName('jawbone-overview-info')[0]
      const hash = md5(videoName)
      if (jawboneOverviewInfo && jawbone.getElementsByClassName(hash).length === 0) {
        const ratingsElement = Ratings.render(hash)
        jawboneOverviewInfo.prepend(ratingsElement)
      }

      this.getAllocineRating(videoName, jawbone)
      this.getSensCritiqueRating(videoName, jawbone)
    }
  }

  getJawbones () {
    return document.getElementsByClassName('jawBone')
  }

  getVideoName (jawbone) {
    return jawbone.querySelector('.logo').getAttribute('alt')
  }

  getVideoYear (jawbone) {
    const yearElement = jawbone.querySelector('.year')
    return yearElement == null ? null : yearElement.innerText
  }

  getVideoType (jawbone) {
    const episodesElement = jawbone.querySelector('.Episodes')

    return episodesElement == null ? VideoTypeEnum.MOVIE : VideoTypeEnum.SERIE
  }

  getSensCritiqueRating (videoName, jawbone) {
    const videoInfoFound = this.cache.get(videoName, ServiceEnum.SENSCRITIQUE)
    if (!videoInfoFound) {
      this.getVideoInfo(ServiceEnum.SENSCRITIQUE, videoName, this.getVideoYear(jawbone), this.getVideoType(jawbone), videoInfo => {
        this.renderRating(ServiceEnum.SENSCRITIQUE, jawbone, videoInfo)
      })
    }
    if (videoInfoFound) {
      this.renderRating(ServiceEnum.SENSCRITIQUE, jawbone, videoInfoFound)
    }
  }

  getAllocineRating (videoName, jawbone) {
    const videoInfoFound = this.cache.get(videoName, ServiceEnum.ALLOCINE)
    if (!videoInfoFound) {
      this.getVideoInfo(ServiceEnum.ALLOCINE, videoName, this.getVideoYear(jawbone), this.getVideoType(jawbone), videoInfo => {
        this.renderRating(ServiceEnum.ALLOCINE, jawbone, videoInfo)
      })
    }
    if (videoInfoFound) {
      this.renderRating(ServiceEnum.ALLOCINE, jawbone, videoInfoFound)
    }
  }

  renderRating (service, element, videoInfo) {
    this.cache.save(videoInfo, service)

    const ratingElement = (new RatingFactory())
      .create(service, videoInfo)
      .render()
    document.querySelectorAll(`.${service}_${md5(videoInfo.name)}`).forEach(serviceElement => serviceElement.innerHTML = ratingElement.outerHTML)
  }
}
