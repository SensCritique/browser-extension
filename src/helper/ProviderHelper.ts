export const matchedProviders = (
  sensCritiqueProviders: string[],
  platformProvider: string[]
): boolean => {
  return !!sensCritiqueProviders.find((provider) =>
    provider.toLowerCase().includes(platformProvider[0])
  )
}
