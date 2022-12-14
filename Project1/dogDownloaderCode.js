/*
current state: occasional problems with GIFS and 100% errors with mp4 files in which it is possible that 
puppetteer will not let me download anything greater than 10mb. need professors help.
Here is the Error for gifs: could it be too large?
ProtocolError: Protocol error (Network.getResponseBody): Request content was evicted from inspector cache
    at C:\Users\marco\node_modules\puppeteer\lib\cjs\puppeteer\common\Connection.js:298:24
    at new Promise (<anonymous>)
    at CDPSession.send (C:\Users\marco\node_modules\puppeteer\lib\cjs\puppeteer\common\Connection.js:294:16)
    at C:\Users\marco\node_modules\puppeteer\lib\cjs\puppeteer\common\HTTPResponse.js:140:100
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async C:\Users\marco\workspace\matabora_4452\puppetteer\dogDownloaderCode.js:15:52 {
  originalMessage: 'Request content was evicted from inspector cache'


the error of mp4's is that the code will capture the video URL however when i try to visit the video url
to download it, the page displays a video player but it is blank. Could the video be too large?
*/
const puppeteer = require('puppeteer');
const fsp = require('fs/promises');
const fs = require('fs');
const https = require('https');

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
});
} catch (error) {
  
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
})();