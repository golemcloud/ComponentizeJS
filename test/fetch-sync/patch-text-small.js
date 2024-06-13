export function getResult() {
  return testPatchText('https://jsonplaceholder.typicode.com/posts', {
    title: 'dummy-title ŰÁÉŐÚŐ',
    body: 'dummy-body',
    userId: 4
  });
}