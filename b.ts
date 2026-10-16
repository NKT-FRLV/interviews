// Сейчас числа выводятся не по порядку.
// Измените run, чтобы в консоли было 1, 2, 3, .

const run = async () => {
  console.log(1);

  setTimeout(() => {
    console.log(2);
  }, 40);

  console.log(3);
};

run();
