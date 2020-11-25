
const axios = require('axios')
const cheerio = require('cheerio')

const mivzakimURL = "https://www.ynet.co.il/home/0,7340,L-184,00.html"
const firstMivzakSelector = "td.ghciMivzakimHeadlines1 table tbody tr:nth-child(2) a"
const mivzakHeaderSelector = "h1.art_header_title"
const mivzakBodySelector = "div.art_body div span p"

async function scrapMivzak() {
  let mivzakimResponse = await axios.get(mivzakimURL)
  let $ = cheerio.load(mivzakimResponse.data)
  let firstMivzak = $(firstMivzakSelector)
  let firstMivzakURL = "https://www.ynet.co.il/" + $(firstMivzak[0]).attr('href')
  let firstMivzakresponse = await axios.get(firstMivzakURL)
  // console.log("axios firstMivzakURL:");
  // console.log(firstMivzakURL);
  $ = cheerio.load(firstMivzakresponse.data)
  let mivzakHeaderText = $(mivzakHeaderSelector).contents().first().text();
  let mivzakBodyText = $(mivzakBodySelector).contents().first().text();
  let mivzakString = mivzakHeaderText + ' ' + mivzakBodyText
  // console.log("axios mivzakString:");
  // console.log(mivzakString);
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
