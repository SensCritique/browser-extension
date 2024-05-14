import md5 from 'blueimp-md5'
import { Service } from '../../enum/Service'
import { Provider } from '../../enum/Provider'
import Manager from '../Manager'
import { VideoInfo } from '../../http/Client'
import { BrowserExtensionProduct } from '../../type/BrowserExtensionProduct'
import { SensCritiqueRating } from '../SensCritiqueRating'
import { generateRedirectUrl } from '../../helper/UrlGenerator'

export default class PrimeVideo extends Manager {
  refreshRatings(): void {
    this.refreshModalRating()
    this.refreshWallRatings()
  }

  refreshWallRatings(): void {
    const wallElements = document.querySelectorAll(
      `a[href*="/detail/"][role="button"]`
    )
    const superCarouselCardElements = document.querySelectorAll(
      '[data-testid="super-carousel-card"] a[href*="/detail/"]'
    )
    const heroCarouselElements = document.querySelectorAll(
      `[data-testid="standard-hero"] li[data-index]>article section`
    )
    const legacyElements = document.querySelectorAll(
      `li .tst-packshot > a[href*="/detail/"]`
    )

    const productCards = [
      ...wallElements,
      ...heroCarouselElements,
      ...superCarouselCardElements,
      ...legacyElements,
    ]
    let platformProductIds: string[] = []
    productCards.forEach((cardElement) => {
      let url = cardElement.getAttribute('href')
      if (!url) {
        const linkElement = cardElement.querySelector('a[href*="/detail/"]')
        url = linkElement?.getAttribute('href')
      }
      url = decodeURI(url)
      if (url) {
        // Find all PlatformIds on current page
        const regexpResult = url.match(/\/detail\/([\d\w]+)/)
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
          Provider.AMAZON,
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
      const wallElements = document.querySelectorAll(
        `[data-testid="packshot"] a[href*="/detail/${platformId}"][role="button"]:not([class*="tst-"])`
      )
      const superCarouselCardElements = document.querySelectorAll(
        `[data-testid="super-carousel-card"] > div > a[href*="/detail/${platformId}"]`
      )
      const superCarouselVideoCardElements = document.querySelectorAll(
        `[data-testid="super-carousel-card"] a[href*="/detail/${platformId}"].tst-preroll-player `
      )
      const heroCarouselElements = document.querySelectorAll(
        `[data-testid="standard-hero"] li[data-index]>article section`
      )
      const legacyElements = document.querySelectorAll(
        `li .tst-packshot > a[href*="/detail/${platformId}"]`
      )
      const cardElements = [
        ...wallElements,
        ...heroCarouselElements,
        ...superCarouselCardElements,
        ...superCarouselVideoCardElements,
        ...legacyElements,
      ]

      cardElements.forEach(async (cardElement: HTMLElement) => {
        // Only keep carousel and wall elements (without episode URL)
        if (
          cardElement.getAttribute('href')?.match(`/detail/${platformId}.*`) ||
          cardElement.querySelector(
            `a[href*="/detail/${platformId}"]:not([data-testid="play"])`
          ) ||
          (cardElement
            ?.getAttribute('href')
            ?.startsWith(`/detail/${platformId}`) &&
            (cardElement.getAttribute('role') === 'button' ||
              cardElement.getAttribute('data-testid') === 'image-link')) ||
          cardElement.getAttribute('data-testid') === 'preroll-player-link'
        ) {
          const hashClass = 'senscritique_' + hash
          if (!cardElement.querySelector(`.${hashClass}`)) {
            let name = cardElement.innerText
            const mainDiv = document.createElement('div')
            mainDiv.style.position = 'absolute'
            mainDiv.style.zIndex = '2'
            mainDiv.style.right = '2px'
            mainDiv.style.bottom = '2px'
            mainDiv.style.display = 'flex'
            if (cardElement.nodeName === 'SECTION') {
              mainDiv.style.position = 'relative'
              mainDiv.style.marginTop = '6px'
              name = cardElement.querySelector('img')?.getAttribute('alt')
            }
            mainDiv.classList.add(hashClass)
            cardElement.append(mainDiv)

            this.renderRating(Service.SENSCRITIQUE, cardElement, {
              name: name,
              redirect: await generateRedirectUrl(name),
              id: '',
              url: browserExtensionProduct.url,
              type: browserExtensionProduct.type,
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
      /\/detail\/([\w\d]+)/
    )
    if (platformIdRegex) {
      const platformId = platformIdRegex?.[1]
      const hash = md5(platformId)
      const name = document.querySelector('h1')?.innerText

      // Create main div for Ratings
      const infoElement = document.querySelector(
        '.dv-node-dp-badges'
      ) as HTMLElement
      this.getRating(platformId, infoElement, Service.SENSCRITIQUE, hash, name)
    }
  }

  getRating(
    platformId: string,
    element: HTMLElement,
    service: Service,
    hash: string,
    name: string = null
  ): void {
    const videoInfoFound = this.cache.get(hash)
    const hashClass = 'senscritique_' + hash
    if (!element.querySelector(`.${hashClass}`)) {
      element.style.backgroundColor = 'none'
      const mainDiv = document.createElement('div')
      mainDiv.style.display = 'flex'
      mainDiv.classList.add(hashClass)
      element.append(mainDiv)

      if (!videoInfoFound) {
        this.getRatingsByPlatformId(
          Provider.AMAZON,
          [platformId],
          async (browserExtensionProducts: BrowserExtensionProduct[]) => {
            const browserExtensionProduct = browserExtensionProducts?.[0]
            if (browserExtensionProduct) {
              this.renderRating(service, element, {
                name: name,
                hash,
                id: '',
                platformId,
                redirect: await generateRedirectUrl(name),
                type: browserExtensionProduct.type,
                rating: browserExtensionProduct.rating?.toString(),
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
        provider: Provider.AMAZON,
      })
    } else {
      this.logger.error(`Cannot fetch rating for video ${videoName}`, {
        name: videoName,
        serviceWebsite: service,
        netflix_id: this.currentVideoId(),
        provider: Provider.AMAZON,
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
