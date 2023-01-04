import { test, expect } from '@jest/globals'
import { SensCritique } from '../../src/http/SensCritique'

const sensCritique = new SensCritique()

test('It should render null', () => {
  expect(sensCritique.cleanTitle('')).toBeNull()
})

test('It should render title in lowercase', () => {
  expect(sensCritique.cleanTitle('test Test')).toBe('test test')
})

test('It should remove all char from string', () => {
  expect(sensCritique.cleanTitle("te’st,' -Test!™!?!")).toBe('test test')
})

test('It should remove string inside parentheses', () => {
  expect(sensCritique.cleanTitle('test Test(hello)')).toBe('test test')
})
