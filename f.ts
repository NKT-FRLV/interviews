// Задача F. Типобезопасный Emitter и get по пути.
// Нужны реализация и типы. Типы проверяются командой `yarn typecheck:tasks`, запуск `yarn f` печатает результат.
// Строки с @ts-expect-error должны остаться ошибками TypeScript.
//
// Часть 1 (обязательная). Emitter<Events>: Events описывает карту «имя события → тип данных».
// - on(event, handler) подписывает обработчик и возвращает функцию отписки;
// - off(event, handler) отписывает обработчик;
// - emit(event, payload) вызывает обработчики; имя события только из Events,
//   тип payload выводится из Events, без явных дженериков в местах вызова;
// - для события с типом void payload передавать не нужно.
//
// Часть 2 (если осталось время). get(obj, "a.b.c"): путь разрешён только существующий,
// тип результата вычисляется по пути. Нужны типы Path<T> и PathValue<T, P> (template literal types).

export class Emitter<Events> {
  on(event: string, handler: (payload: any) => void): any {
    throw new Error("Не реализовано");
  }

  off(event: string, handler: (payload: any) => void): void {
    throw new Error("Не реализовано");
  }

  emit(event: string, payload?: any): void {
    throw new Error("Не реализовано");
  }
}

export function get(obj: any, path: string): any {
  throw new Error("Не реализовано");
}

// ───── Проверки (не менять) ─────

type AppEvents = {
  login: { userId: number; name: string };
  logout: void;
  error: Error;
};

const emitter = new Emitter<AppEvents>();

const unsubscribe = emitter.on("login", (payload) => {
  console.log(payload.userId.toFixed(0), payload.name.toUpperCase());
});
emitter.on("logout", () => console.log("bye"));
emitter.emit("login", { userId: 1, name: "Аня" });
emitter.emit("logout");
unsubscribe();

// Эта функция не вызывается: она нужна только для проверки типов.
function typeErrors() {
  // @ts-expect-error Такого события нет в AppEvents.
  emitter.on("signup", () => {});
  // @ts-expect-error У login нет поля email.
  emitter.on("login", (payload) => payload.email);
  // @ts-expect-error Неверный тип payload.
  emitter.emit("login", { userId: "1", name: "Аня" });
  // @ts-expect-error Для login payload обязателен.
  emitter.emit("login");
  // @ts-expect-error Для logout payload передавать нельзя.
  emitter.emit("logout", { userId: 1 });
  // @ts-expect-error Обработчик error получает Error, у него нет userId.
  emitter.on("error", (error) => error.userId);
}
void typeErrors;

// Часть 2.
const settings = {
  user: { name: "Аня", address: { city: "Мадрид", zip: 28001 } },
  theme: "dark",
  flags: ["a", "b"],
};

const city: string = get(settings, "user.address.city");
const zip: number = get(settings, "user.address.zip");
const theme: string = get(settings, "theme");
const user: { name: string; address: { city: string; zip: number } } = get(settings, "user");

function pathErrors() {
  // @ts-expect-error Такого пути нет.
  get(settings, "user.address.street");
  // @ts-expect-error zip имеет тип number, а не string.
  const zipBad: string = get(settings, "user.address.zip");
}
void pathErrors;

console.log(city, zip, theme, user);
