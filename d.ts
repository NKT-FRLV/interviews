// Задача D. Свои map и filter.
// Реализуйте map и filter сами, БЕЗ Array.prototype.map / filter / reduce / forEach.
// Нужны и реализация, и типы: примеры ниже должны работать без явного указания типов.
//
// 1. map: callback получает (item, index). Тип результата зависит от callback.
// 2. filter: callback получает (item, index).
//    - если predicate является type guard (item is S), результат имеет тип S[];
//    - если predicate возвращает обычный boolean, результат имеет тип T[].
// 3. Обе функции должны принимать и обычные массивы, и readonly-массивы.
// 4. Бонус: reduce с начальным значением и без него.
//
// Типы проверяются командой `yarn typecheck:tasks`. Запуск `yarn d` только печатает результаты.
// Строки с @ts-expect-error должны остаться ошибкой TypeScript: если ошибки нет, tsc сообщит об этом.

export function map(items: any, transform: any): any {
  throw new Error("Не реализовано");
}

export function filter(items: any, predicate: any): any {
  throw new Error("Не реализовано");
}

// Бонус.
export function reduce(items: any, reducer: any, initial?: any): any {
  throw new Error("Не реализовано");
}

// ───── Проверки (не менять) ─────

const numbers = [1, 2, 3, 4] as const;
const mixed: (string | number)[] = [1, "a", 2, "b"];
const isString = (value: string | number): value is string => typeof value === "string";

const labels = map(numbers, (n, i) => `${i}:${n.toFixed(1)}`);
const labelsOk: string[] = labels;
// @ts-expect-error Результат map: string[], а не number[].
const labelsBad: number[] = labels;

const strings = filter(mixed, isString);
const stringsOk: string[] = strings;
console.log(strings[0]?.toUpperCase()); // после type guard элементы имеют тип string

const evens = filter(mixed, (value) => typeof value === "number" && value % 2 === 0);
const evensOk: (string | number)[] = evens;
// @ts-expect-error Обычный boolean не сужает тип: результат (string | number)[].
const evensBad: number[] = evens;

const readonlyOk: readonly number[] = filter(numbers, (n) => n > 2);

// Бонус: reduce.
const sum: number = reduce(numbers, (acc, n) => acc + n, 0);
const joined: string = reduce(numbers, (acc, n) => acc + n, "");
// @ts-expect-error Аккумулятор строка, а не число.
const sumBad: number = reduce(numbers, (acc, n) => acc + n, "");

// Эта функция не вызывается: она нужна только для проверки типов.
function typeErrors() {
  // @ts-expect-error Элемент: литеральный union 1 | 2 | 3 | 4, у числа нет toUpperCase.
  map(numbers, (n) => n.toUpperCase());
  // @ts-expect-error Callback filter должен возвращать boolean.
  filter(numbers, (n) => n.toFixed());
  // @ts-expect-error Элемент evens: string | number, у number нет toUpperCase.
  evens[0]?.toUpperCase();
}
void typeErrors;

console.log(labels, strings, evens, readonlyOk, sum, joined);
