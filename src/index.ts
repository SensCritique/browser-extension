import Netflix from './dom/providers/Netflix'
import Disney from './dom/providers/Disney'
import PrimeVideo from './dom/providers/PrimeVideo'
import Canal from './dom/providers/Canal'
import { ProviderUrlDomain } from './enum/ProviderUrlDomain'
import { LogSeverityId } from './enum/LogSeverity'
import Logger from './logging/Logger'

const netflix = new Netflix()
const disney = new Disney()
const primeVideo = new PrimeVideo()
const canal = new Canal()
const domain = window.location.hostname

setInterval(() => {
  if (domain) {
    switch (domain) {
      case ProviderUrlDomain.DISNEY:
        disney.refreshModalRatings()
        break
      case ProviderUrlDomain.AMAZON:
        primeVideo.refreshRatings()
        break
      case ProviderUrlDomain.CANALPLUS:
        canal.refreshRatings()
        break
      default:
        netflix.refreshRatings()
        break
    }
  }
}, 1000)

// Receive events from back
chrome.runtime.onMessage.addListener((event) => {
  const logger = new Logger()
  const { context, message, severity } = event

  switch (severity) {
    case LogSeverityId.ERROR:
      logger.error(message, {
        ...context,
      })
      break
    case LogSeverityId.DEBUG:
      logger.debug(message, {
        ...context,
      })
      break
    default:
      logger.info(message, {
        ...context,
      })
  }
})
