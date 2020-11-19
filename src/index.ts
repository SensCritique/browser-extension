import Manager from './dom/Manager'
import { Netflix } from './config/Netflix'

const manager = new Manager()
let jawboneEventFound = false

setInterval(() => {
  manager.refreshRatings()
}, 2000)

// Check if user has accepted AB Tests
setInterval(async () => {
  if (!jawboneEventFound && manager.currentVideoId() !== null && await Netflix.canABTest()) {
    manager.showAbTestModal()
  }
  if (!jawboneEventFound && manager.currentVideoId() !== null && !await Netflix.canABTest()) {
    manager.showNotSupportedModal()
  }
}, 5000)
