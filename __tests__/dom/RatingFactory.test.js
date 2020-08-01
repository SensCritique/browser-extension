import { test } from '@jest/globals'
import RatingFactory from '../../src/dom/RatingFactory'
import { ServiceEnum } from '../../src/http/ServiceEnum'
import { AllocineRating } from '../../src/dom/AllocineRating'
import { SensCritiqueRating } from '../../src/dom/SensCritiqueRating'

test('It should create an AllocineRating instance', () => {
  const allocineRating = (new RatingFactory()).create(ServiceEnum.ALLOCINE, {})
  expect(allocineRating).toBeInstanceOf(AllocineRating)
})

test('It should create an SensCritiqueRating instance', () => {
  const sensCritiqueRating = (new RatingFactory()).create(ServiceEnum.SENSCRITIQUE, {})
  expect(sensCritiqueRating).toBeInstanceOf(SensCritiqueRating)
})
