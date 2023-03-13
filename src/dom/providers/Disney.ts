import md5 from 'blueimp-md5'
import { Service } from '../../enum/Service'
import { Provider } from '../../enum/Provider'
import Manager from '../Manager'
import { VideoInfo } from '../../http/Client'
import { SensCritiqueRating } from '../SensCritiqueRating'
import { BrowserExtensionProduct } from '../../type/BrowserExtensionProduct'
import { generateRedirectUrl } from '../../helper/UrlGenerator'

export default class Disney extends Manager {
  refreshModalRatings(): void {
    const platformIdRegex = new URL(window.location.href)?.pathname?.match(
      // eslint-disable-next-line no-useless-escape
      /[^\/]+$/
    )
    if (platformIdRegex) {
      const platformId = platformIdRegex?.[0]

      const infoElement = document.querySelector(
        "[data-gv2containerkey='contentMeta']"
      )
      const hash = md5(platformId)
      const name = document
        .querySelector('#details_index img[alt]')
        ?.getAttribute('alt')

      this.getRating(platformId, infoElement, Service.SENSCRITIQUE, hash, name)
    }
  }

  getRating(
    platformId: string,
    element: Element,
    service: Service,
    hash: string,
    name: string = null
  ): void {
    const videoInfoFound = this.cache.get(hash)
    const hashClass = 'senscritique_' + hash

    if (element && !element.querySelector(`.${hashClass}`)) {
      const mainDiv = document.createElement('div')
      mainDiv.style.display = 'flex'
      mainDiv.classList.add(hashClass)
      element.prepend(mainDiv)

      if (!videoInfoFound) {
        this.getRatingsByPlatformId(
          Provider.DISNEY,
          [platformId],
          async (browserExtensionProducts: BrowserExtensionProduct[]) => {
            const browserExtensionProduct = browserExtensionProducts?.[0]
            if (browserExtensionProduct) {
              this.renderRating(service, element, {
                name,
                hash,
                id: '',
                platformId,
                redirect: await generateRedirectUrl(name),
                type: browserExtensionProduct.type,
                rating: browserExtensionProduct?.rating?.toString(),
                url: browserExtensionProduct.url,
              })
            }
          }
        )
      }
      if (videoInfoFound) {
        this.renderRating(service, element, videoInfoFound)
      }
    }
  }

  renderRating(service: Service, element: Element, videoInfo: VideoInfo): void {
    this.cache.save(videoInfo)
    // Rating element not found, create it
    const serviceRating = new SensCritiqueRating(videoInfo)
    serviceRating.render(element)

    this.logVideoInfo(videoInfo.name, serviceRating.rating, service)
  }

  logVideoInfo(videoName: string, rating: string, service: Service): void {
    if (rating) {
      this.logger.info(`Rating fetched for video ${videoName}`, {
        name: videoName,
        rating: rating,
        serviceWebsite: service,
        disney_id: this.currentVideoId(),
        provider: Provider.DISNEY,
      })
    } else {
      this.logger.error(`Cannot fetch rating for video ${videoName}`, {
        name: videoName,
        serviceWebsite: service,
        disney_id: this.currentVideoId(),
        provider: Provider.DISNEY,
      })
    }
  }

  currentVideoId(): string {
    const urlQuery = new URL(window.location.toString()).pathname.split('/')
    return urlQuery.length > 0 && urlQuery[4] ? urlQuery[4] : null
  }
}
