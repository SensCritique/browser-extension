import { test } from '@jest/globals'
import { ServiceEnum } from '../../src/http/ServiceEnum'
import Cache from '../../src/storage/Cache'

test('It should save information in sessionStorage', () => {
  const cache = new Cache()
  cache.save({ rating: 10, name: 'Breaking bad' }, ServiceEnum.SENSCRITIQUE)
  const item = sessionStorage.getItem('noteflix_5c68903a7be732b58d17c41f5c4c24ff')

  expect(item).toBe('{"rating":10,"name":"Breaking bad","hashId":"5c68903a7be732b58d17c41f5c4c24ff"}')
})

test('It should fetch information in sessionStorage', () => {
  const cache = new Cache()
  sessionStorage.setItem('noteflix_5c68903a7be732b58d17c41f5c4c24ff', '{"rating":10,"name":"Breaking bad","hashId":"5c68903a7be732b58d17c41f5c4c24ff"}')

  const item = cache.get('Breaking bad', ServiceEnum.SENSCRITIQUE)
  expect(item).toStrictEqual({ rating: 10, name: 'Breaking bad', hashId: '5c68903a7be732b58d17c41f5c4c24ff' })
})

test('It should check if item is already present in cache', () => {
  const cache = new Cache()

  cache.save({ rating: 10, name: 'Breaking bad' }, ServiceEnum.SENSCRITIQUE)
  const exists = cache.exists('Breaking bad', ServiceEnum.SENSCRITIQUE)
  expect(exists).toBeTruthy()
})
