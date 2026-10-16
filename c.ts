// Напишите isPalindrome: строка читается одинаково слева направо и справа налево.
// Учитывайте регистр, пробелы и знаки препинания. Пустая строка тоже палиндром.

export function isPalindrome(value: string): boolean {
  // TODO
  return false;
}

const examples = [
  { value: "шалаш", expected: true },
  { value: "hello", expected: false },
  { value: "", expected: true },
  { value: "a", expected: true },
  { value: "abba", expected: true },
  { value: "Шалаш", expected: false },
  { value: "а а", expected: true },
  { value: "а!", expected: false },
];

console.table(
  examples.map(({ value, expected }) => ({
    value,
    expected,
    actual: isPalindrome(value),
  })),
);
