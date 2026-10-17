# Для интервьюера

Здесь есть решения. Не открывать вместе с кандидатом до обсуждения его варианта.

Ориентир на весь набор: 90–120 минут с обсуждением. За час можно выбрать `a`, `c`, одну задачу на типы, `g` или `i` и `h` или `j`. Задачи `d`, `e`, `f` сложнее прежних: выбирайте одну, примерно по 20–30 минут каждая (оценка, не измерение). Это оценка времени, а не измеренный результат.

## a. Promise и таймеры

```text
1
6
3
5
2
4
```

Сначала выполняется синхронный код. Затем обработчики Promise из очереди микрозадач, включая второй `.then`. После этого выполняются таймеры. Таймер с `2` зарегистрирован раньше таймера с `4`.

Хороший ответ объясняет порядок, а не только называет числа. Дополнительный вопрос: что изменится, если внутри первого `.then` вернуть Promise, который разрешается из таймера?

## b. Дождаться таймера

Исходный вывод:

```text
1
3
5
4
2
```

`1`, `3` и `5` выполняются сразу. Таймер на 10 мс с `4` срабатывает раньше таймера на 40 мс с `2`.

Решение. `resolve` вызывается внутри `setTimeout`, после нужного лога:

```ts
const run = async () => {
  console.log(1);

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log(2);
      resolve();
    }, 40);
  });

  console.log(3);

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log(4);
      resolve();
    }, 10);
  });

  console.log(5);
};
```

Если `resolve()` стоит рядом с `setTimeout`, а не внутри него, `await` заканчивается сразу. Тогда снова будет `1`, `3`, а `2` придёт позже.

Допустим и вариант, где таймер только отпускает ожидание, а лог стоит после него:

```ts
await new Promise<void>((resolve) => {
  setTimeout(resolve, 40);
});

console.log(2);
```

Менять задержки бесполезно. При нулевых задержках порядок всё равно `1, 3, 5, 2, 4`.

Проверка: `yarn b` печатает пять строк подряд, `1` затем `2`, `3`, `4` и `5`. `await` останавливает только `run`, не весь JavaScript.

## c. Палиндром

```ts
export function isPalindrome(value: string): boolean {
  const characters = Array.from(value);
  let left = 0;
  let right = characters.length - 1;

  while (left < right) {
    if (characters[left] !== characters[right]) {
      return false;
    }
    left += 1;
    right -= 1;
  }

  return true;
}
```

Этот вариант сравнивает Unicode code points, включая простые emoji. Сложность O(n) по времени и памяти. При обращении к `value[left]` вместо `Array.from` дополнительная память будет O(1), но сравнение пойдёт по UTF-16 code units. Для примеров из задания подходят оба варианта. Составные графемы не входят в исходные условия.

Допустим и короткий вариант с разворотом массива символов. Не требуйте именно два указателя.

Что проверить: пустая строка, один символ, чётная и нечётная длина, несовпадение в середине, регистр. Усложнение: игнорировать пробелы, знаки препинания и регистр, предварительно договорившись о допустимых символах.

## d. Свои map и filter

Решение. Типы и реализация вместе:

```ts
export function map<T, U>(
  items: readonly T[],
  transform: (item: T, index: number) => U,
): U[] {
  const result: U[] = [];
  for (let index = 0; index < items.length; index += 1) {
    result.push(transform(items[index], index));
  }
  return result;
}

export function filter<T, S extends T>(
  items: readonly T[],
  predicate: (item: T, index: number) => item is S,
): S[];
export function filter<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): T[];
export function filter<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): T[] {
  const result: T[] = [];
  for (let index = 0; index < items.length; index += 1) {
    if (predicate(items[index], index)) {
      result.push(items[index]);
    }
  }
  return result;
}

// Бонус.
export function reduce<T>(
  items: readonly T[],
  reducer: (acc: T, item: T, index: number) => T,
): T;
export function reduce<T, A>(
  items: readonly T[],
  reducer: (acc: A, item: T, index: number) => A,
  initial: A,
): A;
export function reduce<T, A>(
  items: readonly T[],
  reducer: (acc: A, item: T, index: number) => A,
  ...rest: [initial?: A]
): A {
  let index = 0;
  let acc: A;
  if (rest.length > 0) {
    acc = rest[0] as A;
  } else {
    if (items.length === 0) throw new TypeError("Пустой массив без начального значения");
    acc = items[0] as unknown as A;
    index = 1;
  }
  for (; index < items.length; index += 1) {
    acc = reducer(acc, items[index], index);
  }
  return acc;
}
```

Что смотреть:

- `map<T, U>`: `T` выводится из массива, `U` из результата callback. Принимать нужно `readonly T[]`, иначе `as const` массив не пройдёт.
- Перегрузка с type guard идёт первой. Если поставить её второй, boolean-перегрузка перехватит вызов и результат будет `T[]`. Это частая ошибка.
- В реализации цикл по индексу, без `Array.prototype.map/filter`. Пропуски в разреженных массивах не обязательны.
- `reduce` с перегрузками: без начального значения аккумулятор того же типа, что и элемент. Для бонуса достаточно одного варианта.

Проверка: скопируйте решение вместо заглушек, запустите `yarn typecheck:tasks` (ошибок быть не должно) и `yarn d`. Если `@ts-expect-error` сообщает «Unused», типы слишком слабые.

Допустимо: `S` без ограничения `extends T`. Не требуйте обработки `this`, `thisArg` и разреженных массивов.

Вопросы: почему перегрузки, а не union в возвращаемом типе? Как типизировать `filter(Boolean)` так, чтобы `undefined` и `null` исчезали из типа? Что изменится, если массив — кортеж?

## e. Типы уровня типов

Решения по шагам (вставьте вместо заглушек, `Equal` и `Expect` уже есть в файле):

```ts
type MyReturnType<F extends (...args: any) => any> = F extends (...args: any) => infer R ? R : never;

type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T;

type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type Flatten<T extends readonly unknown[]> = T extends readonly [infer Head, ...infer Tail]
  ? Head extends readonly unknown[]
    ? [...Flatten<Head>, ...Flatten<Tail>]
    : [Head, ...Flatten<Tail>]
  : [];

type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (
  arg: infer I,
) => void
  ? I
  : never;
```

Что смотреть и где обычно спотыкаются:

1. `MyReturnType`: нужны `infer R` и ограничение на `F`, иначе `@ts-expect-error` для `string` не сработает.
2. `MyAwaited`: рекурсия и `PromiseLike`. Без рекурсии вложенные Promise не разворачиваются. Условный тип распределяется по union сам, это нужно для последнего примера.
3. `PickByValue`: key remapping через `as`, ветка `never` убирает ключ. Вариант с `Pick<T, {...}[keyof T]>` тоже верный.
4. `Flatten`: рекурсия по `[infer Head, ...infer Tail]`. Для `[]` возвращается `[]`. Типичная ошибка: потерять рекурсию для вложенных кортежей.
5. `DeepReadonly`: функции нужно исключить, иначе они превратятся в объект. Гомоморфный mapped type сам даёт `readonly` для массивов и кортежей.
6. `UnionToIntersection` — бонус на контравариантность `infer` в позиции аргумента. Если кандидат не придумал, не продолжайте: это знание трюка, а не навык.

Проверка: решение вместо заглушек, `yarn typecheck:tasks` без ошибок. Если решение ломается на каком-то `Expect`, сверьте, что точно вернул тип, например через `type X = DeepReadonly<Config>` и наведение в редакторе.

Вопросы: чем `Equal` отличается от `A extends B ? B extends A ...`? Почему `any` проходит многие проверки совместимости? Что делает `infer` и где он разрешён?

## f. Emitter и get по пути

Решение. Часть 1 и часть 2 вместе:

```ts
type Handler<P> = (payload: P) => void;

export class Emitter<Events extends object> {
  private handlers: { [K in keyof Events]?: Set<Handler<Events[K]>> } = {};

  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void {
    (this.handlers[event] ??= new Set()).add(handler);
    return () => this.off(event, handler);
  }

  off<K extends keyof Events>(event: K, handler: Handler<Events[K]>): void {
    this.handlers[event]?.delete(handler);
  }

  emit<K extends keyof Events>(
    event: K,
    ...args: Events[K] extends void ? [] : [payload: Events[K]]
  ): void {
    for (const handler of [...(this.handlers[event] ?? [])]) {
      handler(args[0] as Events[K]);
    }
  }
}

type Path<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? K | `${K}.${Path<T[K]>}` : K;
    }[keyof T & string]
  : never;

type PathValue<T, P extends string> = P extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? PathValue<T[Head], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export function get<T, P extends Path<T>>(obj: T, path: P): PathValue<T, P> {
  let current: any = obj;
  for (const key of path.split(".")) {
    current = current?.[key];
  }
  return current;
}
```

В `f.ts` строка `new Emitter<AppEvents>()` уже есть, а класс из заглушки нужно переписать.

Что смотреть:

- Часть 1: `K extends keyof Events` связывает имя события и тип payload. Результат `on` — функция отписки. Обработчики хранятся в `Set`, а при `emit` итерируются по копии, чтобы отписка внутри обработчика не ломала обход.
- Rest-параметры с условным типом `Events[K] extends void ? [] : [payload: Events[K]]` — самое сложное место. Допустим более простой вариант с необязательным payload, но тогда `emit("login")` не будет ошибкой, а проверка `@ts-expect-error` её покажет. Для оценки уровня достаточно, чтобы кандидат дошёл до `keyof` и индексного доступа, а rest-параметр можно подсказать.
- Часть 2: рекурсивный `Path<T>` с template literal и `PathValue<T, P>` через `infer Head`/`Rest`. Без `T[K] extends object` путь заканчивается на первом уровне. Массивы в путях не поддерживаются, это договорённость.

Проверка: решение вместо заглушек, `yarn typecheck:tasks` без ошибок, затем `yarn f`: должны напечататься `1 АНЯ`, `bye` и строка с городом.

Вопросы: как сделать `once`? Что будет с `Events`, объявленным как `interface`, а не `type`? Почему `[...handlers]` в `emit`? Как добавить поддержку индексов массивов в `Path`?

## g. React и debounce

Условие задаётся устно. Инпут должен обновляться сразу, а на сервер должно уходить полное актуальное значение через 500 мс после последнего изменения. Использовать уже импортированный `debounce` из `lodash`. Нужен trailing-вызов без немедленной отправки. Отправка пустой строки после очистки тоже нужна.

Исходная версия вызывает `sendToServer` на каждом изменении. Сервер хранит все полученные строки, последнее сообщение сверху. Это локальная синхронная имитация без сети.

В `g.tsx` замените импорт React и участок от объявления состояний до `return` следующим кодом. Импорты `debounce`, `Server` и JSX остаются прежними.

```tsx
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";

export default function App() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendToServer = useCallback((message: string) => {
    setMessages((previous) => [message, ...previous]);
  }, []);

  const debouncedSend = useMemo(
    () => debounce(sendToServer, 500),
    [sendToServer],
  );

  useEffect(() => {
    return () => debouncedSend.cancel();
  }, [debouncedSend]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;
    setValue(nextValue);
    debouncedSend(nextValue);
  }

  // Здесь остаётся исходный return с JSX.
}
```

Возможны другие корректные решения. Важны стабильный экземпляр debounced-функции, актуальное значение, мгновенный ввод и отмена ожидающей отправки при размонтировании. Аргументом передаётся строка, а не событие.

Частая ошибка: создавать `debounce(...)` внутри `handleChange` или заново на каждом рендере. Тогда независимые таймеры отправят несколько промежуточных значений. Другая ошибка: дебаунсить `setValue`, задерживая сам ввод.

Проверка в браузере:

1. Быстро набрать `react`. В инпуте сразу `react`, на сервере пока пусто.
2. Спустя 500 мс после последнего символа на сервере одна запись `"react"`.
3. Сделать паузу более 500 мс между двумя порциями ввода. Получить две записи.
4. Быстро очистить поле. После паузы получить `""`.
5. Вставить длинную строку. Отправляется целиком, вёрстка не разъезжается.
6. При размонтировании до истечения задержки ожидающий вызов отменяется.

## h. Порядок сообщений

Исходный вывод с интервалом 250 мс:

```text
8, 5, 2, 6, 1, 4, 3, 7, 10, 9
```

Требуемый вывод: `1, 2, 3, 4, 5, 6, 7, 8, 9, 10`, каждый ID отдельной строкой.

Состояние обработчика и решение:

```ts
let nextId = 1;
const pending = new Set<number>();

export function receive(id: number) {
  pending.add(id);

  while (pending.has(nextId)) {
    console.log(nextId);
    pending.delete(nextId);
    nextId += 1;
  }
}
```

После прихода `1` сразу выводятся `1, 2`. После `3` выводятся `3, 4, 5, 6`. После `7` выводятся `7, 8`. После `9` выводятся `9, 10`. Это помогает отличить потоковое решение от сортировки всех сообщений в конце.

Каждый ID добавляется и удаляется один раз. В среднем O(n) по времени для всего потока, до O(n) по памяти при обратном порядке. Для сообщений с текстом вместо `Set` нужен `Map` с полезной нагрузкой.

Дополнительные последовательности для обсуждения: `1, 2, 3`, `3, 2, 1`, `2, 1, 4, 3`. Каждый пример начинайте с нового состояния. Пропуски, дубликаты, повторные подключения и несколько чатов не входят в исходные условия.

## i. Вёрстка: карточки тарифов

Задача проверяет CSS и семантику, логики нет. Запуск: `yarn i`. Кандидат правит `App` и `i.css`.

Эталонное решение. В `i.tsx` замените `App` на этот код, а `plans` оставьте:

```tsx
function CheckIcon() {
  return (
    <svg className="plan__check" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const priceFormat = new Intl.NumberFormat("ru-RU");

export default function App() {
  return (
    <main className="pricing">
      <header className="pricing__header">
        <h1>Тарифы</h1>
        <p>Выберите план для своей команды. Отменить можно в любой момент.</p>
      </header>

      <ul className="pricing__grid">
        {plans.map((plan) => (
          <li key={plan.id} className={plan.popular ? "plan plan--popular" : "plan"}>
            {plan.popular && <span className="plan__badge">Популярный</span>}
            <h2 className="plan__name">{plan.name}</h2>
            <p className="plan__description">{plan.description}</p>
            <p className="plan__price">
              <span className="plan__amount">{plan.price === 0 ? "Бесплатно" : `${priceFormat.format(plan.price)} ₽`}</span>
              {plan.price > 0 && <span className="plan__period"> / мес</span>}
            </p>
            <ul className="plan__features">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="plan__button" disabled={!plan.available}>
              {plan.available ? `Выбрать ${plan.name}` : "Скоро"}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

`i.css`:

```css
:root {
  --bg: #f5f6f8;
  --card: #fff;
  --text: #1c2230;
  --muted: #5b6475;
  --border: #dde1e8;
  --accent: #3b5bdb;
  --accent-dark: #2f49b0;
}

* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; color: var(--text); background: var(--bg); }

.pricing { max-width: 1040px; margin: 0 auto; padding: 48px 24px; }
.pricing__header { text-align: center; margin-bottom: 40px; }
.pricing__header h1 { margin: 0 0 8px; font-size: clamp(28px, 5vw, 40px); }
.pricing__header p { margin: 0; color: var(--muted); }

.pricing__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.plan {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 32px 24px 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
}
.plan--popular { border: 2px solid var(--accent); box-shadow: 0 8px 24px rgb(59 91 219 / 15%); }
.plan__badge {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.plan__name { margin: 0 0 8px; font-size: 20px; }
.plan__description { margin: 0 0 16px; color: var(--muted); }
.plan__price { margin: 0 0 24px; }
.plan__amount { font-size: 32px; font-weight: 800; }
.plan__period { color: var(--muted); }

.plan__features { display: grid; gap: 12px; padding: 0; margin: 0 0 32px; list-style: none; }
.plan__features li { display: flex; align-items: flex-start; gap: 8px; }
.plan__check { flex: none; color: var(--accent); }

.plan__button {
  margin-top: auto;
  padding: 12px 16px;
  border: 0;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
}
.plan__button:hover:not(:disabled) { background: var(--accent-dark); }
.plan__button:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
.plan__button:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; }

@media (max-width: 640px) {
  .pricing { padding: 32px 16px; }
  .pricing__grid { grid-template-columns: 1fr; gap: 32px; }
}
```

Что проверить:

1. Ширина 1000 px: три колонки равной ширины, карточки одной высоты, кнопки на одной линии (`margin-top: auto` в flex-колонке).
2. Ширина 640 px и меньше: одна колонка без горизонтального скролла. Проверьте 320 px.
3. «Команда» выделена и имеет бейдж, бейдж не обрезается и не уезжает на узком экране.
4. Галочки не сжимаются при длинном тексте (`flex: none`), текст переносится.
5. Кнопка: hover (не срабатывает на disabled), видимый `:focus-visible` при Tab, disabled выглядит иначе и не кликается.
6. Семантика: `h1`, `h2`, списки `ul/li`, настоящий `button`, иконки с `aria-hidden`. Цена не разбита так, что читается как два разных числа.
7. Данные не захардкожены в JSX: тарифы и возможности выводятся через `.map`, у каждого `key`.

Допустимо: `auto-fit` + `minmax` вместо media query, если на 640 px получается одна колонка. Вместо `Intl.NumberFormat` подойдёт простое `price`.

Вопросы: как сделать так, чтобы «Команда» шла первой на мобильном (`order`)? Чем `grid` лучше `flex` для этой сетки? Что такое `:focus-visible` и чем он отличается от `:focus`? Как изменить сетку без media query?

Время: около 25–30 минут (оценка, не измерение). Если кандидат тратит время на красоту, остановите его после выполнения пунктов 1–6.

## j. LRU-кэш

Решение:

```ts
export class LRUCache<K, V> {
  private readonly items = new Map<K, V>();

  constructor(private readonly capacity: number) {}

  get size(): number {
    return this.items.size;
  }

  get(key: K): V | undefined {
    if (!this.items.has(key)) return undefined;
    const value = this.items.get(key) as V;
    this.items.delete(key);
    this.items.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    this.items.delete(key);
    this.items.set(key, value);
    if (this.items.size > this.capacity) {
      const oldest = this.items.keys().next().value as K;
      this.items.delete(oldest);
    }
  }

  has(key: K): boolean {
    return this.items.has(key);
  }
}
```

Идея: `Map` помнит порядок вставки, поэтому первый ключ в `keys()` — самый старый. `get` удаляет и снова добавляет ключ, чтобы переместить его в конец. `set` делает то же самое и вытесняет первый ключ при превышении `capacity`. Все операции O(1) в среднем.

Что смотреть:

- Нужен `Map`, а не объект: у объекта нет гарантии порядка для ключей-чисел (они идут по возрастанию) и ключи приводятся к строке.
- `set` существующего ключа не увеличивает размер и обновляет «свежесть». Без `delete` перед `set` ключ останется на старом месте.
- `has` порядок не меняет. Кандидаты часто реализуют его через `get`.
- Проверка `if (!value)` в `get` ломается для `0`, `""` и `false`. Правильно проверять `has`.

Проверка: `yarn j`, в колонке `ok` везде `✓`. Начальная заглушка даёт часть `✗`, это исходное состояние.

Продолжения: TTL (хранить время истечения и проверять при `get`); `capacity = 0` (кэш не должен ничего хранить); значение `undefined` отличается от «ключа нет». Что быстрее для очень больших кэшей, `Map` или двусвязный список с `Map`? Как реализовать то же без порядка `Map`?

Время: около 20 минут (оценка, не измерение).

## На что смотреть в целом

Просите объяснить ход мысли и предложить проверку. Рабочий вывод у задач на типы не доказывает корректность типов. Проверяйте командой `yarn typecheck:tasks`: она сообщает и о неудачных `Expect`, и о неиспользованных `@ts-expect-error`. Самостоятельно замеченные ошибки и их исправление полезнее заученной формулировки.
