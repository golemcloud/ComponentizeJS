import { strictEqual, ok } from 'node:assert';

export const source = `
  let val, err, done = false;
  export function run () {
    (async () => {
      // NOTE https://www.google.com fails with (new TypeError("malformed UTF-8 character sequence at offset 29381", "fetch.js", 15))
      const res = await fetch('https://google.com');
      return res.text();
    })().then(text => {
      console.log(text);
      done = true;
    }, err => {
      console.error(err);
      done = true;
    });
    runEventLoopUntilInterest();
  }
  export function ready () {
    return done;
  }
`;

export async function test(run) {
  const curNow = Date.now();
  const { stdout, stderr } = await run();
  console.log(stdout);
  ok(stdout.includes('google'));
  strictEqual(stderr, '');
}
