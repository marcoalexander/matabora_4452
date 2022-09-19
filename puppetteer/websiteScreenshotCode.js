const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const prompt = require('prompt-sync')();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const name = prompt('What is your website name?');
  if (name.startsWith("www.") && name.endsWith(".com")) {
  try{
    await page.goto('https://' + name, {waitUntil: 'networkidle2'});
    await page.screenshot({path: 'example.png'});
  }catch(error){
    console.log("Site cannot be visited for screenshot");
    console.log(error);
  }
  }else{
    console.log("invalid website")
  }

  await browser.close();
})();