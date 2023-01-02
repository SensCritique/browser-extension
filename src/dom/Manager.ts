import Cache from '../storage/Cache'
import { MessageEvent } from './MessageEvent'
import Logger from '../logging/Logger'
import {
  ABTestModal,
  AbTestModalId,
  NotSupportedModal,
  NotSupportedModalId
} from './Modals'
import { Message } from '../background'

export default class Manager {
  private cache: Cache
  private logger: Logger

  constructor () {
    this.cache = new Cache()
    this.logger = new Logger()
  }

  getVideoInfo (
    service: string,
    videoName: string,
    videoYear: string,
    videoType: string,
    callback: Function
  ): void {
    chrome.runtime.sendMessage(
      {
        type: MessageEvent.INFO,
        service,
        videoName,
        videoYear,
        videoType
      } as Message,
      callback
    )
  }

  showAbTestModal (): void {
    const cacheKey = 'senscritique_extension_help'
    const helpModalAlreadyDisplayed = sessionStorage.getItem(cacheKey)

    if (
      document.getElementById(AbTestModalId) == null &&
      !helpModalAlreadyDisplayed
    ) {
      this.logger.error(
        'Netflix GUI seems to be differents, user is part of an AB Test'
      )
      document.body.appendChild(ABTestModal())
      sessionStorage.setItem(cacheKey, '1')

      document.getElementById(AbTestModalId).addEventListener('click', () => {
        document.getElementById(AbTestModalId).remove()
      })
    }
  }

  showNotSupportedModal (): void {
    const cacheKey = 'senscritique_extension_not_supported'
    const NotSupportedModalIdDisplayed = sessionStorage.getItem(cacheKey)

    if (
      document.getElementById(NotSupportedModalId) == null &&
      !NotSupportedModalIdDisplayed
    ) {
      this.logger.error('A newer GUI version seems available')
      document.body.appendChild(NotSupportedModal())
      sessionStorage.setItem(cacheKey, '1')

      document
        .getElementById(NotSupportedModalId)
        .addEventListener('click', () => {
          document.getElementById(NotSupportedModalId).remove()
        })
    }
  }
}
