// Уберите any: тип результата identity должен совпадать с типом аргумента.
// Реализацию функции менять не нужно. Проверьте выведенные типы в редакторе.

export function identity(value: any): any {
  return value;
}

const number = identity(42);
const text = identity("hello");
const user = identity({ id: 1, name: "Никита" });

console.log(number.toFixed(2));
console.log(text.toUpperCase());
console.log(user.name);
