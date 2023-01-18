import Netflix from './dom/providers/Netflix'
import Disney from './dom/providers/Disney'
import { NetflixConfig } from './config/Netflix'
import { Provider } from './enum/Provider'
import { ProviderUrlDomain } from './enum/ProviderUrlDomain'
import md5 from 'blueimp-md5'

const netflix = new Netflix()
const disney = new Disney()
const domainOrigin = (new URL(window.location.href))?.origin
let timer = 0

setInterval(() => {
  if (domainOrigin) {
    switch (domainOrigin) {
      case ProviderUrlDomain.DISNEY:
        disney.refreshRatings()
        break
      default:
        netflix.refreshRatings()
        break
    }
  }
}, 1000)

// Check if user has accepted AB Tests
setInterval(async () => {
  /*
   * Temporary disable modals
  switch (domainOrigin) {
    case ProviderUrlDomain.DISNEY:
      disney.refreshRatings()
      break
    default:
      netflix.refreshRatings()
      break
  }
  const ratingsHash = md5(videoName)
  const ratingsElements = document.getElementsByClassName(ratingsHash)

  if (ratingsElements.length === 0 && timer > 3 && manager.currentVideoId() !== null && await Netflix.canABTest()) {
    manager.showAbTestModal()
  }
  if (ratingsElements.length === 0 && timer > 3 && manager.currentVideoId() !== null && !await Netflix.canABTest()) {
    manager.showNotSupportedModal()
  }
   */
  timer = timer + 1
}, 5000)
