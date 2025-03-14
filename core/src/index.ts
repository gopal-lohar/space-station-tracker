import { getCssTle, getIssTle, getTle, searchSatellites } from "./getTle";

async function printNumber(num: number): Promise<void> {
  console.log("the number is ", num);
}

async function main() {
  console.log("operation started");
  console.time("operation");

  const isstle = await getIssTle();
  const csstle = await getCssTle();

  console.timeEnd("operation");
  console.log("operation completed");
}

main();
