import { Provider } from '../enum/Provider'
import { flatten } from '../helper/StringHelper'

export const matchedProviders = (
  sensCritiqueProviders: string[],
  platformProvider: string[]
): boolean => {
  if (!sensCritiqueProviders.length && Provider.PRIME) return true
  if (!sensCritiqueProviders.length) return null

  return sensCritiqueProviders.some((provider) => {
    const p = flatten(provider)?.replace(/ /g, '').toLowerCase()
    switch (platformProvider[0]) {
      case Provider.PRIME:
        return p === platformProvider[0] || p === Provider.OCS
      default:
        return p === platformProvider[0]
    }
  })
}
