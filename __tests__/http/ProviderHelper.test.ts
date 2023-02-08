import {
  matchedProviders
} from '../../src/helper/ProviderHelper'

const matchByProvider = [
  [['Netflix'], ['netflix']],
  [['Netflix+', 'Disney'], ['netflix']],
  [['test_Netflix+', 'amazon'], ['netflix']]
]

const notMatchByProvider = [
  [[''], ['netflix']],
  [['Disney'], ['netflix']]
]

describe('matchedProviders tests', () => {
  test.each(matchByProvider)('It should be true', async (senscritiqueProviders, platformName) => {
    expect(matchedProviders(senscritiqueProviders, platformName)).toBeTruthy()
  })

  test.each(notMatchByProvider)('It should be false', async (senscritiqueProviders, platformName) => {
    expect(matchedProviders(senscritiqueProviders, platformName)).toBeFalsy()
  })
})
