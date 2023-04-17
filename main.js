const { JW_USERNAME, JW_PASSWORD } = require('./secrets');
const puppeteer = require('puppeteer');

const openBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // devtools: true,
    userDataDir: 'localCache',
  });
  const page = await browser.newPage();

  await page.goto('https://hours.justworks.com', {
    waitUntil: 'networkidle2',
  });

  const url1 = await page.url();
  console.log('URL1', url1);

  await page.on.load;

  if (url1 === 'https://hours.justworks.com/sign_in') {
    const loginWJWButton = await page.$('.justworks-log-in-button');
    if (loginWJWButton) {
      await loginWJWButton.click();
    }

    await page.waitForNavigation({
      waitUntil: 'networkidle0',
    });
  }

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

    await page.waitForNavigation({
      waitUntil: 'networkidle0',
    });
  }

  const url3 = await page.url();
  console.log('URL3', url3);

  // await browser.close();
  // switch (process.env.MODE) {
  //   case CLOCK_IN:
  //     clockIn(page);
  //     break;

  //   default:
  //     break;
  // }
  clockIn(page);
};

openBrowser();

const clockIn = async (page) => {
  const newShiftButton = await page.$('.btn');
  await newShiftButton.click();

  const locationSelect = await page.waitForSelector('.form-control');
  await locationSelect.click();

  const option = (
    await page.$x(
      '/html/body/div[8]/div[2]/div/div/div[2]/form/div[1]/div/div/select/option[4]'
    )
  )[0];
  const value = await (await option.getProperty('value')).jsonValue();
  await page.select('.form-control', value);

  const startButton = await page.$('a.btn-primary:nth-child(1)');
  // await startButton.click();

  console.log('here');
};
