import Manager from './dom/Manager'

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

// Check every 5 seconds if current version of Netflix is supported
setInterval(async () => {
  if (!jawboneEventFound && manager.currentVideoId() !== null) {
    await manager.showHelp()
  }
}, 5000)
