export const numbersMatched = (number1: number, number2: number): boolean => {
  if (number1 && number2) {
    console.log(number1 === number2)
    return number1 === number2
  }
  return false
}

export const stringsMatched = (string1: string, string2: string): boolean => {
  if (string1 && string2) {
    return string1 === string2
  }
  return false
}
