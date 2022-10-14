import { VideoType } from './VideoType'
import * as Levenshtein from 'fast-levenshtein'
import { Client, VideoInfo } from './Client'

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
    query: 'query Results($query: String, $filters: [SKFiltersSet], $page: SKPageInput, $sortBy: String) {  results(query: $query, filters: $filters) {    hits(page: $page, sortBy: $sortBy) {      items {        ... on ResultHit {          id          product {            id            title            url            rating            universe          }        }      }    }  }}'
  }
]

export default class SensCritique implements Client {
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

  async getVideoInfo (search: string, type: VideoType, year: string = null): Promise<VideoInfo> {
    if (search) {
      const headers = new Headers()
      headers.append('User-Agent', `senscritique-extension v${app.version}`)
      headers.append('Content-Type', 'application/json')
      const response = await fetch(this.searchUrl, {
        headers,
        method: 'POST',
        body: JSON.stringify(searchQuery).replace('%query%', search)
      })
      let videoInfo = null
      if (response.ok) {
        const body = await response.json()
        const results = body[0]?.data?.results?.hits?.items
        if (results.length > 0) {
          for (const result of results) {
            if (((result.product.universe === 4 && type === VideoType.SERIE) ||
              (type === VideoType.MOVIE && result.product.universe === 1)) && result.product.title === search) {
              videoInfo = {
                name: result.product.title,
                redirect: `${this.baseUrl}${result.product.url}/critiques`,
                url: `${this.baseUrl}${result.product.url}`,
                id: result.product.universe,
                type: type,
                rating: result.product.rating.toString()
              }
              break
            }
          }

          if (videoInfo) {
            return videoInfo
          }
        }
      }

      return {
        name: search,
        redirect: this.buildErrorUrl(search),
        id: null,
        type: null
      }
    }
  }
}
