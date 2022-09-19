const puppeteer = require('puppeteer');
const fs = require('fs/promises');

(async () => {
  const browser = await puppeteer.launch({headless: false, slowMo: 150,});
  const page = await browser.newPage();
  await page.goto('https://genrandom.com/cats/', {waitUntil: 'networkidle2'});
  //using img as a selector works, but just in case i also used document.querySelector('div[class="css-14qatfq-stack css-3mf84h"] > img') within dev tools in order to find the img
  const imageURL = await page.$eval("img", img => img.src);

  console.log(imageURL);

  const imagePage = await page.goto(imageURL);
  await fs.writeFile("cat.jpg", await imagePage.buffer());

  await browser.close();
})();