import Manager from './dom/Manager'

const manager = new Manager()

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

const observer = new MutationObserver((mutations) => {
  // Only listen mutation of added jawBones
  const jawboneMutation = mutations.filter(mutation => {
    return clickedOnVideoJawBone(mutation) || clickedOnImageJawBone(mutation) || clickOnArrowsJawbone(mutation)
  })
  if (jawboneMutation.length > 0) {
    manager.refreshRatings()
  }
})
observer.observe(document.querySelector('.mainView'), observerConfig)

// setInterval(() => {
//   manager.refreshRatings();
// }, 2000);
