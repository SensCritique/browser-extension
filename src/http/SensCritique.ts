import { VideoType } from './VideoType'
import * as Levenshtein from 'fast-levenshtein'
import { Client, VideoInfo } from './Client'

export default class SensCritique implements Client {
  private searchUrl: string;
  private errorSearchUrl: string;

  constructor () {
    this.searchUrl = 'https://www.senscritique.com/sc2/search/autocomplete.json?query=%search%'
    this.errorSearchUrl = 'https://www.senscritique.com/search?q=%search%'
  }

  buildErrorUrl (videoName: string): string {
    return this.errorSearchUrl.replace('%search%', videoName)
  }

  async getVideoInfo (search: string, type: VideoType, year: string = null): Promise<VideoInfo> {
    if (search) {
      const url = this.searchUrl.replace('%search%', encodeURI(search))
      const headers = new Headers()
      headers.append('x-requested-with', 'XMLHttpRequest')
      const response = await fetch(url, { headers })
      let videoInfo = null
      if (response.ok) {
        const body = await response.json()
        if (body.json.length > 0) {
          let previousLevenshteinDistance = 100
          for (const result of body.json) {
            // subtype_id = 4 => Serie / subtype_id = 1 => film
            if ((result.subtype_id === 4 && type === VideoType.SERIE) ||
              (type === VideoType.MOVIE && result.subtype_id === 1)) {
              const levenshteinDistance = Levenshtein.get(result.label, `${search} (${year})`)
              if (levenshteinDistance < previousLevenshteinDistance) {
                previousLevenshteinDistance = levenshteinDistance
                videoInfo = {
                  name: search,
                  redirect: `${result.url}/critiques`,
                  url: result.url,
                  id: result.subtype_id,
                  type: type
                }
              }
            }
          }

          if (videoInfo) {
            const response = await fetch(videoInfo.url)
            const html = await response.text()
            const parser = new DOMParser()
            const dom = parser.parseFromString(html, 'text/html')
            const microFormat = dom.documentElement.querySelector('script[type="application/ld+json"]')?.innerHTML
            const nativeMicroFormat = JSON.parse(microFormat)

            videoInfo.rating = nativeMicroFormat?.aggregateRating?.ratingValue

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
