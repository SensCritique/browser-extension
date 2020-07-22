import Allocine from './http/Allocine'
import { ServiceEnum } from './http/ServiceEnum'
import SensCritique from './http/SensCritique'

const allocine = new Allocine()
const senscritique = new SensCritique()

const fetchInfo = async (message, callback) => {
  switch (message.service) {
    case ServiceEnum.ALLOCINE:
      return allocine.getVideoInfo(message.videoName, message.videoYear, message.videoType, callback)
    case ServiceEnum.SENSCRITIQUE:
      return senscritique.getVideoInfo(message.videoName, message.videoYear, message.videoType, callback)
  }
}

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  fetchInfo(message, callback).then(response => {
    callback(response)
  })

  return true
})
