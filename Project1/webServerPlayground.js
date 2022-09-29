'use strict';

const express = require('express');
const puppeteer = require('puppeteer');
const path = require('node:path');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const IMAGE_PATH = 'images';
const min = 100000;
const max = 999999;


// App
const app = express();
// Regular expressions can be used to declare accepted routes in ExpressJS
// Further reading source: https://expressjs.com/en/guide/routing.html
app.get('/www.*', (req, res) => {
  var site = req.url.substring(1);
  console.log('User requested the following website screenshot: ' + site);
  site = 'http://' + site;
  const timestamp = Date.now();
  // credits: https://stackoverflow.com/a/2175532
  const random = Math.floor(Math.random() * (max - min + 1)) + min; 
  const fname = timestamp + "_" + random + ".png";
  const fpath = path.join(IMAGE_PATH, fname);
  console.log('Sshot in the file: ' + fpath);

  (async () => {
  //const browser = await puppeteer.launch();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // If below waitunitl is not added, then the code might take screenshot even before all resources load
  // networkidle2 is heuristic that "thinks" site is loaded if no more than 2 requests happen in 500 ms;
  // motivating example: see LinkedIn's network traffic recently!! (they have some tracking code that keeps polling)
  // Relevant source: https://blog.cloudlayer.io/puppeteer-waituntil-options/
  await page.goto(site, {waitUntil: 'networkidle2'}); 
  await page.screenshot({path: fpath});
  await browser.close();
  //sendFile() needs absolute path which resolve provides....
  await res.sendFile(path.resolve(fpath));
  })();

});

app.get('/kitty', (req, res) => {
  console.log('User requested a cat image');

  const site = 'https://genrandom.com/cats/';
  const timestamp = Date.now();
  // credits: https://stackoverflow.com/a/2175532
  const random = Math.floor(Math.random() * (max - min + 1)) + min; 
  const fname = timestamp + "_" + random + ".png";
  const fpath = path.join(IMAGE_PATH, fname);
  console.log('Sshot in the file: ' + fpath);

  (async () => {
  //const browser = await puppeteer.launch();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // If below waitunitl is not added, then the code might take screenshot even before all resources load
  // networkidle2 is heuristic that "thinks" site is loaded if no more than 2 requests happen in 500 ms;
  // motivating example: see LinkedIn's network traffic recently!! (they have some tracking code that keeps polling)
  // Relevant source: https://blog.cloudlayer.io/puppeteer-waituntil-options/
  //await console.log('going to the page');
  await page.goto(site, {waitUntil: 'networkidle2'}); 
  //await console.log('went to the site');

  // Credits: https://www.testim.io/blog/puppeteer-screenshot/
  await page.waitForSelector('#gatsby-focus-wrapper > div > div > div > div > div > div > div > div > img');
  const image =  await page.$('#gatsby-focus-wrapper > div > div > div > div > div > div > div > div > img');
  await image.screenshot({path: fpath});
  await browser.close();
  //sendFile() needs absolute path which resolve provides....
  await res.sendFile(path.resolve(fpath));
  })();

});

app.get('/puppy', (req, res) => {
  console.log('User requested a dog image');

  const site = 'https://random.dog/';
  const timestamp = Date.now();
  // credits: https://stackoverflow.com/a/2175532
  const random = Math.floor(Math.random() * (max - min + 1)) + min; 
  const fname = timestamp + "_" + random + ".png";
  const fpath = path.join(IMAGE_PATH, fname);
  console.log('Sshot in the file: ' + fpath);
   
  // My cat code failed for the dog site (by giving me blank images;) So, I searched around and found the 
  // following solution: https://petertran.com.au/2018/07/12/blank-images-puppeteer-screenshots-solved/
  const defaultViewport = {
    height: 1920,
    width: 1280
  };
  
  (async () => {
  //const browser = await puppeteer.launch();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // If below waitunitl is not added, then the code might take screenshot even before all resources load
  // networkidle2 is heuristic that "thinks" site is loaded if no more than 2 requests happen in 500 ms;
  // motivating example: see LinkedIn's network traffic recently!! (they have some tracking code that keeps polling)
  // Relevant source: https://blog.cloudlayer.io/puppeteer-waituntil-options/
  //await console.log('going to the page');
  await page.goto(site, {waitUntil: 'networkidle2'}); 
  //await console.log('went to the site');

  // Credits: https://www.testim.io/blog/puppeteer-screenshot/
  // Note that this selector approach works regardless of what format the images are in!
  await page.waitForSelector('#dog-img');

  // Resize the viewport to screenshot elements outside of the viewport
  const bodyHandle = await page.$('body');
  const boundingBox = await bodyHandle.boundingBox();
  const newViewport = {
    width: Math.max(defaultViewport.width, Math.ceil(boundingBox.width)),
    height: Math.max(defaultViewport.height, Math.ceil(boundingBox.height)),
  };
  await page.setViewport(Object.assign({}, defaultViewport, newViewport));


  const image =  await page.$('#dog-img');
  await image.screenshot({path: fpath});
  await browser.close();
  //sendFile() needs absolute path which resolve provides....
  await res.sendFile(path.resolve(fpath));
  })();
});

app.all(/.*/, (req, res) => {
  console.log('User made an error request: ' + req.url);
  res.send('Hola error');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);