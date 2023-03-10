import md5 from 'blueimp-md5'
import { Service } from '../../enum/Service'
import { Provider } from '../../enum/Provider'
import Manager from '../Manager'
import { VideoType } from '../../enum/VideoType'
import { VideoInfo } from '../../http/Client'
import { UniverseTypeId } from '../../enum/UniverseTypeId'
import { BrowserExtensionProduct } from '../../type/BrowserExtensionProduct'
import { SensCritiqueRating } from '../SensCritiqueRating'
import { constructUrl } from './../../helper/ContructUrlHelper'

export default class PrimeVideo extends Manager {
  refreshRatings(): void {
    this.refreshModalRating()
    this.refreshWallRatings()
  }

  refreshWallRatings(): void {
    const productCards = document.querySelectorAll('.km3sbT a[href]')

    let platformProductIds: string[] = []
    productCards.forEach((card) => {
      const url = decodeURI(card.getAttribute('href'))
      if (url) {
        // Find all PlatformIds on current page
        const regexpResult = url.match(/\/detail\/(\d+ *[a-zA-Z_]\w*)/)
        if (regexpResult[1]) {
          platformProductIds.push(regexpResult[1])
        }
      }
    })
    platformProductIds = [...new Set(platformProductIds)]
    const platformProductsInCached = []
    const platformProductsIdsMissing = []

    if (platformProductIds.length > 0) {
      // Check if products platform IDs are present in cache
      platformProductIds.forEach((platformId) => {
        const cachedProduct = this.cache.get(md5(platformId.toString()))
        if (cachedProduct) {
          platformProductsInCached.push(cachedProduct)
        } else {
          platformProductsIdsMissing.push(platformId)
        }
      })

      if (platformProductsIdsMissing.length) {
        this.getRatingsByPlatformId(
          Provider.PRIMEVIDEO,
          platformProductsIdsMissing,
          (browserExtensionProducts: BrowserExtensionProduct[]) => {
            this.renderWallRatings(browserExtensionProducts)
          }
        )
      }
      this.renderWallRatings(platformProductsInCached)
    }
  }

  renderWallRatings(browserExtensionProducts: BrowserExtensionProduct[]): void {
    // Response from API with all browserExtensionProducts
    browserExtensionProducts.forEach((browserExtensionProduct) => {
      const hash = md5(browserExtensionProduct.platformId.toString())
      const platformId = browserExtensionProduct.platformId
      const cardElements = document.querySelectorAll(
        `.km3sbT a[href*="/detail/${platformId}"]`
      )

      cardElements.forEach((cardElement) => {
        const hashClass = 'senscritique_' + hash
        if (!cardElement.querySelector(`.${hashClass}`)) {
          const mainDiv = document.createElement('div')
          mainDiv.style.position = 'absolute'
          mainDiv.style.zIndex = '100'
          mainDiv.style.right = '2px'
          mainDiv.style.bottom = '2px'
          mainDiv.style.display = 'flex'
          mainDiv.classList.add(hashClass)
          cardElement.prepend(mainDiv)

          this.renderRating(Service.SENSCRITIQUE, cardElement, {
            name: '',
            redirect: '',
            id: '',
            url: '',
            type: VideoType.MOVIE,
            rating: browserExtensionProduct?.rating?.toString(),
            hash,
            platformId: browserExtensionProduct?.platformId,
          })
        }
      })
    })
  }

  refreshModalRating(): void {
    const platformIdRegex = new URL(window.location.href)?.pathname?.match(
      /\/detail\/(\d+ *[a-zA-Z_]\w*)/
    )
    if (platformIdRegex) {
      const platformId = platformIdRegex?.[1]
      const hash = md5(platformId)

      // Create main div for Ratings
      const infoElement = document.querySelector('.dv-node-dp-badges')
      this.getRating(platformId, infoElement, Service.SENSCRITIQUE, hash)
    }
  }

  getRating(
    platformId: string,
    element: Element,
    service: Service,
    hash: string
  ): void {
    const videoInfoFound = this.cache.get(hash)
    const hashClass = 'senscritique_' + hash

    if (!element.querySelector(`.${hashClass}`)) {
      const mainDiv = document.createElement('div')
      mainDiv.style.display = 'flex'
      mainDiv.classList.add(hashClass)
      element.prepend(mainDiv)

      if (!videoInfoFound) {
        this.getRatingsByPlatformId(
          Provider.PRIMEVIDEO,
          [platformId],
          (browserExtensionProducts: BrowserExtensionProduct[]) => {
            const browserExtensionProduct = browserExtensionProducts?.[0]
            const type =
              browserExtensionProduct.typeId === UniverseTypeId.MOVIE
                ? VideoType.MOVIE
                : VideoType.TVSHOW

            if (browserExtensionProduct) {
              this.renderRating(service, element, {
                name: '',
                hash,
                id: '',
                platformId,
                redirect: '',
                type,
                rating: browserExtensionProduct.rating.toString(),
                url: constructUrl(
                  this.baseUrl,
                  type,
                  browserExtensionProduct.slug,
                  browserExtensionProduct.productId
                ),
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
        netflix_id: this.currentVideoId(),
        provider: Provider.PRIMEVIDEO,
      })
    } else {
      this.logger.error(`Cannot fetch rating for video ${videoName}`, {
        name: videoName,
        serviceWebsite: service,
        netflix_id: this.currentVideoId(),
        provider: Provider.PRIMEVIDEO,
      })
    }
  }

  currentVideoId(): string {
    const urlQuery = new URL(window.location.toString()).pathname.split(
      '/title/'
    )
    const firstJawboneId =
      urlQuery.length > 0 && !isNaN(parseInt(urlQuery[1])) ? urlQuery[1] : null
    const secondJawboneId = new URLSearchParams(window.location.search).get(
      'jbv'
    )

    return secondJawboneId || firstJawboneId
  }
}
