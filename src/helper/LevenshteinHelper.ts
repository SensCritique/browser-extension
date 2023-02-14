import * as Levenshtein from 'fast-levenshtein'

export const levenshteinDistance = (
  string1: string,
  string2: string
): number => {
  return Levenshtein.get(string1, string2)
}

export const shortStringMatchedLevenshtein = (
  string: string,
  distance: number
): boolean => {
  return string.length <= 10 && distance <= 2
}

export const longStringMatchedLevenshtein = (
  string: string,
  distance: number
): boolean => {
  return string.length > 10 && distance <= 4
}

export const matchedWithLevenshtein = (
  string1: string,
  string2: string
): boolean => {
  if (string1 && string2) {
    const distance = levenshteinDistance(string1, string2)
    return (
      shortStringMatchedLevenshtein(string1, distance) ||
      longStringMatchedLevenshtein(string1, distance)
    )
  }
}
