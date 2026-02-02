function sum(number1: number, number2: number): number {
  if (typeof number1 === 'string' || typeof number2 === 'string') {
    throw new TypeError('the type of the values is wrong, only number');
  }
  return number1 + number2;
}

export { sum };
