export const constructUrl = (
  baseUrl: string,
  type: string,
  slug: string,
  productId: number
): string => {
  if (!type || !slug || !productId) return ''
  return `${baseUrl}/${type}/${slug}/${productId}`
}
