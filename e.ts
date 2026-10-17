// Задача E. Типы уровня типов: infer, conditional и mapped types.
// Здесь нет рантайм-кода. Заменяйте заглушки `any` настоящими типами по порядку, шаги растут по сложности.
// Проверка: `yarn typecheck:tasks`. Проверки в конце файла не менять: Expect/Equal должны сойтись,
// а строки с @ts-expect-error должны оставаться ошибками.
// Встроенные ReturnType, Awaited, Readonly и подобные использовать нельзя.

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type Expect<T extends true> = T;

// 1. MyReturnType<F>: тип результата функции. Для не-функции должна быть ошибка.
type MyReturnType<F> = any;

// 2. MyAwaited<T>: развернуть Promise, в том числе вложенные. Не-Promise возвращается как есть.
//    Достаточно поддержать PromiseLike (любой thenable).
type MyAwaited<T> = any;

// 3. PickByValue<T, V>: оставить только свойства, значения которых совместимы с V.
type PickByValue<T, V> = any;

// 4. Flatten<T>: развернуть вложенные кортежи любой глубины в плоский кортеж.
type Flatten<T> = any;

// 5. DeepReadonly<T>: readonly на всех уровнях, включая массивы и кортежи. Функции не трогать.
type DeepReadonly<T> = any;

// 6. Бонус. UnionToIntersection<U>: превратить union в intersection.
type UnionToIntersection<U> = any;

// ───── Проверки (не менять) ─────

type Fn = (a: number, b: string) => Promise<boolean>;

type R1 = [
  Expect<Equal<MyReturnType<Fn>, Promise<boolean>>>,
  Expect<Equal<MyReturnType<() => void>, void>>,
  Expect<Equal<MyReturnType<<T>(value: T) => T[]>, unknown[]>>,
];
// @ts-expect-error string не является функцией.
type R1Bad = MyReturnType<string>;

type R2 = [
  Expect<Equal<MyAwaited<Promise<string>>, string>>,
  Expect<Equal<MyAwaited<Promise<Promise<number[]>>>, number[]>>,
  Expect<Equal<MyAwaited<number>, number>>,
  Expect<Equal<MyAwaited<PromiseLike<boolean>>, boolean>>,
  Expect<Equal<MyAwaited<Promise<string> | number>, string | number>>,
];

type User = { id: number; name: string; email: string | null; active: boolean; tags: string[] };
type R3 = [
  Expect<Equal<PickByValue<User, string>, { name: string }>>,
  Expect<Equal<PickByValue<User, string | null>, { name: string; email: string | null }>>,
  Expect<Equal<PickByValue<User, number | boolean>, { id: number; active: boolean }>>,
  Expect<Equal<PickByValue<User, Date>, {}>>,
];

type R4 = [
  Expect<Equal<Flatten<[1, [2, 3]]>, [1, 2, 3]>>,
  Expect<Equal<Flatten<[1, [2, [3, [4]]], 5]>, [1, 2, 3, 4, 5]>>,
  Expect<Equal<Flatten<[]>, []>>,
  Expect<Equal<Flatten<[[], ["a"]]>, ["a"]>>,
];
// @ts-expect-error Flatten принимает только массивы и кортежи.
type R4Bad = Flatten<number>;

type Config = {
  host: string;
  ports: number[];
  pair: [string, { deep: number }];
  nested: { a: { b: string } };
  start: () => void;
};
type ExpectedConfig = {
  readonly host: string;
  readonly ports: readonly number[];
  readonly pair: readonly [string, { readonly deep: number }];
  readonly nested: { readonly a: { readonly b: string } };
  readonly start: () => void;
};
type R5 = [
  Expect<Equal<DeepReadonly<Config>, ExpectedConfig>>,
  Expect<Equal<DeepReadonly<number>, number>>,
];
declare const config: DeepReadonly<Config>;
// @ts-expect-error Глубокое свойство только для чтения.
config.nested.a.b = "x";
// @ts-expect-error У readonly-массива нет push.
config.ports.push(1);

type R6 = [
  Expect<Equal<UnionToIntersection<{ a: 1 } | { b: 2 }>, { a: 1 } & { b: 2 }>>,
  Expect<Equal<UnionToIntersection<(() => void) | ((x: number) => void)>, (() => void) & ((x: number) => void)>>,
];

export type { R1, R2, R3, R4, R5, R6, R1Bad, R4Bad };
