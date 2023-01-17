import { flatten } from '../helper/StringHelper'
import { VideoType } from '../http/VideoType'
import { Product } from '../type/Product'

export const mapPlatformProduct = (title: string, type: VideoType, year: number = null, nbrSeasons: number | null): Product => {
  return {
    title,
    flattenedTitle: flatten(title),
    year,
    type,
    nbrSeasons
  }
}
