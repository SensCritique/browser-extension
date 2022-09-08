import { datadogLogs, Logger as DatadogLogger, Datacenter } from '@datadog/browser-logs'
import { Context } from '@datadog/browser-core'
import { Netflix } from '../config/Netflix'

import { datadogClientToken } from '../conf'

export default class Logger {
  private logger: DatadogLogger;

  constructor () {
    datadogLogs.init({
      clientToken: datadogClientToken,
      datacenter: Datacenter.US,
      forwardErrorsToLogs: false,
      sampleRate: 100
    })

    this.logger = datadogLogs.createLogger('main', {
      context: {
        app_version: chrome.runtime.getManifest().version,
        netflix_ui_version: Netflix.getUiVersion(),
        service: 'noteflix'
      }
    })
  }

  info (message: string, context: Context = {}) {
    this.logger.info(message, context)
  }

  error (message: string, context: Context = {}) {
    this.logger.error(message, context)
  }

  warning (message: string, context: Context = {}) {
    this.logger.warn(message, context)
  }

  debug (message: string, context: Context = {}) {
    this.logger.debug(message, context)
  }
}
