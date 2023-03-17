import { test, expect } from '@jest/globals'
import { SensCritiqueRating } from '../../src/dom/SensCritiqueRating'

const successDataset = [
  ['2,3', 23],
  ['8.6', 86],
  ['10', 100],
  ['0,1', 1],
  ['0', 0],
]
test.each(successDataset)(
  'It should convert SensCritique note (%s) in percentage (%s)',
  (sensCritiqueNote, expected) => {
    const sensCritiqueRating = new SensCritiqueRating({
      name: 'test',
      redirect: '',
    })
    const sensCritiqueExtensionScore =
      sensCritiqueRating.ratingInPercent(sensCritiqueNote)

    expect(sensCritiqueExtensionScore).toBe(expected)
  }
)

const errorDataset = [
  ['2,,5', null],
  [null, null],
  [undefined, null],
  ['11', null],
]
test.each(errorDataset)(
  'It should convert wrong SensCritique note (%s) to null',
  (sensCritiqueNote, expected) => {
    const sensCritiqueRating = new SensCritiqueRating({
      name: 'test',
      redirect: '',
    })
    const sensCritiqueExtensionScore =
      sensCritiqueRating.ratingInPercent(sensCritiqueNote)

    expect(sensCritiqueExtensionScore).toBe(expected)
  }
)

test('It should create instance with rights rating', () => {
  const sensCritiqueRating = new SensCritiqueRating({
    rating: '7',
    name: 'test',
    redirect: '',
  })

  expect(sensCritiqueRating.rating).toBe('7')
})

test('It should render node with rights info', () => {
  const sensCritiqueRating = new SensCritiqueRating({
    rating: '8,5',
    redirect: 'https://google.fr',
    hash: 'XXX',
    name: 'test',
  })
  const mainDiv = document.createElement('div')
  const ratingElement = document.createElement('div')
  ratingElement.classList.add('senscritique_XXX')
  mainDiv.appendChild(ratingElement)
  sensCritiqueRating.render(mainDiv)

  expect(mainDiv).not.toBeNull()
  expect(mainDiv.querySelector('a').getAttribute('href')).toBe(
    'https://google.fr'
  )
  expect((mainDiv.querySelector('span') as HTMLElement)?.innerText).toBe('8,5')
})
