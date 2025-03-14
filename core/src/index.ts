async function printNumber(num: number): Promise<void> {
  console.log("the number is ", num);
}

async function main() {
  await printNumber(42);
}

main();
