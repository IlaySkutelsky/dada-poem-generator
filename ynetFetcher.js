
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
      browser = await puppeteer.launch({headless: true ,args: ['--no-sandbox'], dumpio: true})
    } else {
      // console.log("using existing browser");
      // console.log("clearing timer " + time);
      clearTimeout(closeBrowserTimeoutID)
    }
    console.log("going to page");
    const page = await browser.newPage()
    await page.goto(mivzakimURL, {timeout: 0})
    let firstMivzakArrow = await page.waitForSelector(firstMivzakArrowSelector)
    await firstMivzakArrow.evaluate(node => node.click())
    console.log("clicking on 1st mivzak");
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
