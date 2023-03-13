import md5 from 'blueimp-md5'
import { Service } from '../../enum/Service'
import { Provider } from '../../enum/Provider'
import Manager from '../Manager'
import { VideoType } from '../../enum/VideoType'
import { VideoInfo } from '../../http/Client'
import { BrowserExtensionProduct } from '../../type/BrowserExtensionProduct'
import { SensCritiqueRating } from '../SensCritiqueRating'
import { generateRedirectUrl } from '../../helper/UrlGenerator'

export default class Canal extends Manager {
  refreshRatings(): void {
    this.refreshModalRating()
    this.refreshWallRatings()
  }

  refreshWallRatings(): void {
    const productCards = document.querySelectorAll('.contentRow a[href]')

    let platformProductIds: string[] = []
    productCards.forEach((card) => {
      const url = decodeURI(card.getAttribute('href'))
      if (url) {
        // Find all PlatformIds on current page
        const regexpResult = url.match(/\/h\/(\d+ *_\d+)/)
        if (regexpResult?.[1]) {
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
          Provider.CANALPLUS,
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
        `[class*="contentRow__"] a[href*="/h/${platformId}"]`
      )

      cardElements.forEach(async (cardElement) => {
        const hashClass = 'senscritique_' + hash
        if (!cardElement.querySelector(`.${hashClass}`)) {
          const name = cardElement.getAttribute('title')
          const posterElement = cardElement.querySelector(
            '[class*="cardContent__"]'
          )
          if (posterElement) {
            const mainDiv = document.createElement('div')
            mainDiv.style.position = 'absolute'
            mainDiv.style.zIndex = '100'
            mainDiv.style.right = '8px'
            mainDiv.style.left = 'unset'
            mainDiv.style.bottom = '4px'
            mainDiv.style.top = 'unset'
            mainDiv.style.display = 'flex'
            mainDiv.classList.add(hashClass)
            posterElement.prepend(mainDiv)

            this.renderRating(Service.SENSCRITIQUE, posterElement, {
              name,
              redirect: await generateRedirectUrl(name),
              id: '',
              url: browserExtensionProduct.url,
              type: VideoType.MOVIE,
              rating: browserExtensionProduct?.rating?.toString(),
              hash,
              platformId: browserExtensionProduct?.platformId,
            })
          }
        }
      })
    })
  }

  refreshModalRating(): void {
    const platformIdRegex = new URL(window.location.href)?.pathname?.match(
      /\/h\/(\d+ *_\d+)/
    )
    const name = document.querySelector('h1')?.innerText

    if (platformIdRegex) {
      const platformId = platformIdRegex?.[1]
      const hash = md5(platformId)

      // Create main div for Ratings
      const infoElement = document.querySelector(
        '[class*="detailV5__actionLayout__"]'
      )
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
    if (!element.querySelector(`.${hashClass}`)) {
      const mainDiv = document.createElement('div')
      mainDiv.style.display = 'flex'
      mainDiv.classList.add(hashClass)
      element.prepend(mainDiv)

      if (!videoInfoFound) {
        this.getRatingsByPlatformId(
          Provider.CANALPLUS,
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
                rating: browserExtensionProduct.rating.toString(),
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
        netflix_id: this.currentVideoId(),
        provider: Provider.CANALPLUS,
      })
    } else {
      this.logger.error(`Cannot fetch rating for video ${videoName}`, {
        name: videoName,
        serviceWebsite: service,
        netflix_id: this.currentVideoId(),
        provider: Provider.CANALPLUS,
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
