import { VideoInfo } from './http/Client'
import { Service } from './http/Service'
import SensCritique from './http/SensCritique'
import { MessageEvent } from './dom/MessageEvent'
import { VideoType } from './http/VideoType'

const senscritique = new SensCritique()

export interface Message {
  type: MessageEvent,
  service: string,
  videoName: string,
  videoYear: string,
  videoType: VideoType,
}

const fetchInfo = async (message: Message): Promise<VideoInfo> => {
  switch (message.service) {
    case Service.SENSCRITIQUE:
      return senscritique.getVideoInfo(message.videoName, message.videoType, message.videoYear)
  }
}

chrome.runtime.onMessage.addListener((message: Message, sender: void, callback: Function) => {
  fetchInfo(message).then(response => {
    callback(response)
  })

  return true
})
