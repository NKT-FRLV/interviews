// Уберите any: разрешите только существующие ключи объекта.
// Тип результата должен зависеть от выбранного ключа. Реализацию менять не нужно.

export function getProperty(object: any, key: string): any {
  return object[key];
}

const user = { id: 1, name: "Никита", active: true };

const id = getProperty(user, "id");
const name = getProperty(user, "name");
const active = getProperty(user, "active");

console.log(id.toFixed(0));
console.log(name.toUpperCase());
console.log(active);

// После типизации этот вызов должен давать ошибку TypeScript:
// getProperty(user, "email");
