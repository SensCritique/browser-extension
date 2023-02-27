import md5 from 'blueimp-md5'
import { VideoInfo } from '../http/Client'
import { Service } from '../enum/Service'

export default class Cache {
  private readonly prefix: string

  constructor() {
    this.prefix = 'senscritique_extension_'
  }

  save(videoInfo: VideoInfo): VideoInfo
   {
    sessionStorage.setItem(
      this.prefix + videoInfo.hash,
      JSON.stringify(videoInfo)
    )

    return videoInfo
  }

  get(hash: string): VideoInfo {
    return JSON.parse(sessionStorage.getItem(this.prefix + hash))
  }

}
