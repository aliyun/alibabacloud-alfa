const { wrapCss } = require('../lib/wrapCss');
const path = require('path');

describe("test wrapcss", () => {
  test("wrapcss", () => {
    wrapCss(path.resolve(__dirname, './fixtures/'), 'test-1', {
      
    });
  })
});