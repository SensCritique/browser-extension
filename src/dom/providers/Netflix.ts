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
    let platformProductIds = []
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

    if (platformProductIds.length > 0) {
      this.getRatingsByPlatformId(
        Provider.NETFLIX,
        platformProductIds,
        (browserExtensionProducts: BrowserExtensionProduct[]) => {
          // Response from API with all browserExtensionProducts
          browserExtensionProducts.forEach((browserExtensionProduct) => {
            const hash = md5(browserExtensionProduct.platformId.toString())
            const platformId = browserExtensionProduct.platformId
            const cardElements = document.querySelectorAll(
              `.title-card a[href*="/watch/${platformId}"]`
            )
            
            cardElements.forEach(cardElement => {
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
                }
              )
            })
            })
        }
      )
    }
  }

  refreshModalRating(): void {
    // new URL(window.location.href)?.searchParams.get('jbv')
    const videoName =
      document
        .querySelector('.previewModal--player-titleTreatment-logo')
        ?.getAttribute('alt') || null
    const modal = document.querySelector('.detail-modal')
    const hash = md5(videoName)

    if (videoName && modal?.getElementsByClassName(hash).length === 0) {
      // Create main div for Ratings
      const infoElement = modal.querySelector(
        '.previewModal--detailsMetadata-info'
      )
      
      this.getRating(videoName, modal, Service.SENSCRITIQUE, hash)
    }
  }

  getVideoYear(): string {
    const yearElement: HTMLElement = document.querySelector(
      '.detail-modal .year'
    )

    return yearElement?.innerText
  }

  getVideoType(): VideoType {
    const episodesElement = document.querySelector(
      '.detail-modal .episodeSelector'
    )

    return episodesElement == null ? VideoType.MOVIE : VideoType.TVSHOW
  }

  getSeasons(): string | null {
    const element = document.querySelector('.duration')
    const innerHtml = element?.innerHTML
    const seasons = innerHtml?.split(' ')?.[0]
    return seasons
  }

  getRating(
    videoName: string,
    jawbone: Element,
    service: Service,
    hash: string
  ): void {
    const videoInfoFound = this.cache.get(videoName)

    if (!videoInfoFound) {
      this.getVideoInfo(
        service,
        videoName,
        this.getVideoYear(),
        this.getVideoType(),
        this.getSeasons(),
        Provider.NETFLIX,
        (videoInfo: VideoInfo) => {
          this.renderRating(service, jawbone, videoInfo)
        }
      )
    }
    if (videoInfoFound) {
      this.renderRating(service, jawbone, videoInfoFound)
    }
  }

  renderRating(
    service: Service,
    element: Element,
    videoInfo: VideoInfo,
  ): void {
    this.cache.save(videoInfo)

    if(!element.querySelector(`.senscritique_${videoInfo.hash}`)){
      // Rating element not found, create it
      const serviceRating = new SensCritiqueRating(videoInfo)
      const ratingElement = serviceRating.render(Provider.NETFLIX)
  
      element.prepend(ratingElement)
      this.logVideoInfo(videoInfo.name, serviceRating.rating, service)
    }
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
