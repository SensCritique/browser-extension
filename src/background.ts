import { VideoInfo } from './http/Client'
import SensCritique from './http/SensCritique'
import { MessageEvent } from './dom/MessageEvent'
import { VideoType } from './enum/VideoType'
import { LogSeverity } from './enum/LogSeverity'
import { Provider } from './enum/Provider'
import { BrowserExtensionProduct } from './type/BrowserExtensionProduct'

const senscritique = new SensCritique()

export interface Message {
  service: Provider
  type: MessageEvent
  searchType: 'platform_id' | 'video_info'
}

export interface ProductPlatformMessage extends Message {
  platformProductIds: number[]
}

export interface ProductMessage extends Message {
  videoName: string
  videoYear: string
  videoType: VideoType
  seasons: string
  provider: string
}

const fetchInfo = async (message: ProductMessage): Promise<VideoInfo> =>
  senscritique.getVideoInfo(
    message.videoName,
    message.videoType,
    message.videoYear,
    message.seasons,
    message.provider
  )
const fetchInfoByPlatformId = async (
  message: ProductPlatformMessage
): Promise<BrowserExtensionProduct[]> => {
  const browserExtensionProducts = await senscritique.getProductRatingsByPlatformId(
    message.platformProductIds,
    message.service
  )
  browserExtensionProducts.forEach(product => {
    if(product.rating === null) {
      Logger.error(`Rating missing for product platform ID:${product.platformId}`, {
        messageEvent: message,
        platformProductId: product.platformId,
        error: 'missing_rating'
      })
    }
  })


  return browserExtensionProducts
}
  

// Receive events from front
chrome.runtime.onMessage.addListener(
  (message: Message, sender: void, callback: (response: VideoInfo | BrowserExtensionProduct[]) => void) => {
    if (message?.type !== MessageEvent.INFO) {
      return true
    }

    switch (message.searchType) {
      case 'video_info':
        fetchInfo(message as ProductMessage).then((response) => {
          callback(response)
        })
        break
      case 'platform_id':
        fetchInfoByPlatformId(message as ProductPlatformMessage).then(
          (response) => {
            callback(response)
          }
        )
        break
    }

    return true
  }
)

export class Logger {
  static info(message: string, context: object = {}): void {
    Logger.log(LogSeverity.INFO, message, context)
  }

  static error(message: string, context: object = {}): void {
    Logger.log(LogSeverity.ERROR, message, context)
  }

  static warning(message: string, context: object = {}): void {
    Logger.log(LogSeverity.WARNING, message, context)
  }

  static debug(message: string, context: object = {}): void {
    Logger.log(LogSeverity.DEBUG, message, context)
  }

  static log(
    severity: LogSeverity,
    message: string,
    context: object = {}
  ): void {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) {
      chrome.tabs
        .query({
          currentWindow: true,
          active: true,
        })
        .then((tabs: unknown) => {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: MessageEvent.LOG,
            severity,
            message,
            context,
          })
        })
        .catch((error: Error) => {
          console.error(`Error: ${error}`)
        })
    } else {
      browser.tabs
        .query({
          currentWindow: true,
          active: true,
        })
        .then((tabs: unknown) => {
          browser.tabs.sendMessage(tabs[0].id, {
            type: MessageEvent.LOG,
            severity,
            message,
            context,
          })
        })
        .catch((error: Error) => {
          console.error(`Error: ${error}`)
        })
    }
  }
}
