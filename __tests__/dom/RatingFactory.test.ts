import { test, expect } from '@jest/globals'
import RatingFactory from '../../src/dom/RatingFactory'
import { Service } from '../../src/http/Service'
import { SensCritiqueRating } from '../../src/dom/SensCritiqueRating'

test('It should create an SensCritiqueRating instance', () => {
  const sensCritiqueRating = (new RatingFactory()).create(Service.SENSCRITIQUE, {
    name: 'test',
    redirect: ''
  })
  expect(sensCritiqueRating).toBeInstanceOf(SensCritiqueRating)
})
