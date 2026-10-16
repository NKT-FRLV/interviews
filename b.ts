// Назовите порядок вывода в консоль. Объясните, что меняет await.

async function first() {
  console.log(2);
  await second();
  console.log(6);
}

async function second() {
  console.log(3);
  await Promise.resolve();
  console.log(5);
}

console.log(1);

void first();

Promise.resolve().then(() => {
  console.log(4);
});

setTimeout(() => {
  console.log(8);
}, 0);

console.log(7);
