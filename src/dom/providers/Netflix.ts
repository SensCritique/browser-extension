import md5 from 'blueimp-md5'
import { Service } from '../../enum/Service'
import { Provider } from '../../enum/Provider'
import Manager from '../Manager'
import { VideoType } from '../../enum/VideoType'
import { VideoInfo } from '../../http/Client'
import { BrowserExtensionProduct } from '../../type/BrowserExtensionProduct'
import { SensCritiqueRating } from '../SensCritiqueRating'

export default class Netflix extends Manager {
  refreshRatings(): void {
    this.refreshModalRating()
    this.refreshWallRatings()
  }

  refreshWallRatings(): void {
    const productCards = document.querySelectorAll('.title-card a[href]')
    let platformProductIds: number[] = []
    productCards.forEach((card) => {
      const url = decodeURI(card.getAttribute('href'))
      if (url) {
        // Find all PlatformIds on current page
        const regexpResult = url.match(/\/watch\/(\d+)/)
        if (regexpResult[1]) {
          platformProductIds.push(parseInt(regexpResult[1]))
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
        if(cachedProduct) {
         platformProductsInCached.push(cachedProduct)
        } else {
          platformProductsIdsMissing.push(platformId)
        }
      })

      if(platformProductsIdsMissing.length) {
        this.getRatingsByPlatformId(
          Provider.NETFLIX,
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
        `.title-card a[href*="/watch/${platformId}"]`
      )

      cardElements.forEach(cardElement => {
        const hashClass = 'senscritique_'+hash
        if(!cardElement.querySelector(`.${hashClass}`)) {
          const mainDiv = document.createElement('div')
          mainDiv.style.position = 'absolute'
          mainDiv.style.zIndex = '100'
          mainDiv.style.right = '2px'
          mainDiv.style.bottom = '2px'
          mainDiv.style.display = 'flex'
          mainDiv.classList.add(hashClass)
          cardElement.prepend(mainDiv);


          this.renderRating(
            Service.SENSCRITIQUE,
            cardElement,
            {
              name: '',
              redirect: '',
              id: '',
              url: '',
              type: VideoType.MOVIE,
              rating: browserExtensionProduct?.rating?.toString(),
              hash,
              platformId: browserExtensionProduct?.platformId
            }
          )
        }
      })
    })
  }

  refreshModalRating(): void {
    const platformIdRegex = new URL(window.location.href)?.pathname?.match(/\/title\/(\d+)/)
    const platformId = new URL(window.location.href)?.searchParams.get('jbv') || platformIdRegex?.[1] 
    
    const modal = document.querySelector('.detail-modal')
    const hash = md5(platformId)

    if (modal?.getElementsByClassName(hash).length === 0) {
      // Create main div for Ratings
      const infoElement = modal.querySelector(
        '.previewModal--detailsMetadata-info'
      )
      this.getRating(parseInt(platformId), infoElement, Service.SENSCRITIQUE, hash)
    }
  }

  getRating(
    platformId: number,
    element: Element,
    service: Service,
    hash: string
  ): void {
    const videoInfoFound = this.cache.get(hash)
    const hashClass = 'senscritique_'+hash

    if(!element.querySelector(`.${hashClass}`)) {
      const mainDiv = document.createElement('div')
      mainDiv.style.display = 'flex'
      mainDiv.classList.add(hashClass)
      element.prepend(mainDiv);

      if (!videoInfoFound) {
          this.getRatingsByPlatformId(
            Provider.NETFLIX,
            [platformId],
            (browserExtensionProducts: BrowserExtensionProduct[]) => {
              const browserExtensionProduct = browserExtensionProducts?.[0]
              if (browserExtensionProduct) {
                this.renderRating(service, element, {
                  name: '',
                  hash,
                  id: '',
                  platformId,
                  redirect: '',
                  type: VideoType.MOVIE,
                  rating: browserExtensionProduct.rating.toString(),
                  url: ''
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

  renderRating(
    service: Service,
    element: Element,
    videoInfo: VideoInfo,
  ): void {
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
        provider: Provider.NETFLIX,
      })
    } else {
      this.logger.error(`Cannot fetch rating for video ${videoName}`, {
        name: videoName,
        serviceWebsite: service,
        netflix_id: this.currentVideoId(),
        provider: Provider.NETFLIX,
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
