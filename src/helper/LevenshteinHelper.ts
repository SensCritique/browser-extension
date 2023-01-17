import * as Levenshtein from 'fast-levenshtein'
import { Product } from '../type/Product'

const isSimilarString = (string1: string, string2: string): boolean => {
  if (string1 && string2) {
    const distance = string1 && Levenshtein.get(string1, string2)

    return (string1.length <= 10 && distance <= 2) ||
    (string1.length > 10 && distance <= 4)
  }
  return false
}

export const productsMatchedWithLevenshtein = (senscritiqueProduct: Product, platformProduct: Product): boolean => {
  const isSimilarTitle = isSimilarString(senscritiqueProduct.title, platformProduct.title)
  const isSimilarOriginalTitle = senscritiqueProduct.originalTitle &&
    isSimilarString(senscritiqueProduct.originalTitle, platformProduct.originalTitle)
  const isSimilarFlattenTitle = isSimilarString(senscritiqueProduct.flattenedTitle, platformProduct.flattenedTitle)
  const isSimilarFlattenOriginalTitle = senscritiqueProduct.originalTitle &&
    isSimilarString(senscritiqueProduct.flattenedOriginalTitle, platformProduct.flattenedOriginalTitle)

  return isSimilarTitle || isSimilarOriginalTitle || isSimilarFlattenTitle || isSimilarFlattenOriginalTitle
}
