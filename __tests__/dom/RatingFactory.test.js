import { test } from '@jest/globals'
import RatingFactory from '../../src/dom/RatingFactory'
import { Service } from '../../src/http/Service'
import { AllocineRating } from '../../src/dom/AllocineRating'
import { SensCritiqueRating } from '../../src/dom/SensCritiqueRating'

test('It should create an AllocineRating instance', () => {
  const allocineRating = (new RatingFactory()).create(Service.ALLOCINE, {})
  expect(allocineRating).toBeInstanceOf(AllocineRating)
})

test('It should create an SensCritiqueRating instance', () => {
  const sensCritiqueRating = (new RatingFactory()).create(Service.SENSCRITIQUE, {})
  expect(sensCritiqueRating).toBeInstanceOf(SensCritiqueRating)
})
