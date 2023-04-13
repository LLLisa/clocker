const { JW_USERNAME, JW_PASSWORD } = require('./secrets');
const puppeteer = require('puppeteer');

const openBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: 'localCache',
  });
  const page = await browser.newPage();

  await page.goto('https://hours.justworks.com', {
    waitUntil: 'networkidle2',
  });

  const url1 = await page.url();
  console.log('URL1', url1);

  await page.on.load;

  const loginWJWButton = await page.$('.justworks-log-in-button');
  if (loginWJWButton) {
    await loginWJWButton.click();
  }

  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });

  const url2 = await page.url();
  console.log('URL2', url2);

  if (url2.includes('secure.justworks.com/login')) {
    //input username
    const usernameInput = await page.$('input[name="username"]');
    await usernameInput.click();
    await page.keyboard.type(JW_USERNAME);

    //imput password
    const passwordInput = await page.$('input[name="password"]');
    await passwordInput.click();
    await page.keyboard.type(JW_PASSWORD);

    //click submit button
    const submitButton = await page.$('.Button');
    await submitButton.click();
  }

  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });

  await page.screenshot({ path: 'page.png' });

  const url3 = await page.url();
  console.log('URL3', url3);

  // await browser.close();
};

openBrowser();
