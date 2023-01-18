import { VideoInfo } from './http/Client'
import { Service } from './enum/Service'
import SensCritique from './http/SensCritique'
import { MessageEvent } from './dom/MessageEvent'
import { VideoType } from './enum/VideoType'

const senscritique = new SensCritique()

export interface Message {
  type: MessageEvent,
  service: string,
  videoName: string,
  videoYear: string,
  videoType: VideoType,
  seasons: string,
}

const fetchInfo = async (message: Message): Promise<VideoInfo> => senscritique.getVideoInfo(message.videoName, message.videoType, message.videoYear, message.seasons)

chrome.runtime.onMessage.addListener((message: Message, sender: void, callback: Function) => {
  fetchInfo(message).then(response => {
    callback(response)
  })

  return true
})
