export const numberMatched = (number1: number, number2: number): boolean => {
    console.log('number1', number1)
    console.log('number2', number2)
  if (number1 && number2) {
    return number1 === number2
  }
  return false
}

export const stringMatched = (string1: string, string2: string): boolean => {
  if (string1 && string2) {
    return string1 === string2
  }
  return false
}
