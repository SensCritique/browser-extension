import { VideoType } from '../enum/VideoType'
import { Client, VideoInfo } from './Client'
import { mapPlatformProduct } from '../mapper/PlatformProductMapper'
import { mapSensCritiqueProduct } from '../mapper/SensCritiqueProductMapper'
import { Product } from '../type/Product'
import { matchedWithLevenshtein } from '../helper/LevenshteinHelper'
import { Logger } from '../../src/background'

const app = require('../../package.json')

const searchQuery = [
  {
    operationName: 'Results',
    variables: {
      query: '%query%',
      filters: [],
      page: {
        size: 16,
        from: 0
      }
    },
    query: 'query Results($query: String, $filters: [SKFiltersSet], $page: SKPageInput, $sortBy: String) {  results(query: $query, filters: $filters) {    hits(page: $page, sortBy: $sortBy) {      items {        ... on ResultHit {          id          product {            id            title        originalTitle           url            rating            universe     dateRelease   year_of_production   seasons { seasonNumber }  }        }      }    }  }}'
  }
]

const SensCritique = class SensCritique implements Client {
  private baseUrl: string = 'https://www.senscritique.com'
  private searchUrl: string;
  private errorSearchUrl: string;

  constructor () {
    this.searchUrl = 'https://apollo.senscritique.com/'
    this.errorSearchUrl = this.baseUrl + '/search?query=%search%'
  }

  buildErrorUrl (videoName: string): string {
    return this.errorSearchUrl.replace('%search%', videoName)
  }

  mapVideoInfos (result: Product, title: string, type: VideoType): VideoInfo {
    return {
      name: title,
      redirect: `${this.baseUrl}${result.url}`,
      url: `${this.baseUrl}${result.url}`,
      id: result.type,
      type: type,
      rating: result.rating?.toString()
    }
  }

  async search (title: string) {
    const headers = new Headers()
    headers.append('User-Agent', `senscritique-extension v${app.version}`)
    headers.append('Content-Type', 'application/json')

    const response = await fetch(this.searchUrl, {
      headers,
      method: 'POST',
      body: JSON.stringify(searchQuery).replace('%query%', title)
    })

    if (response.ok) {
      return response?.json()
    }

    Logger.error('An error occured when trying to fetch product on SensCritique', {
      name: title
    })

    return null
  }

  async compare (senscritiqueProduct: Product, platformProduct: Product): Promise<VideoInfo | null> {
    const isMovie = (platformProduct?.type && senscritiqueProduct?.type) === VideoType.MOVIE
    const isTvShow = (platformProduct?.type && senscritiqueProduct?.type) === VideoType.TVSHOW
    const yearMatched = senscritiqueProduct?.year === platformProduct?.year
    const typeMatched = senscritiqueProduct?.type === platformProduct?.type
    const seasonMatched = senscritiqueProduct?.nbrSeasons === platformProduct?.nbrSeasons
    const titleMatched = matchedWithLevenshtein(senscritiqueProduct.title, platformProduct.title)
    const flattenTitleMatched = matchedWithLevenshtein(senscritiqueProduct.flattenedTitle, platformProduct.flattenedTitle)
    const originalTitleMatched = matchedWithLevenshtein(senscritiqueProduct.originalTitle, platformProduct.title)
    const flattenOriginalTitleMatched = matchedWithLevenshtein(senscritiqueProduct.flattenedOriginalTitle, platformProduct.flattenedTitle)

    const titleMatchedLevenshtein = titleMatched || flattenTitleMatched || originalTitleMatched || flattenOriginalTitleMatched

    const videoInfos = this.mapVideoInfos(senscritiqueProduct, senscritiqueProduct.title, senscritiqueProduct.type)

    if (typeMatched) {
      if ((titleMatchedLevenshtein && yearMatched) || (isMovie && yearMatched)) {
        Logger.debug('Match succeeded', {
          senscritiqueProduct,
          platformProduct
        })
        return videoInfos
      }

      if (isTvShow &&
        ((yearMatched && seasonMatched) ||
        (titleMatchedLevenshtein && seasonMatched) ||
        titleMatchedLevenshtein)
      ) {
        return videoInfos
      }
    }

    Logger.error('Products does not match', {
      error: 'matching-error',
      senscritiqueProduct,
      platformProduct
    })

    return null
  }

  async getVideoInfo (title: string, type: VideoType, year: string = null, seasons: string): Promise<VideoInfo | null> {
    const defaultVideoInfos = {
      name: title,
      redirect: this.buildErrorUrl(title),
      id: null,
      type: null
    }
    const platformProduct = mapPlatformProduct(title, type, parseInt(year), parseInt(seasons))

    if (title) {
      const response = await this.search(title)
      if (response) {
        let videoInfos = null
        const results = response[0]?.data?.results?.hits?.items

        if (results.length > 0) {
          for (const product of results) {
            const senscritiqueProduct = mapSensCritiqueProduct(product)

            videoInfos = await this.compare(senscritiqueProduct, platformProduct)

            if (videoInfos) {
              return videoInfos
            }
          }

          Logger.debug('Unable to find the corresponding product between the plaform and SensCritique', {
            name: title
          })
          return defaultVideoInfos
        }

        Logger.error('Unable to find products in the response', {
          name: title
        })
        return defaultVideoInfos
      }

      return defaultVideoInfos
    }
  }
}

export default SensCritique
