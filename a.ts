// Назовите порядок вывода в консоль. Затем запустите файл и проверьте себя.

console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

Promise.resolve()
  .then(() => {
    console.log(3);

    setTimeout(() => {
      console.log(4);
    }, 0);
  })
  .then(() => {
    console.log(5);
  });

console.log(6);
