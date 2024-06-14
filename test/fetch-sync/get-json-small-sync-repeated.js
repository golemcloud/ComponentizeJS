export function getResult() {
  return testAndReturnOK(() => {
    for (let i = 0; i < 100; i++) {
      // console.log(`repeat: ${i}`);
      testGetJsonArray("https://jsonplaceholder.typicode.com/users", 10);
    }
  });
}