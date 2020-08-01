import { COLOR, Rating } from '../../src/dom/Rating'
import { test } from '@jest/globals'

test.each([[0], [null], [undefined], ['']])('Rating must be grey if score is %s', (score) => {
  const rating = new Rating()
  rating.rating = score
  expect(rating.color).toBe(COLOR.GREY)
})

test.each([[1], [5], [15], [24]])('Rating must be red if score is %i', (score) => {
  const rating = new Rating()
  rating.rating = score
  expect(rating.color).toBe(COLOR.RED)
})

test.each([[25], [26], [30], [49]])('Rating must be orange if score is %i', (score) => {
  const rating = new Rating()
  rating.rating = score
  expect(rating.color).toBe(COLOR.ORANGE)
})

test.each([[50], [54], [67], [74]])('Rating must be yellow if score is %i', (score) => {
  const rating = new Rating()
  rating.rating = score
  expect(rating.color).toBe(COLOR.YELLOW)
})

test.each([[75], [79], [82], [100]])('Rating must be green if score is %i', (score) => {
  const rating = new Rating()
  rating.rating = score
  expect(rating.color).toBe(COLOR.GREEN)
})
