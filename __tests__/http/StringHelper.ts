import { flatten } from '../../src/helper/StringHelper'
import { test, expect } from '@jest/globals'

test('It should render null', () => {
  expect(flatten('')).toBeNull()
})

test('It should render title in lowercase', () => {
  expect(flatten('test Test')).toBe('test test')
})

test('It should remove all char from string', () => {
  expect(flatten("te’st,' -Test!™!?!")).toBe('test test')
})

test('It should remove string inside parentheses', () => {
  expect(flatten('test Test(hello)')).toBe('test test')
})
