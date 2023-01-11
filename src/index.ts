import Netflix from './dom/providers/Netflix'
import Disney from './dom/providers/Disney'
import { NetflixConfig } from './config/Netflix'
import { Provider } from './http/Provider'
import md5 from 'blueimp-md5'

const netflix = new Netflix()
const disney = new Disney()
let timer = 0

setInterval(() => {
  if (window.location.href && window.location.href.includes(Provider.DISNEY)) disney.refreshRatings()
  else netflix.refreshRatings()
}, 1000)

// Check if user has accepted AB Tests
setInterval(async () => {
  let videoName = null
  if (window.location.href && window.location.href.includes(Provider.DISNEY)) videoName = disney.refreshRatings()
  else videoName = netflix.refreshRatings()
  const ratingsHash = md5(videoName)
  const ratingsElements = document.getElementsByClassName(ratingsHash)

  /*
   * Temporary disable modals

  if (ratingsElements.length === 0 && timer > 3 && manager.currentVideoId() !== null && await Netflix.canABTest()) {
    manager.showAbTestModal()
  }
  if (ratingsElements.length === 0 && timer > 3 && manager.currentVideoId() !== null && !await Netflix.canABTest()) {
    manager.showNotSupportedModal()
  }
   */
  timer = timer + 1
}, 5000)
