import { test, expect } from '@jest/globals'
import { SensCritiqueRating } from '../../src/dom/SensCritiqueRating'

const successDataset = [
  ['2,3', 23],
  ['8.6', 86],
  ['10', 100],
  ['0,1', 1],
  ['0', 0]
]
test.each(successDataset)('It should convert SensCritique note (%s) in percentage (%s)', (sensCritiqueNote, expected) => {
  const sensCritiqueRating = new SensCritiqueRating({
    name: 'test',
    redirect: ''
  })
  const sensCritiqueExtensionScore = sensCritiqueRating.ratingInPercent(sensCritiqueNote)

  expect(sensCritiqueExtensionScore).toBe(expected)
})

const errorDataset = [
  ['2,,5', null],
  [null, null],
  [undefined, null],
  ['11', null]
]
test.each(errorDataset)('It should convert wrong SensCritique note (%s) to null', (sensCritiqueNote, expected) => {
  const sensCritiqueRating = new SensCritiqueRating({
    name: 'test',
    redirect: ''
  })
  const sensCritiqueExtensionScore = sensCritiqueRating.ratingInPercent(sensCritiqueNote)

  expect(sensCritiqueExtensionScore).toBe(expected)
})

test('It should create instance with rights rating', () => {
  const sensCritiqueRating = new SensCritiqueRating({
    rating: '7',
    name: 'test',
    redirect: ''
  })

  expect(sensCritiqueRating.rating).toBe(70)
})

test('It should render node with rights info', () => {
  const sensCritiqueRating = new SensCritiqueRating({
    rating: '8,5',
    redirect: 'https://google.fr',
    hashId: 'XXX',
    name: 'test'
  })
  const sensCritiqueRatingRendered = sensCritiqueRating.render()

  expect(sensCritiqueRatingRendered).not.toBeNull()
  expect(sensCritiqueRatingRendered.getAttribute('href')).toBe('https://google.fr')
  expect(sensCritiqueRatingRendered.getAttribute('id')).toBe('XXX')
  expect((sensCritiqueRatingRendered.childNodes[1] as HTMLElement).innerText).toBe('85')
})
