import { datadogLogs, Logger as DatadogLogger, Datacenter } from '@datadog/browser-logs'
import { Context } from '@datadog/browser-core'
import { NetflixConfig } from '../config/Netflix'

export default class Logger {
  private logger: DatadogLogger;

  constructor () {
    datadogLogs.init({
      clientToken: 'pub1f890f3f4bba51239626c87fd4e723a4',
      datacenter: Datacenter.US,
      forwardErrorsToLogs: false,
      sampleRate: 100
    })

    this.logger = datadogLogs.createLogger('main', {
      context: {
        app_version: chrome.runtime.getManifest().version,
        netflix_ui_version: NetflixConfig.getUiVersion(),
        service: 'senscritique-extension'
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
