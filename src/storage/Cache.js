import md5 from 'blueimp-md5'

export default class Cache {
  constructor () {
    this.prefix = 'noteflix_'
  }

  save (videoInfo, service) {
    videoInfo.hashId = md5(`${service}_${videoInfo.name}`)
    sessionStorage.setItem(this.prefix + videoInfo.hashId, JSON.stringify(videoInfo))

    return videoInfo
  }

  get (videoName, service) {
    const hashId = md5(`${service}_${videoName}`)
    return JSON.parse(sessionStorage.getItem(this.prefix + hashId))
  }

  exists (videoName, service) {
    const hashId = md5(`${service}_${videoName}`)
    return sessionStorage.getItem(this.prefix + hashId)
  }
}
