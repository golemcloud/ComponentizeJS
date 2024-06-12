export function getResult() {
  return testPatch('https://jsonplaceholder.typicode.com/posts', {
    title: 'dummy-title',
    body: 'dummy-body',
    userId: 4
  });
}