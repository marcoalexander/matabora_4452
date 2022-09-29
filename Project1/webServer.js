/*
Welcome to my first node js program! this program uses node js and puppeteer to scrape images from a given website,
and will display it to the local server created.
*/
//here im creating all of my objects
const http = require('http');
const puppeteer = require('puppeteer');
const fsp = require('fs/promises');
const fs = require('fs');
const https = require('https');
const prompt = require('prompt-sync')();

//some technical stuff for the server portion of the project
const hostname = '127.0.0.1'
const port = 8055
//server creation
const server = http.createServer((req, res) => {
  //using if statements to control the url input
  if (req.url === '/kitty') {
    //if kitty, website will be scraped of jpg image, saved, then displayed onto server.
    (async () => {
  const browser = await puppeteer.launch({headless: false, slowMo: 150,});
  const page = await browser.newPage();
  await page.goto('https://genrandom.com/cats/', {waitUntil: 'networkidle2'});
  //using img as a selector works, but just in case i also used document.querySelector('div[class="css-14qatfq-stack css-3mf84h"] > img') within dev tools in order to find the img
  const imageURL = await page.$eval("img", img => img.src);

  console.log(imageURL);

  const imagePage = await page.goto(imageURL);
  await fsp.writeFile("cat.jpg", await imagePage.buffer());

  await browser.close();

})();
  setTimeout(() => {const readStream = fs.createReadStream('./cat.jpg');
  res.writeHead(200, {'Content-type': 'image/jpg'});
  readStream.pipe(res);}, 5000);

  

  }
  //if puppy
  if (req.url === '/puppy') {
    var imageBool = true;
    //start of webscrape puppy
    (async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://random.dog', {waitUntil: 'networkidle2'});

  try {
    //using img as a selector works, but just in case i also used document.querySelector('div[class="css-14qatfq-stack css-3mf84h"] > img') within dev tools in order to find the img
    const imageURL = await page.$eval("img", img => img.src);

    const file = fs.createWriteStream(imageURL.split("/").pop());
    const request = https.get(imageURL, function(response) {
      response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log(" image Download Completed");
   });
   imageBool = true;
   console.log('imagebool has been set to:' + imageBool);
});
} catch (error) {
    imageBool = false;
    console.log('imagebool has been set to:' + imageBool);
    const videoURL = await page.$eval("source", source => source.src);

    const file = fs.createWriteStream(videoURL.split("/").pop());
    const request = https.get(videoURL, function(response) {
      response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log(" video Download Completed");
   });
});

}

  await browser.close();
})();//end of webscrape puppy
console.log('boolean check after webscrape, trying to display image: imagebool has been set to:' + imageBool);
  if (imageBool) {setTimeout(() => {const readStream = fs.createReadStream('./' + imageURL.split("/").pop());
  res.writeHead(200, {'Content-type': 'image'});
  readStream.pipe(res);}, 7000);
  }else{
    setTimeout(() => {const readStream = fs.createReadStream('./' + videoURL.split("/").pop());
  res.writeHead(200, {'Content-type': 'video/mp4'});
  readStream.pipe(res);}, 7000);
  }
  
  }//end of puppy url


  //if anything else
  if (req.url === 'www') {
    
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})