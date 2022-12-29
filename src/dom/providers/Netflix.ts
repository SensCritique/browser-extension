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

export default class Netflix {
  private cache: Cache
  private logger: Logger

  constructor () {
    this.cache = new Cache()
    this.logger = new Logger()
  }

  refreshRatings () {
    const videoName = this.getVideoName()
    const modal = document.querySelector('.detail-modal')
    const hash = md5(videoName)

    if (videoName && modal?.getElementsByClassName(hash).length === 0) {
      // Create main div for Ratings
      const infoElement = modal.querySelector(
        '.previewModal--detailsMetadata-info'
      )
      if (infoElement) {
        const ratingsElement = Ratings.render(hash, Provider.NETFLIX)
        infoElement.prepend(ratingsElement)
      }
      this.getRating(videoName, modal, Service.SENSCRITIQUE)
    }
  }

  getVideoName (): string | null {
    const detailModalVideoName = document
      .querySelector('.previewModal--player-titleTreatment-logo')
      ?.getAttribute('alt')

    return detailModalVideoName || null
  }

  getVideoYear (): string {
    const yearElement: HTMLElement = document.querySelector(
      '.detail-modal .year'
    )

    return yearElement?.innerText
  }

  getVideoType (): VideoType {
    console.log('document', document)
    const episodesElement = document.querySelector(
      '.detail-modal .episodeSelector'
    )
    console.log('episodesElement', episodesElement)

    return episodesElement == null ? VideoType.MOVIE : VideoType.SERIE
  }

  getRating (videoName: string, jawbone: Element, service: Service): void {
    const videoInfoFound = this.cache.get(videoName, service)
    console.log(videoInfoFound)
    console.log('this.getVideoType()', this.getVideoType())
    if (!videoInfoFound) {
      manager.getVideoInfo(
        service,
        videoName,
        this.getVideoYear(),
        this.getVideoType(),
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
