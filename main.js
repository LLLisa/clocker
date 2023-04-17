const { JW_USERNAME, JW_PASSWORD } = require('./secrets');
const puppeteer = require('puppeteer');

const openBrowser = async (hasCredentials = true) => {
  const browser = await puppeteer.launch({
    headless: hasCredentials,
    // devtools: true,
    userDataDir: 'localCache',
  });
  const page = await browser.newPage();

  await page.goto('https://hours.justworks.com', {
    waitUntil: 'networkidle2',
  });

  const url1 = page.url();

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

  const url2 = page.url();

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

  //restarts in non-headless mode if mfa creds are expired
  const url3 = page.url();
  if (url3.includes('secure.justworks.com/tfa')) {
    if (hasCredentials === true) {
      await browser.close();
      openBrowser(false);
    } else {
      const response = await page.waitForResponse(
        'https://hours.justworks.com/dashboard/open_shifts',
        { timeout: 0 }
      );
      if (response.ok()) {
        await browser.close();
        openBrowser(true);
      }
    }
  }

  const modes = {
    CLOCK_IN: 'CLOCK_IN',
    START_BREAK: 'START_BREAK',
    END_BREAK: 'END_BREAK',
    CLOCK_OUT: 'CLOCK_OUT',
  };

  switch (process.env.MODE) {
    case modes.CLOCK_IN:
      await clockIn(page);
      await browser.close();
      break;
    case modes.START_BREAK:
      await startBreak(page);
      await browser.close();
      break;
    case modes.END_BREAK:
      await endBreak(page);
      await browser.close();
      break;
    case modes.CLOCK_OUT:
      await clockOut(page);
      await browser.close();
      break;
    default:
      console.log('NO CLOCK MODE SPECIFIED');
      await browser.close();
      break;
  }
};

const clockIn = async (page) => {
  const firstRow = await page.$('.date');
  if (firstRow) {
    console.log('---Already clocked into a shift---');
    return;
  }

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

  const clockInButton = await page.$('a.btn-primary:nth-child(1)');
  await clockInButton.click();
};

const startBreak = async (page) => {
  const firstRow = await page.$('.date');
  if (!firstRow) {
    console.log('---Not yet clocked into a shift---');
    return;
  }
  await firstRow.click();

  const startBreakButton = await page.waitForSelector(
    'a.btn-primary:nth-child(1)'
  );

  await startBreakButton.hover();
  await startBreakButton.click();
};

const endBreak = async (page) => {
  const firstRow = await page.$('.date');
  if (!firstRow) {
    console.log('---Not yet clocked into a shift---');
    return;
  }
  await firstRow.click();

  const endBreakButton = await page.waitForSelector(
    'div.col-sm-9:nth-child(1) > a:nth-child(1)'
  );
  await endBreakButton.hover();
  await endBreakButton.click();
};

const clockOut = async (page) => {
  const firstRow = await page.$('.date');
  if (!firstRow) {
    console.log('---Not yet clocked into a shift---');
    return;
  }
  await firstRow.click();

  const clockOutButton = await page.waitForSelector(
    'a.btn-danger:nth-child(2)'
  );
  await clockOutButton.hover();
  await clockOutButton.click();
};

openBrowser();
