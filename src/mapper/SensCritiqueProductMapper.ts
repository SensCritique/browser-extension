import { flatten } from '../helper/StringHelper'
import { UniverseTypeId } from '../enum/UniverseTypeId'
import { VideoType } from '../enum/VideoType'
import { Product } from '../type/Product'

type Seasons = {
  seasonNumber: number,
}

type SensCritiqueProduct = {
    title: string,
    originalTitle: string,
    universe: number
    url: string,
    rating: number,
    seasons: Seasons[],
    // eslint-disable-next-line camelcase
    year_of_production: number
}

type SensCritiqueResult = {
    product: SensCritiqueProduct
}

export const findVideoTypeFromUniverse = (universe: number): VideoType => {
  switch (universe) {
    default:
      return null
    case UniverseTypeId.MOVIE:
      return VideoType.MOVIE
    case UniverseTypeId.TVSHOW:
      return VideoType.TVSHOW
  }
}

export const mapSensCritiqueProduct = (senscritiqueProduct: SensCritiqueResult): Product => {
  return {
    title: senscritiqueProduct.product?.title,
    flattenedTitle: flatten(senscritiqueProduct.product?.title),
    originalTitle: senscritiqueProduct.product?.originalTitle,
    flattenedOriginalTitle: flatten(senscritiqueProduct.product?.originalTitle),
    year: senscritiqueProduct.product?.year_of_production,
    nbrSeasons: senscritiqueProduct.product?.seasons?.length,
    type: findVideoTypeFromUniverse(senscritiqueProduct.product?.universe),
    url: senscritiqueProduct.product?.url,
    rating: senscritiqueProduct.product?.rating
  }
}
