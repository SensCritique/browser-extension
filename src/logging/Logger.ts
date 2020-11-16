import { datadogLogs, Logger as DatadogLogger, Datacenter } from '@datadog/browser-logs';
import { Netflix } from '../config/Netflix'

export default class Logger {
  private logger: DatadogLogger;

  constructor () {
    datadogLogs.init({
      clientToken: 'pubfbf6abf237f445e8d52aaa35f5462964',
      datacenter: Datacenter.US,
      forwardErrorsToLogs: false,
      sampleRate: 100
    })

    this.logger = datadogLogs.createLogger('main', {
      context: {
        app_version: chrome.runtime.getManifest().version,
        netflix_ui_version: Netflix.getUiVersion()
      }
    })
  }

  info (message, context = {}) {
    this.logger.info(message, context)
  }

  error (message, context = {}) {
    this.logger.error(message, context)
  }

  warning (message, context = {}) {
    this.logger.warn(message, context)
  }

  debug (message, context = {}) {
    this.logger.debug(message, context)
  }
}
