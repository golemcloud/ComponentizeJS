export function getResult() {
  return testAndReturnOK(() => {
    let text = syncGetText("https://google.com");
    // console.log(text);
    assert(text.includes("google"), "includes google");
  });
}