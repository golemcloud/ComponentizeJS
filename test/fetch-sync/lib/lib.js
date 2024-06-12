function assert(cond, msg) {
  if (!cond) {
    throw new Error('assert: ' + msg);
  }
}

function testAndReturnOK(f) {
  try {
    f();
  } catch (e) {
    console.error(e);
    return e.toString();
  }
  return 'ok';
}

function testGetJsonArray(url, length) {
  return testAndReturnOK(() => {
    let result = syncGetJson(url);
    assert(result != null, 'result is not nullish');
    assert(result['length'] === length, `length == ${length}`);
    console.log(`result json size: ${JSON.stringify(result).length}`);
  });
}

function testGetTextArray(url, length) {
  return testAndReturnOK(() => {
    let textResult = syncGetText(url);
    let result = JSON.parse(textResult);
    assert(result != null, 'result is not nullish');
    assert(result['length'] === length, `length == ${length}`);
    console.log(`result text size: ${result.length}`);
  });
}

async function asyncGetJson(url) {
  let response = await fetch(url);
  return response.json();
}

function syncGetJson(url) {
  return asyncToSync(asyncGetJson(url));
}

async function asyncGetText(url) {
  let response = await fetch(url);
  return response.text();
}

function syncGetText(url) {
  return asyncToSync(asyncGetText(url));
}

function asyncToSync(promise) {
  let success = false;
  let done = false;
  let result;
  let error;

  promise
    .then(r => {
      result = r;
      success = true;
      done = true;
    })
    .catch(e => {
      error = e;
      done = true;
    });

  runEventLoopUntilInterest();

  if (!done) {
    let error = new Error('asyncToSync: illegal state: not done');
    console.error(error);
    throw error;
  }

  if (!success) {
    console.error('asyncToSync: error: {}', error);
    throw error;
  }

  return result;
}