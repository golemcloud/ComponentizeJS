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
    // console.log(`result json size: ${JSON.stringify(result).length}`);
  });
}

function testGetTextArray(url, length) {
  return testAndReturnOK(() => {
    let textResult = syncGetText(url);
    let result = JSON.parse(textResult);
    assert(result != null, 'result is not nullish');
    assert(result['length'] === length, `length == ${length}`);
    // console.log(`result text size: ${result.length}`);
  });
}

function testPatchJson(url, body) {
  return testAndReturnOK(() => {
    let result = syncPatchJson(url, body);
    for (let key of Object.keys(body)) {
      assert(result[key] != null, `result[${key}] is not nullish`);
      assert(result[key] === body[key], `result[${key}]: ${result[key]}, body[${key}]: ${body[key]}`);
    }
  });
}

function testPatchText(url, body) {
  return testAndReturnOK(() => {
    let textResult = syncPatchText(url, body);
    let result = JSON.parse(textResult);
    for (let key of Object.keys(body)) {
      assert(result[key] != null, `result[${key}] is not nullish`);
      assert(result[key] === body[key], `result[${key}]: ${result[key]}, body[${key}]: ${body[key]}`);
    }
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

async function asyncPatchJson(url, body) {
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(body)
  });
  return response.json();
}

function syncPatchJson(url, body) {
  return asyncToSync(asyncPatchJson(url, body));
}

async function asyncPatchText(url, body) {
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(body)
  });
  return response.text();
}

function syncPatchText(url, body) {
  return asyncToSync(asyncPatchText(url, body));
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