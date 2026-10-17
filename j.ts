// Задача J. LRU-кэш.
// Реализуйте класс LRUCache с ограничением по размеру (capacity):
// - get(key) возвращает значение или undefined и помечает ключ как «недавно использованный»;
// - set(key, value) добавляет или обновляет значение; при переполнении удаляется
//   самый давно не использованный ключ;
// - has(key) проверяет наличие ключа и НЕ меняет порядок;
// - size возвращает текущее число элементов.
// get и set должны работать за O(1). Сортировать массив и искать минимум по времени нельзя.
// Запуск: `yarn j`. Таблица внизу показывает ожидаемый и фактический результат, её не менять.

export class LRUCache<K, V> {
  constructor(private readonly capacity: number) {}

  get size(): number {
    return 0;
  }

  get(key: K): V | undefined {
    return undefined;
  }

  set(key: K, value: V): void {}

  has(key: K): boolean {
    return false;
  }
}

// ───── Проверки (не менять) ─────

const cache = new LRUCache<string, number>(2);

const steps: { action: string; run: () => unknown; expected: unknown }[] = [
  { action: "set a=1", run: () => cache.set("a", 1), expected: undefined },
  { action: "set b=2", run: () => cache.set("b", 2), expected: undefined },
  { action: "get a", run: () => cache.get("a"), expected: 1 },
  { action: "set c=3 (вытесняет b)", run: () => cache.set("c", 3), expected: undefined },
  { action: "get b", run: () => cache.get("b"), expected: undefined },
  { action: "has a (порядок не меняется)", run: () => cache.has("a"), expected: true },
  { action: "set d=4 (вытесняет a)", run: () => cache.set("d", 4), expected: undefined },
  { action: "has a", run: () => cache.has("a"), expected: false },
  { action: "get c", run: () => cache.get("c"), expected: 3 },
  { action: "set d=40 (обновление, size не растёт)", run: () => cache.set("d", 40), expected: undefined },
  { action: "size", run: () => cache.size, expected: 2 },
  { action: "set e=5 (вытесняет c, он старее d)", run: () => cache.set("e", 5), expected: undefined },
  { action: "get c", run: () => cache.get("c"), expected: undefined },
  { action: "get d", run: () => cache.get("d"), expected: 40 },
  { action: "get e", run: () => cache.get("e"), expected: 5 },
];

console.table(
  steps.map(({ action, run, expected }) => {
    const actual = run();
    return { action, expected, actual, ok: Object.is(actual, expected) ? "✓" : "✗" };
  }),
);
