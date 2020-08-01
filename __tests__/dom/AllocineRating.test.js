import { test } from '@jest/globals'
import { AllocineRating } from '../../src/dom/AllocineRating'

// AllocinéNote / Expected
const successDataset = [
  ['2,3', 47],
  ['4.6', 92],
  ['5', 100],
  ['0,1', 2],
  ['0', 0]
]
test.each(successDataset)('It should convert Allocine note (%s) in percentage (%s)', (allocineNote, expected) => {
  const allocineRating = new AllocineRating({})
  const noteflixScore = allocineRating.ratingInPercent(allocineNote)

  expect(noteflixScore).toBe(expected)
})

// AllocinéNote / Expected
const errorDataset = [
  ['2,,5', null],
  [null, null],
  [undefined, null],
  ['6', null]
]
test.each(errorDataset)('It should convert wrong Allocine note (%s) to null', (allocineNote, expected) => {
  const allocineRating = new AllocineRating({})
  const noteflixScore = allocineRating.ratingInPercent(allocineNote)

  expect(noteflixScore).toBe(expected)
})

test('It should create instance with rights rating', () => {
  const allocineRating = new AllocineRating({
    rating: '2,5'
  })

  expect(allocineRating.rating).toBe(50)
})

test('It should render node with rights info', () => {
  const allocineRating = new AllocineRating({
    rating: '2,5',
    redirect: 'https://google.fr',
    hashId: 'XXX'
  })
  const allocineRatingRendered = allocineRating.render()

  expect(allocineRatingRendered).not.toBeNull()
  expect(allocineRatingRendered.getAttribute('href')).toBe('https://google.fr')
  expect(allocineRatingRendered.getAttribute('id')).toBe('XXX')
  expect(allocineRatingRendered.childNodes[1].innerText).toBe('50')
})
