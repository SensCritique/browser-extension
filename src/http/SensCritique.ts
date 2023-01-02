import { VideoType } from './VideoType'
import * as Levenshtein from 'fast-levenshtein'
import { Client, VideoInfo } from './Client'
import { Type } from '../http/Type'

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
    query: 'query Results($query: String, $filters: [SKFiltersSet], $page: SKPageInput, $sortBy: String) {  results(query: $query, filters: $filters) {    hits(page: $page, sortBy: $sortBy) {      items {        ... on ResultHit {          id          product {            id            title            url            rating            universe     dateRelease    }        }      }    }  }}'
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

  cleanTitle (title: string): string {
    return title.replace(/ *\([^)]*\) */g, '').replace(/’|'|:|-|™|,|!|/gi, '').replace(/\s+/g, ' ').toLowerCase()
  }

  async getVideoInfo (search: string, type: VideoType, year: string = null): Promise<VideoInfo> {
    if (type === VideoType.TVSHOW) {
      year = year.split('-')[0]
    }

    if (search) {
      const titleSearch = this.cleanTitle(search)

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
            const title = this.cleanTitle(result.product.title)
            const yearDateRelease = result.product?.dateRelease?.split('-')[0]

            if ((type === VideoType.MOVIE && result.product.universe === Type.MOVIE) &&
              ((title === titleSearch) || titleSearch.includes(title)) &&
              parseInt(year) === parseInt(yearDateRelease)) {
              videoInfo = {
                name: title,
                redirect: `${this.baseUrl}${result.product.url}`,
                url: `${this.baseUrl}${result.product.url}`,
                id: result.product.universe,
                type: type,
                rating: result.product.rating.toString()
              }
              break
            } else if ((result.product.universe === Type.TVSHOW && type === VideoType.TVSHOW) &&
            ((title === titleSearch) || titleSearch.includes(title))) {
              videoInfo = {
                name: title,
                redirect: `${this.baseUrl}${result.product.url}`,
                url: `${this.baseUrl}${result.product.url}`,
                id: result.product.universe,
                type: type,
                rating: result.product.rating.toString()
              }
              break
            }
          }

          // if the titles are not exactly the same we check if one of the word in the title is include in the first result
          // and with the same year
          const title = this.cleanTitle(results[0]?.product.title).split(' ')[0]
          const yearDateRelease = results[0].product?.dateRelease?.split('-')[0]
          if (!videoInfo &&
            titleSearch.includes(title) &&
            parseInt(year) === parseInt(yearDateRelease)) {
            videoInfo = {
              name: results[0].product.title,
              redirect: `${this.baseUrl}${results[0].product.url}`,
              url: `${this.baseUrl}${results[0].product.url}`,
              id: results[0].product.universe,
              type: type,
              rating: results[0].product.rating.toString()
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
