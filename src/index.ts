import Manager from './dom/Manager'
import { Netflix } from './config/Netflix'
import md5 from 'blueimp-md5'

const manager = new Manager()
let timer = 0

setInterval(() => {
  manager.refreshRatings()
}, 2000)

// Check if user has accepted AB Tests
setInterval(async () => {
  const videoName = manager.getVideoName()
  const ratingsHash = md5(videoName)
  const ratingsElements = document.getElementsByClassName(ratingsHash)

  if (ratingsElements.length === 0 && timer > 3 && manager.currentVideoId() !== null && await Netflix.canABTest()) {
    manager.showAbTestModal()
  }
  if (ratingsElements.length === 0 && timer > 3 && manager.currentVideoId() !== null && !await Netflix.canABTest()) {
    manager.showNotSupportedModal()
  }
  timer = timer + 1
}, 5000)
