const { reloadApp } = require('detox-expo-helpers');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Example', () => {
  beforeEach(async () => {
    await reloadApp({
      permissions: {
        notifications: 'YES',
      }
    });
    await timeout(10000);
  });

  it('HomeTest', async () => {
    await expect(element(by.id('Home'))).toBeVisible();
  });
});
