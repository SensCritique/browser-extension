import { VideoInfo } from './http/Client'
import SensCritique from './http/SensCritique'
import { MessageEvent } from './dom/MessageEvent'
import { VideoType } from './enum/VideoType'
import { LogSeverity } from './enum/LogSeverity'

const senscritique = new SensCritique()

export interface Message {
  type: MessageEvent
  service: string
  videoName: string
  videoYear: string
  videoType: VideoType
  seasons: string
  provider: string
}

const fetchInfo = async (message: Message): Promise<VideoInfo> =>
  senscritique.getVideoInfo(
    message.videoName,
    message.videoType,
    message.videoYear,
    message.seasons,
    message.provider
  )

chrome.runtime.onMessage.addListener(
  (message: Message, sender: void, callback: (response: VideoInfo) => void) => {
    fetchInfo(message).then((response) => {
      callback(response)
    })

    return true
  }
)

export class Logger {
  static info(message: string, context: Record<string, unknown> = {}): void {
    Logger.log(LogSeverity.INFO, message, context)
  }

  static error(message: string, context: Record<string, unknown> = {}): void {
    Logger.log(LogSeverity.ERROR, message, context)
  }

  static warning(message: string, context: Record<string, unknown> = {}): void {
    Logger.log(LogSeverity.WARNING, message, context)
  }

  static debug(message: string, context: Record<string, unknown> = {}): void {
    Logger.log(LogSeverity.DEBUG, message, context)
  }

  static log(
    severity: LogSeverity,
    message: string,
    context: Record<string, unknown> = {}
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
