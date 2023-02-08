import { flatten } from '../helper/StringHelper'
import { UniverseTypeId } from '../enum/UniverseTypeId'
import { VideoType } from '../enum/VideoType'
import { Product } from '../type/Product'

type Season = {
  seasonNumber?: number,
}

type Provider = {
  name?: string,
}

type SensCritiqueProduct = {
    title: string,
    originalTitle: string,
    universe: number
    url: string,
    rating: number,
    seasons: Season[],
    // eslint-disable-next-line camelcase
    year_of_production: number
    providers: Provider[]
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
  const providersList = []
  senscritiqueProduct?.product.providers?.map((provider) => providersList.push(provider.name))
  return {
    title: senscritiqueProduct.product?.title,
    flattenedTitle: flatten(senscritiqueProduct.product?.title),
    originalTitle: senscritiqueProduct.product?.originalTitle,
    flattenedOriginalTitle: flatten(senscritiqueProduct.product?.originalTitle),
    year: senscritiqueProduct.product?.year_of_production,
    nbrSeasons: senscritiqueProduct.product?.seasons?.length,
    type: findVideoTypeFromUniverse(senscritiqueProduct.product?.universe),
    url: senscritiqueProduct.product?.url,
    rating: senscritiqueProduct.product?.rating,
    providers: providersList
  }
}
