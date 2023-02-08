import { flatten } from '../helper/StringHelper'
import { VideoType } from '../enum/VideoType'
import { Product } from '../type/Product'

export const mapPlatformProduct = (title: string, type: VideoType, year: number = null, nbrSeasons: number | null, provider: string): Product => {
  return {
    title,
    flattenedTitle: flatten(title),
    year,
    type,
    nbrSeasons,
    providers: [provider]
  }
}
