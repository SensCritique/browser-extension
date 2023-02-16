import Ratings from '../Ratings'
import md5 from 'blueimp-md5'
import { Service } from '../../enum/Service'
import { Provider } from '../../enum/Provider'
import Manager from '../Manager'
import { VideoType } from '../../enum/VideoType'
import { VideoInfo } from '../../http/Client'
import RatingFactory from '../RatingFactory'
import { BrowserExtensionProduct } from '../../type/BrowserExtensionProduct'

export default class Netflix extends Manager {
  refreshRatings(): void {
    this.refreshModalRating()
    this.refreshWallRatings()
  }

  refreshWallRatings(): void {
    const productCards = document.querySelectorAll('.title-card a[href]')
    const platformProductIds = []
    productCards.forEach((card) => {
      const url = decodeURI(card.getAttribute('href'))
      if (url) {
        const regexpResult = url.match(/\/watch\/(\d+)/)
        if (regexpResult[1]) {
          platformProductIds.push(parseInt(regexpResult[1]))
        }
      }
    })

    if (platformProductIds.length > 0) {
      this.getRatingByPlatformId(platformProductIds)
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
      if (infoElement) {
        const ratingsElement = Ratings.render(hash, Provider.NETFLIX)
        infoElement.prepend(ratingsElement)
      }
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

  getRatingByPlatformId(platformProductIds: number[]): void {
    if (platformProductIds.length > 0) {
      this.getVideoInfoByPlatformId(
        Provider.NETFLIX,
        platformProductIds,
        (browserExtensionProducts: BrowserExtensionProduct[]) => {
          browserExtensionProducts.map((browserExtensionProduct) => {
            const hash = md5(browserExtensionProduct.platformId.toString())
            const platformId = browserExtensionProduct.platformId
            const element = document.querySelector(
              `.title-card a[href*="/watch/${platformId}"]`
            )
            if (element?.getElementsByClassName(hash).length === 0) {
              const ratingsElement = Ratings.render(hash, Provider.NETFLIX)
              element.prepend(ratingsElement)
            }
            // get video info
            this.renderRating(
              Service.SENSCRITIQUE,
              element,
              {
                name: '',
                redirect: '',
                id: '',
                url: '',
                type: VideoType.MOVIE,
                rating: browserExtensionProduct?.rating.toString(),
                hashId: hash,
              },
              hash
            )
          })
        }
      )
    }
  }

  getRating(
    videoName: string,
    jawbone: Element,
    service: Service,
    hash: string
  ): void {
    const videoInfoFound = this.cache.get(videoName, service)

    if (!videoInfoFound) {
      this.getVideoInfo(
        service,
        videoName,
        this.getVideoYear(),
        this.getVideoType(),
        this.getSeasons(),
        Provider.NETFLIX,
        (videoInfo: VideoInfo) => {
          this.renderRating(service, jawbone, videoInfo, hash)
        }
      )
    }
    if (videoInfoFound) {
      this.renderRating(service, jawbone, videoInfoFound, hash)
    }
  }

  renderRating(
    service: Service,
    element: Element,
    videoInfo: VideoInfo,
    hash: string
  ): void {
    this.cache.save(videoInfo, service)

    const serviceRating = new RatingFactory().create(service, videoInfo)
    const ratingElement = serviceRating.render()

    document
      .querySelectorAll(`.${service}_${hash}`)
      .forEach((serviceElement) => {
        if (serviceElement.childNodes.length === 0) {
          serviceElement.innerHTML = ratingElement.outerHTML
          this.logVideoInfo(videoInfo.name, serviceRating.rating, service)
        }
      })
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
