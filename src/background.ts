import Allocine from './http/Allocine'
import {Service} from './http/Service'
import SensCritique from './http/SensCritique'
import {MessageEvent} from "./dom/MessageEvent";
import {VideoType} from "./http/VideoType";

const allocine = new Allocine()
const senscritique = new SensCritique()

export interface Message {
  type: MessageEvent,
  service: string,
  videoName: string,
  videoYear: string,
  videoType: VideoType,
}

const fetchInfo = async (message: Message) => {
  switch (message.service) {
    case Service.ALLOCINE:
      return allocine.getVideoInfo(message.videoName, message.videoType, message.videoYear)
    case Service.SENSCRITIQUE:
      return senscritique.getVideoInfo(message.videoName, message.videoType, message.videoYear)
  }
}

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  fetchInfo(message).then(response => {
    callback(response)
  })

  return true
})
