import { test } from '@jest/globals'
import Cache from '../../src/storage/Cache'

test('It should save information in sessionStorage', () => {
  const cache = new Cache()
  cache.save({
    rating: '10',
    name: 'Breaking bad',
    hash: '6d20d423f2b94bcd9c4940e3066d0347',
  })
  const item = sessionStorage.getItem(
    'senscritique_extension_6d20d423f2b94bcd9c4940e3066d0347'
  )

  expect(item).toBe(
    '{"rating":"10","name":"Breaking bad","hash":"6d20d423f2b94bcd9c4940e3066d0347"}'
  )
})

test('It should fetch information in sessionStorage', () => {
  const cache = new Cache()
  sessionStorage.setItem(
    'senscritique_extension_6d20d423f2b94bcd9c4940e3066d0347',
    '{"rating":"10","name":"Breaking bad","hash":"6d20d423f2b94bcd9c4940e3066d0347"}'
  )

  const item = cache.get('6d20d423f2b94bcd9c4940e3066d0347')
  expect(item).toStrictEqual({
    rating: '10',
    name: 'Breaking bad',
    hash: '6d20d423f2b94bcd9c4940e3066d0347',
  })
})

test('It should check if item is already present in cache', () => {
  const cache = new Cache()

  cache.save({ rating: '10', name: 'Breaking bad', hash: 'AAA' })
  const cachedProduct = cache.get('AAA')

  expect(cachedProduct).toEqual({
    rating: '10',
    name: 'Breaking bad',
    hash: 'AAA',
  })
})
