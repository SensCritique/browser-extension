import { datadogLogs } from '@datadog/browser-logs'

export default class Logger {
  constructor () {
    datadogLogs.init({
      clientToken: 'pubfbf6abf237f445e8d52aaa35f5462964',
      datacenter: 'us',
      forwardErrorsToLogs: false,
      sampleRate: 100
    })

    this.logger = datadogLogs.createLogger('main', {
      context: {
        app_version: chrome.runtime.getManifest().version
      }
    })
  }

  info (message, context = null) {
    this.logger.info(message, context)
  }

  error (message, context = null) {
    this.logger.error(message, context)
  }

  warning (message, context = null) {
    this.logger.warn(message, context)
  }

  debug (message, context = null) {
    this.logger.debug(message, context)
  }
}
