import Cache from '../storage/Cache'
import { MessageEvent } from './MessageEvent'
import Logger from '../logging/Logger'
import { Message } from '../background'
import { VideoInfo } from '../http/Client'
import { BrowserExtensionProduct } from '../type/BrowserExtensionProduct'

export default class Manager {
  protected cache: Cache
  protected logger: Logger
  protected baseUrl: string

  constructor() {
    this.cache = new Cache()
    this.logger = new Logger()
    this.baseUrl = 'https://www.senscritique.com'
  }

  getVideoInfo(
    service: string,
    videoName: string,
    videoYear: string,
    videoType: string,
    seasons: string,
    provider: string,
    callback: (response: VideoInfo) => void
  ): void {
    chrome.runtime.sendMessage(
      {
        type: MessageEvent.INFO,
        searchType: 'video_info',
        service,
        videoName,
        videoYear,
        videoType,
        seasons,
        provider,
      } as Message,
      callback
    )
  }

  getRatingsByPlatformId(
    service: string,
    platformProductIds: string[],
    callback: (browserExtensionProducts: BrowserExtensionProduct[]) => void
  ): void {
    if (platformProductIds.length) {
      chrome.runtime.sendMessage(
        {
          type: MessageEvent.INFO,
          searchType: 'platform_id',
          service,
          platformProductIds,
        } as Message,
        callback
      )
    }
  }
}
