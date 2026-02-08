const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('http://localhost:8000');

    // Click Test Mode
    await page.click('#mainTest');

    // Wait for game to initialize
    await page.waitForTimeout(3000);

    const testModeData = await page.evaluate(() => {
      if (!window.out) return { error: "window.out not defined" };
      return {
        testMode: window.out.testMode,
        honey: window.out.honey,
        allowed_35: window.out.restrictionInfo.allowed_35,
        itemCount: window.items.royalJelly.amount
      };
    });

    console.log('Test Mode Data:', JSON.stringify(testModeData, null, 2));

    if (testModeData.testMode === true &&
        testModeData.honey >= 1e17 &&
        testModeData.allowed_35 === true &&
        testModeData.itemCount >= 1e11) {
      console.log('VERIFICATION SUCCESSFUL');
    } else {
      console.log('VERIFICATION FAILED');
    }

    await browser.close();
  } catch (err) {
    console.error('ERROR:', err);
  }
})();
