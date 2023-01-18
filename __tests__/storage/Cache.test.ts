import { test } from '@jest/globals'
import { Service } from '../../src/enum/Service'
import Cache from '../../src/storage/Cache'

test('It should save information in sessionStorage', () => {
  const cache = new Cache()
  cache.save({ rating: '10', name: 'Breaking bad' }, Service.SENSCRITIQUE)
  const item = sessionStorage.getItem('senscritique_extension_6d20d423f2b94bcd9c4940e3066d0347')

  expect(item).toBe('{"rating":"10","name":"Breaking bad","hashId":"6d20d423f2b94bcd9c4940e3066d0347"}')
})

test('It should fetch information in sessionStorage', () => {
  const cache = new Cache()
  sessionStorage.setItem('senscritique_extension_6d20d423f2b94bcd9c4940e3066d0347', '{"rating":"10","name":"Breaking bad","hashId":"6d20d423f2b94bcd9c4940e3066d0347"}')

  const item = cache.get('Breaking bad', Service.SENSCRITIQUE)
  expect(item).toStrictEqual({ rating: '10', name: 'Breaking bad', hashId: '6d20d423f2b94bcd9c4940e3066d0347' })
})

test('It should check if item is already present in cache', () => {
  const cache = new Cache()

  cache.save({ rating: '10', name: 'Breaking bad' }, Service.SENSCRITIQUE)
  const exists = cache.exists('Breaking bad', Service.SENSCRITIQUE)
  expect(exists).toBeTruthy()
})
