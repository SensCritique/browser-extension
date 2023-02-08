import Cache from '../storage/Cache'
import { MessageEvent } from './MessageEvent'
import Logger from '../logging/Logger'
import { Message } from '../background'

export default class Manager {
  protected cache: Cache
  protected logger: Logger

  constructor () {
    this.cache = new Cache()
    this.logger = new Logger()
  }

  getVideoInfo (
    service: string,
    videoName: string,
    videoYear: string,
    videoType: string,
    seasons: string,
    provider: string,
    callback: Function
  ): void {
    chrome.runtime.sendMessage(
      {
        type: MessageEvent.INFO,
        service,
        videoName,
        videoYear,
        videoType,
        seasons,
        provider
      } as Message,
      callback
    )
  }
}
