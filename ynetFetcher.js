
const puppeteer = require('puppeteer');

const ynetURL = "https://www.ynet.co.il/home"
const mivzakimURL = "https://www.ynet.co.il/news/category/184"
const firstMivzakArrowSelector = ".article-flashes-page .Accordion .AccordionSection .arrow"
const firstMivzakBodySelector = ".article-flashes-page .Accordion .AccordionSection .itemBody"

async function scrapMivzak() {
  try {
    console.log(1);
    const browser = await puppeteer.launch({args: ['--no-sandbox']})
    const page = await browser.newPage()
    await page.goto(mivzakimURL, {timeout: 0})
    let firstMivzakArrow = await page.waitForSelector(firstMivzakArrowSelector)
    await firstMivzakArrow.evaluate(node => node.click())
    let firstMivzakBody = await page.waitForSelector(firstMivzakBodySelector)
    let mivzakObject = await firstMivzakBody.evaluate(function(node) {
      return {
        id: node.parentElement.id,
        text: node.innerText
      }
    })
    mivzakObject.text = mivzakObject.text.substr(0, mivzakObject.text.lastIndexOf("("));
    browser.close();
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
