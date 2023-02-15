
const puppeteer = require('puppeteer');

const ynetURL = "https://www.ynet.co.il/home"
const mivzakimURL = "https://www.ynet.co.il/news/category/184"
const firstMivzakArrowSelector = ".article-flashes-page .Accordion .AccordionSection .arrow"
const firstMivzakBodySelector = ".article-flashes-page .Accordion .AccordionSection .itemBody"

let browser
let closeBrowserTimeoutID

async function scrapMivzak() {
  console.log("starting the scrape function");
  try {
    // let now = new Date(Date.now())
    // let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
    if (!browser) {
      // console.log("launching new browser");
      browser = await puppeteer.launch({
	headless: true ,
	args: [
		'--ignore-certificate-errors',
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-accelerated-2d-canvas',
		'--disable-gpu'
	], 
	dumpio: true
      })
    } else {
      // console.log("using existing browser");
      // console.log("clearing timer " + time);
      clearTimeout(closeBrowserTimeoutID)
    }
    console.log("creating incognito context");
    const context = await browser.createIncognitoBrowserContext();
    console.log("opening new page");
    const page = await context.newPage()
    console.log("setting up request interception");
    await page.setRequestInterception(true); // Optimize (no stylesheets, images)...
      page.on('request', request => {
        if (['image', 'stylesheet'].includes(request.resourceType())) {
          request.abort();
        } else {
          request.continue();
        }
      });
    console.log("going to ynet url");
    await page.goto(mivzakimURL, {waitUntil: 'domcontentloaded', timeout: 0})
    console.log("waiting for first mivzak arrow element");
    let firstMivzakArrow = await page.waitForSelector(firstMivzakArrowSelector)
    console.log("clicking on first mivzak arrow element");
    await firstMivzakArrow.evaluate(node => node.click())
    console.log("waiting for mivzak body");
    let firstMivzakBody = await page.waitForSelector(firstMivzakBodySelector)
    let mivzakObject = await firstMivzakBody.evaluate(function(node) {
      return {
        id: node.parentElement.id,
        text: node.innerText
      }
    })
    mivzakObject.text = mivzakObject.text.substr(0, mivzakObject.text.lastIndexOf("("));
    // console.log("setting timer " + time);
    closeBrowserTimeoutID = setTimeout(closeBrowser, 3*60*1000)
    page.close()
    return {
      text: mivzakObject.text,
      url: mivzakimURL+'#'+mivzakObject.id
    }
  }
  catch(e) {
    console.log('scrapMivzak error');
    console.log(e);
  }
};

function closeBrowser(print) {
    // console.log("closing browser");
    // console.log(print);
    browser.close();
    browser = null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

ynetFetcher = function() {
  this.fetchMivzak = async function(cb) {
    let mivzak = await scrapMivzak()
    cb(null, mivzak);
  };
};

exports.ynetFetcher = ynetFetcher;
