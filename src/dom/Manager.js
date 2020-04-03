import Allocine from '../http/Allocine';
import Rating from './Rating';

const cssForDiv =
  'color: #fecc00; ' +
  'z-index: 100; ' +
  'padding-top:.2em; ' +
  'position:absolute;' +
  'height: 45px;' +
  'width: 45px';

export default class Manager {
  constructor() {
    this.client = new Allocine;
    this.cache = {};
  }

  supports(mutationsRecords) {
    let isSupported = false;
    for(const mutationsRecord of mutationsRecords) {
      if(mutationsRecord.target.classList.contains('jawBoneContainer')){
        isSupported = true;
        break;
      }
    }

    return isSupported;
  }

  refreshRatings() {
    const items = this.getJawbones();
    console.log('Finding movies/series...');
    for (const item of items) {
      const videoName = this.getVideoName(item);
      if (videoName && !this.isVideoCached(videoName)) {
        this.addRating(videoName, item).then((videoInfo) => {
          console.log(`Note allociné pour '${videoInfo.name}' ajoutée.`);
        });
      }
      if (this.isVideoCached(videoName)) {
        this.addRating(videoName, item, true).then(videoInfo => {
            console.log(`Note allociné pour '${videoInfo.name}' récupérée en cache.`)
          },
        );
      }
    }
  }

  getJawbones() {
    return document.getElementsByClassName('jawBone');
  }

  isVideoCached(videoName) {
    return Object.keys(this.cache).includes(videoName);
  }

  getVideoName(element) {
    return element.querySelector('.logo').getAttribute('alt');
  }

  async addRating(videoName, element, useCache = false) {
    let videoInfo;
    if(!useCache) {
      videoInfo = await this.client.getVideoInfo(videoName);
      videoInfo['rating'] = await this.client.getRating(videoInfo);
      videoInfo['link'] = this.client.buildRatingUrl(videoInfo);
      this.cache[videoName] = videoInfo;
    } else {
      videoInfo = this.cache[videoName];
    }
    let div = document.createElement('div');
    div.setAttribute('style', cssForDiv);
    let a = document.createElement('a');
    const id = 'noteflix_'+videoInfo.id;
    a.setAttribute('id', id);
    a.setAttribute('href', videoInfo.link);
    a.setAttribute('target', '_blank');
    div.appendChild(a);
    const videoElement = document.getElementById(id);
    if(!videoElement) {
      element.getElementsByClassName('jawbone-overview-info')[0].appendChild(div);
    }
    const ratingElement = new Rating(videoInfo.rating);
    ratingElement.createProgressBar(a);

    return videoInfo;
  }
}
