import Manager from './dom/Manager'

/*
 * Try to init/log something before everything
 */
import { datadogLogs } from '@datadog/browser-logs';

console.log('BEFORE DATADOG');
datadogLogs.init({
  clientToken: 'pubc30aa1ecd1610ba9063d923d909eedc5',
  datacenter: 'eu',
  forwardErrorsToLogs: true,
  sampleRate: 100
});

datadogLogs.logger.info('TEST', { name: 'POUET' });
console.log('AFTER DATADOG');
/*
 *
 */


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
    manager.refreshRatings()
  }
})

observer.observe(document.getElementById('appMountPoint'), observerConfig)
