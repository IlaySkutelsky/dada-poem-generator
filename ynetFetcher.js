
const axios = require('axios')
const cheerio = require('cheerio')

const mivzakimURL = "https://www.ynet.co.il/news/category/184"
const firstMivzakSelector = ".slotContentDiv .slotsContent .slotList .slotView:nth-child(1) a"
const mivzakHeaderSelector = "h1.mainTitle"
const mivzakBodySelector = ".textEditor_container span[data-text=true]"

async function scrapMivzak() {
  let mivzakimResponse = await axios.get(mivzakimURL)
  let $ = cheerio.load(mivzakimResponse.data)
  let firstMivzak = $(firstMivzakSelector)
  let firstMivzakURL = $(firstMivzak[0]).attr('href')
  let firstMivzakresponse = await axios.get(firstMivzakURL)
  $ = cheerio.load(firstMivzakresponse.data)
  let mivzakHeaderText = $(mivzakHeaderSelector).contents().first().text();
  let mivzakBodyText = $(mivzakBodySelector).contents().first().text();
  let mivzakString = mivzakHeaderText + ' ' + mivzakBodyText
  return {
    text: mivzakString,
    url: firstMivzakURL
  }
};

ynetFetcher = function() {
  this.fetchMivzak = async function(cb) {
    let mivzak = await scrapMivzak()
    cb(null, mivzak);
  };
};

exports.ynetFetcher = ynetFetcher;
