import { test } from '@jest/globals'
import Ratings from '../../src/dom/Ratings'

test('It should render two div, one for SensCritique, one for Allociné', () => {
  const ratingsDiv = Ratings.render('XXX')

  expect(ratingsDiv).not.toBeNull()
  expect(ratingsDiv.childNodes.length).toBe(2)
  expect(ratingsDiv.childNodes[0].classList).toContain('allocine_XXX')
  expect(ratingsDiv.childNodes[1].classList).toContain('senscritique_XXX')
})
