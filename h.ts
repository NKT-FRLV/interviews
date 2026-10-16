// Приходят ID от 1 до 10, каждый ровно один раз, в произвольном порядке.
// Измените receive: выводите ID строго по порядку, как только это возможно.
// Ждать окончания потока нельзя. Меняйте обработчик, а не имитацию бэкенда.

export function receive(id: number) {
  console.log(id);
}

const backend = [8, 5, 2, 6, 1, 4, 3, 7, 10, 9];

for (const id of backend) {
  await new Promise<void>((resolve) => setTimeout(resolve, 250));
  receive(id);
}
