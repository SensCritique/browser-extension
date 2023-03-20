import { getSensCritiqueVideoType } from './TypeHelper'

const devMode = process.env.NODE_ENV === 'development'

export const generateProductUrl = (
  typeId: number,
  slug: string,
  productId: number
): string => {
  const type = getSensCritiqueVideoType(typeId)

  if (!type || !slug || !productId) return ''
  return `https://senscritique.com/${type}/${slug}/${productId}`
}

export const generateRedirectUrl = async (
  videoName: string
): Promise<string> => {
  const redirectUrl = (await getBaseUrl()) + '/search?query=%search%'

  return redirectUrl.replace('%search%', videoName)
}

export const getBaseUrl = async (): Promise<string> => {
  if (devMode) {
    return 'https://senscritique.local'
  }

  return 'https://www.senscritique.com'
}

export const getSearchUrl = async (): Promise<string> => {
  if (devMode) {
    return 'https://apollo.senscritique.local'
  }

  return 'https://apollo.senscritique.com'
}
