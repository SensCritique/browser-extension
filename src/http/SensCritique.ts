import { VideoType } from '../enum/VideoType'
import { Client, VideoInfo } from './Client'
import { mapPlatformProduct } from '../mapper/PlatformProductMapper'
import { mapSensCritiqueProduct } from '../mapper/SensCritiqueProductMapper'
import { Product } from '../type/Product'
import { matchedWithLevenshtein } from '../helper/LevenshteinHelper'
import { compare } from '../helper/ComparatorHelper'
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

            videoInfos = await compare(senscritiqueProduct, platformProduct)

            if (videoInfos) {
              return videoInfos
            }
          }
          Logger.error('Cannot match product', {
            error: 'matching-error',
            platformProduct
          })

          return defaultVideoInfos
        }

        Logger.error('Product not found on SensCritique', {
          platformProduct
        })
        return defaultVideoInfos
      }

      return defaultVideoInfos
    }
  }
}

export default SensCritique
