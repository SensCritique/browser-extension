import Cache from '../../storage/Cache'
import Ratings from '../Ratings'
import md5 from 'blueimp-md5'
import { Service } from '../../http/Service'
import { Provider } from '../../http/Provider'
import Logger from '../../logging/Logger'
import Manager from '../Manager'
import { VideoType } from '../../http/VideoType'
import { VideoInfo } from '../../http/Client'

const manager = new Manager()

export default class Disney {
  private cache: Cache
  private logger: Logger

  constructor () {
    this.cache = new Cache()
    this.logger = new Logger()
  }

  refreshRatings () {
    const videoName = this.getVideoName()
    const modal = document.querySelector('.sc-gCUMDz')
    const hash = md5(videoName)

    if (videoName && modal?.getElementsByClassName(hash).length === 0) {
      if (modal) {
        const ratingsElement = Ratings.render(hash, Provider.DISNEY)
        modal.prepend(ratingsElement)
      }
      console.log('here')
      this.getRating(videoName, modal, Service.SENSCRITIQUE, Provider.DISNEY)
    }
  }

  getVideoName (): string | null {
    const detailModalVideoName = document
      .querySelector('#unauth-navbar-target')
      ?.firstElementChild
      ?.getAttribute('alt')

    return detailModalVideoName || null
  }

  getVideoYear (provider: string): string {
    const yearElement: HTMLElement = document.querySelector('.sc-jOVcOr')
    return yearElement?.innerText
  }

  getVideoType (provider: string): VideoType {
    console.log('document', document)
    const episodesElement = document.querySelector(
      '.detail-modal .episodeSelector'
    )
    console.log('episodesElement', episodesElement)

    return episodesElement == null ? VideoType.MOVIE : VideoType.SERIE
  }

  getRating (videoName: string, jawbone: Element, service: Service, provider: string): void {
    const videoInfoFound = this.cache.get(videoName, service)
    console.log(videoInfoFound)
    console.log('this.getVideoType()', this.getVideoType(provider))
    if (!videoInfoFound) {
      manager.getVideoInfo(
        service,
        videoName,
        this.getVideoYear(provider),
        this.getVideoType(provider),
        (videoInfo: VideoInfo) => {
          console.log('videoInfo', videoInfo)
          manager.renderRating(service, jawbone, videoInfo)
        }
      )
    }
    if (videoInfoFound) {
      manager.renderRating(service, jawbone, videoInfoFound)
    }
  }
}
