export function getResult() {
  return testAndReturnOK(() => {
    let count = 20;
    let doneCounter = 0;

    function getAndAssert() {
      return asyncGetJson('https://jsonplaceholder.typicode.com/users/1')
        .then((result) => {
          // console.log(JSON.stringify(result, null, '  '));
          assert(result != null, 'result is not nullish');
          doneCounter++;
        });
    }

    let result = null;

    for (let i = 0; i < count; i++) {
      if (result == null) {
        result = getAndAssert();
      } else {
        result = result.then(() => {
          return getAndAssert();
        });
      }
    }

    asyncToSync(result);
    assert(doneCounter === count, 'doneCounter === count');
  });
}