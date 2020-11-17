import Manager from './dom/Manager'
import {Netflix} from './config/Netflix'

const manager = new Manager()
let jawboneEventFound = false

const observerConfig = {
  childList: true,
  subtree: true
}

const detailModalIsShown = (mutation) => {
  return mutation.type === 'childList' &&
    mutation.addedNodes.length > 0 &&
    mutation.addedNodes[0].classList.contains('detail-modal')
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (detailModalIsShown(mutation)) {
      jawboneEventFound = true
      manager.refreshRatings()
      break
    }
  }
})
observer.observe(document.getElementById('appMountPoint'), observerConfig)

// Check if user has accepted AB Tests
setInterval(async () => {
  if (!jawboneEventFound && manager.currentVideoId() !== null && await Netflix.canABTest()) {
    manager.showAbTestModal()
  }
  if (!jawboneEventFound && manager.currentVideoId() !== null && !await Netflix.canABTest()) {
    manager.showNotSupportedModal()
  }
}, 5000)
