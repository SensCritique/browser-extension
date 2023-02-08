import { Logger } from '../background'
import { VideoType } from '../enum/VideoType'
import { VideoInfo } from '../http/Client'
import { mapVideoInfos } from '../mapper/VideoInfoMapper'
import { Product } from '../type/Product'
import { matchedWithLevenshtein } from './LevenshteinHelper'
import { matchedProviders } from './ProviderHelper'

export const compare = async (senscritiqueProduct: Product, platformProduct: Product): Promise<VideoInfo | null> => {
  const isMovie = (platformProduct?.type && senscritiqueProduct?.type) === VideoType.MOVIE
  const isTvShow = (platformProduct?.type && senscritiqueProduct?.type) === VideoType.TVSHOW
  const yearMatched = senscritiqueProduct?.year === platformProduct?.year
  const typeMatched = senscritiqueProduct?.type === platformProduct?.type
  const seasonMatched = senscritiqueProduct?.nbrSeasons === platformProduct?.nbrSeasons
  const titleMatched = matchedWithLevenshtein(senscritiqueProduct.title, platformProduct.title)
  const flattenTitleMatched = matchedWithLevenshtein(senscritiqueProduct.flattenedTitle, platformProduct.flattenedTitle)
  const originalTitleMatched = matchedWithLevenshtein(senscritiqueProduct.originalTitle, platformProduct.title)
  const flattenOriginalTitleMatched = matchedWithLevenshtein(senscritiqueProduct.flattenedOriginalTitle, platformProduct.flattenedTitle)
  const providerMatched = senscritiqueProduct.providers?.length ? matchedProviders(senscritiqueProduct.providers, platformProduct.providers) : null
  const titleMatchedLevenshtein = titleMatched || flattenTitleMatched || originalTitleMatched || flattenOriginalTitleMatched

  const videoInfos = mapVideoInfos(senscritiqueProduct, senscritiqueProduct.title, senscritiqueProduct.type)

  if (typeMatched && providerMatched) {
    if ((titleMatchedLevenshtein && yearMatched) || (isMovie && yearMatched)) {
      return videoInfos
    }

    if (isTvShow &&
        ((yearMatched && seasonMatched) ||
        (titleMatchedLevenshtein && seasonMatched))
    ) {
      return videoInfos
    }
  }

  Logger.debug('Products does not match', {
    senscritiqueProduct,
    platformProduct
  })

  return null
}
