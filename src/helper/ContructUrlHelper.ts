export const constructUrl = (
  baseUrl: string,
  type: string,
  slug: string,
  productId: number
): string => {
  console.log(baseUrl)
  console.log(type)
  console.log(slug)
  console.log(productId)
  if (!type || !slug || !productId) return ''
  return `${baseUrl}/${type}/${slug}/${productId}`
}
