import * as md5 from 'blueimp-md5';

export default class Cache {
  constructor() {
    this.prefix = 'noteflix_';
  }

  save(videoInfo) {
    videoInfo.hashId = md5(videoInfo.name);
    sessionStorage.setItem(this.prefix + videoInfo.hashId, JSON.stringify(videoInfo));

    return videoInfo;
  }

  get(videoName) {
    const hashId = md5(videoName);
    return JSON.parse(sessionStorage.getItem(this.prefix + hashId));
  }

  exists(videoName) {
    const hashId = md5(videoName);
    return sessionStorage.getItem(this.prefix + hashId);
  }
}
