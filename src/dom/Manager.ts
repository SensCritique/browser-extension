import Cache from '../storage/Cache'
import { MessageEvent } from './MessageEvent'
import Logger from '../logging/Logger'
import { Message } from '../background'
import { VideoInfo } from '../http/Client'
import { BrowserExtensionProduct } from '../type/BrowserExtensionProduct'

export default class Manager {
  protected cache: Cache
  protected logger: Logger

  constructor() {
    this.cache = new Cache()
    this.logger = new Logger()
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

  getVideoInfoByPlatformId(
    service: string,
    platformProductIds: number[],
    callback: (browserExtensionProducts: BrowserExtensionProduct[]) => void
  ): void {
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
