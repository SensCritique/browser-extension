import Allocine from '../http/Allocine';
import Rating from './Rating';
import FailedRating from './FailedRating';
import Cache from '../storage/Cache';

const cssForDiv =
  'color: #fecc00; ' +
  'z-index: 100; ' +
  'margin-bottom:1em;' +
  'position: relative;' +
  'height: 3em;' +
  'width: 3em';

export default class Manager {
  constructor() {
    this.client = new Allocine;
    this.cache = new Cache();
  }

  refreshRatings() {
    const items = this.getJawbones();
    console.log('Finding movies/series...');
    for (const item of items) {
      const videoName = this.getVideoName(item);
      if (videoName && !this.cache.exists(videoName)) {
        this.addRating(videoName, item);
      }
      if (this.cache.exists(videoName)) {
        this.addRating(videoName, item, true);
      }
    }
  }

  getJawbones() {
    return document.getElementsByClassName('jawBone');
  }

  getVideoName(element) {
    return element.querySelector('.logo').getAttribute('alt');
  }


  async addRating(videoName, element, useCache = false) {
    let videoInfo;
    if (!useCache) {
      videoInfo = await this.client.getVideoInfo(videoName);
      if(!videoInfo.type) {
        // The movie/serie is not recognized
        this.renderRating(element, videoInfo, true);

        return videoInfo;
      }
      const rating = await this.client.getRating(videoInfo);
      if (!rating) {
        // There is no rating available
        this.renderRating(element, videoInfo, true);

        return videoInfo;
      }
      videoInfo.rating = rating;
      this.renderRating(element, videoInfo);
    } else {
      videoInfo = this.cache.get(videoName);
      this.renderRating(element, videoInfo, videoInfo.rating == null);
    }


    return videoInfo;
  }

  createRatingElements(videoInfo) {
    let div = document.createElement('div');
    div.setAttribute('style', cssForDiv);
    let a = document.createElement('a');
    a.setAttribute('id', videoInfo.hashId);
    a.setAttribute('href', videoInfo.link);
    a.setAttribute('target', '_blank');
    div.appendChild(a);

    return {
      div,
      a,
    };
  }

  createSucceedRatingElement(videoInfo) {
    videoInfo.link = this.client.buildRatingUrl(videoInfo);

    return this.createRatingElements(videoInfo);
  }

  createFailedRatingElement(videoInfo) {
    videoInfo.link = this.client.buildRedirectUrl(videoInfo.name);

    return this.createRatingElements(videoInfo);
  }

  renderRating(element, videoInfo, isFailed = false) {
    let ratingElement;
    const videoElement = document.getElementById(videoInfo.hashId);
    if(!videoElement) {
      console.log('on render');
      videoInfo = this.cache.save(videoInfo);
      if (isFailed) {
        ratingElement = this.renderFailedRating(element, videoInfo);
      } else {
        ratingElement = this.renderSucceedRating(element, videoInfo);
      }
      element.getElementsByClassName('jawbone-overview-info')[0].prepend(ratingElement);
    }
  }

  renderSucceedRating(element, videoInfo) {
    const {div, a} = this.createSucceedRatingElement(videoInfo);
    const ratingElement = new Rating(videoInfo.rating);
    ratingElement.createProgressBar(a);

    return div;
  }

  renderFailedRating(element, videoInfo) {
    const {div, a} = this.createFailedRatingElement(videoInfo);
    const ratingElement = new FailedRating();
    ratingElement.createProgressBar(a);

    return div;
  }
}
