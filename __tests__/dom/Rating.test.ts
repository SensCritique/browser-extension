import { COLOR, Rating } from '../../src/dom/Rating'
import { test, expect } from '@jest/globals'

test.each([[0], [null], [undefined], ['']])(
  'Rating must be grey if score is %s',
  (score) => {
    const rating = new Rating()
    rating.ratingPercent = score
    expect(rating.color).toBe(COLOR.GREY)
  }
)

test.each([[1], [5], [15], [24], [36], [47], [54]])(
  'Rating must be red if score is %i',
  (score) => {
    const rating = new Rating()
    rating.ratingPercent = score
    expect(rating.color).toBe(COLOR.RED)
  }
)

test.each([[56], [60], [63]])(
  'Rating must be yellow if score is %i',
  (score) => {
    const rating = new Rating()
    rating.ratingPercent = score
    expect(rating.color).toBe(COLOR.YELLOW)
  }
)

test.each([[66], [70], [75], [79], [82], [100]])(
  'Rating must be green if score is %i',
  (score) => {
    const rating = new Rating()
    rating.ratingPercent = score
    expect(rating.color).toBe(COLOR.GREEN)
  }
)
