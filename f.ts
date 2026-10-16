// Уберите any: выведите тип элемента в callback и тип итогового массива.
// Реализацию менять не нужно. Вызовы ниже должны работать без явного указания типов.

export function map(
  items: any[],
  transform: (item: any, index: number) => any,
): any[] {
  return items.map(transform);
}

const strings = map([1, 2, 3], (number) => number.toFixed(2));
const lengths = map(["one", "two", "three"], (word) => word.length);
const names = map(
  [{ name: "Аня" }, { name: "Борис" }],
  (user, index) => `${index + 1}. ${user.name}`,
);

console.log(strings);
console.log(lengths);
console.log(names);
