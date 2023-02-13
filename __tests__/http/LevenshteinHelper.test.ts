import {
  levenshteinDistance,
  shortStringMatchedLevenshtein,
  longStringMatchedLevenshtein,
  matchedWithLevenshtein,
} from '../../src/helper/LevenshteinHelper'
import { test, expect } from '@jest/globals'

describe('levenshteinDistance tests', () => {
  test('It should render 0', () => {
    expect(levenshteinDistance('mike', 'mike')).toBe(0)
  })

  test('It should render 2', () => {
    expect(levenshteinDistance('mike   ', 'mike  45')).toBe(2)
  })

  test('It should render 3', () => {
    expect(levenshteinDistance('test test test', 'test test test 35')).toBe(3)
  })
})

describe('shortStringMatchedLevenshtein tests', () => {
  test('It should render true', () => {
    expect(shortStringMatchedLevenshtein('mike', 0)).toBeTruthy()
  })

  test('It should render false', () => {
    expect(shortStringMatchedLevenshtein('mike 36', 3)).toBeFalsy()
  })

  test('It should render false', () => {
    expect(shortStringMatchedLevenshtein('test test test', 5)).toBeFalsy()
  })
})

describe('longStringMatchedLevenshtein tests', () => {
  test('It should render false', () => {
    expect(longStringMatchedLevenshtein('mike', 0)).toBeFalsy()
  })

  test('It should render false', () => {
    expect(longStringMatchedLevenshtein('mike 36', 3)).toBeFalsy()
  })

  test('It should render false', () => {
    expect(longStringMatchedLevenshtein('test test test', 5)).toBeFalsy()
  })

  test('It should render true', () => {
    expect(longStringMatchedLevenshtein('test test test', 4)).toBeTruthy()
  })
})

describe('matchedWithLevenshtein tests', () => {
  test('It should render false', () => {
    expect(
      matchedWithLevenshtein('Andor', 'Vader: A Star Wars Theory Fan Series')
    ).toBeFalsy()
  })
  test('It should render false', () => {
    expect(matchedWithLevenshtein('Andor', 'Andor')).toBeTruthy()
  })
  test('It should render false', () => {
    expect(matchedWithLevenshtein('Andor', 'Andors')).toBeTruthy()
  })
  test('It should render false', () => {
    expect(matchedWithLevenshtein('Andor', 'Andors 34')).toBeFalsy()
  })
  test('It should render false', () => {
    expect(matchedWithLevenshtein('Andor', '')).toBeFalsy()
  })
  test('It should render false', () => {
    expect(matchedWithLevenshtein('', 'Andor')).toBeFalsy()
  })
})
