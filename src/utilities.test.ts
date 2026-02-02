import { sum } from './utilities.js';
describe('Check utilities function', () => {
  test('adds 1 + 3 to equal 4', () => {
    expect(sum(1, 3)).toBe(4);
  });
  test('receives an error if one value is string', () => {
    // @ts-expect-error testing runtime validation of input types
    expect(() => sum(1, '3')).toThrow(
      'the type of the values is wrong, only number',
    );
  });
});
