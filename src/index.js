import Manager from './dom/Manager'

const manager = new Manager()
let jawboneEventFound = false

const observerConfig = {
  childList: true,
  subtree: true
}

const clickedOnVideoJawBone = (mutation) => {
  return mutation.type === 'childList' &&
    mutation.addedNodes.length > 0 &&
    mutation.target &&
    (
      mutation.target.classList.contains('jawBoneContent') ||
      mutation.target.classList.contains('jawBoneContainer')
    )
}

const clickedOnImageJawBone = (mutation) => {
  return mutation.type === 'childList' &&
    mutation.addedNodes.length > 0 &&
    mutation.target &&
    mutation.target.classList.contains('jawBoneOpenContainer')
}

const clickOnArrowsJawbone = (mutation) => {
  return mutation.type === 'childList' &&
    mutation.addedNodes.length > 0 &&
    mutation.target &&
    mutation.target.classList.contains('jawBone')
}

const isLoaded = (mutation) => {
  return mutation.type === 'childList' &&
    mutation.previousSibling &&
    mutation.previousSibling.classList.contains('jawBoneContainer') &&
    mutation.addedNodes.length > 0
}

const observer = new MutationObserver((mutations) => {
  // Only listen mutation of added jawBones
  const jawboneMutation = mutations.filter(mutation => {
    return clickedOnVideoJawBone(mutation) ||
      clickedOnImageJawBone(mutation) ||
      clickOnArrowsJawbone(mutation) ||
      isLoaded(mutation)
  })
  if (jawboneMutation.length > 0) {
    jawboneEventFound = true
    manager.refreshRatings()
  }
})

observer.observe(document.getElementById('appMountPoint'), observerConfig)

// Check every 5 seconds if current version of Netflix is supported
setInterval(() => {
  if (!jawboneEventFound && manager.currentVideoId() !== null) {
    manager.showHelp()
  }
}, 5000)
