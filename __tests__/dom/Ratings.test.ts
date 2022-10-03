import { test, expect } from '@jest/globals'
import Ratings from '../../src/dom/Ratings'

test('It should render one div for SensCritique', () => {
  const ratingsDiv = Ratings.render('XXX')

  expect(ratingsDiv).not.toBeNull()
  expect(ratingsDiv.childNodes.length).toBe(1)
  expect((ratingsDiv.childNodes[0] as Element).classList).toContain('senscritique_XXX')
})
