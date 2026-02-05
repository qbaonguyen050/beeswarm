const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Load the game
  await page.goto('file://' + path.join(__dirname, 'index.html'));

  // Wait for loading screen to disappear
  await page.waitForSelector('#loadingScreen', { state: 'hidden', timeout: 30000 });

  // Check if main menu buttons are present
  const playButton = await page.$('#mainPlay');
  const testButton = await page.$('#mainTest');
  const infoButton = await page.$('#mainInfo');

  console.log('Play button present:', !!playButton);
  console.log('Test button present:', !!testButton);
  console.log('Info button present:', !!infoButton);

  await page.screenshot({ path: '/home/jules/verification/main_menu_new.png' });

  if (testButton) {
    console.log('Clicking Test Mode button...');
    await testButton.click();

    // Wait for game UI
    await page.waitForSelector('#UIBar', { state: 'visible' });
    console.log('Game UI visible.');

    // Try to click a button in UIBar, e.g., inventoryButton
    const inventoryButton = await page.$('#inventoryButton');
    console.log('Inventory button present:', !!inventoryButton);

    if (inventoryButton) {
      console.log('Attempting to click Inventory button...');
      await inventoryButton.click();

      // Check if inventory page is visible
      const pages = await page.$$('.uiPage');
      const inventoryPage = pages[0];
      const isVisible = await inventoryPage.isVisible();
      console.log('Inventory page visible after click:', isVisible);
    }
  }

  await page.screenshot({ path: '/home/jules/verification/game_test_mode.png' });

  await browser.close();
})();
