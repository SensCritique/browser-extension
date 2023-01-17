import { flatten } from '../helper/StringHelper'
import { UniverseTypeId } from '../http/UniverseTypeId'
import { VideoType } from '../http/VideoType'
import { Product } from '../type/Product'

type SeasonsProduct = {
  length: number
  seasonNumber: number,
}

type SensCritiqueProduct = {
    title: string,
    originalTitle: string,
    dateRelease: string,
    universe: number
    url: string,
    rating: number,
    seasons: SeasonsProduct,
    // eslint-disable-next-line camelcase
    year_of_production: number
}

type SensCritiqueResult = {
    product: SensCritiqueProduct
}

const findVideoTypeFromUniverse = (universe: number): VideoType => {
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
