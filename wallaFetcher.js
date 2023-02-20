const xml2js = require('xml2js');
const fetch = require('node-fetch');

async function scrapMivzak() {
    const parser = new xml2js.Parser();
    return fetch("https://rss.walla.co.il/feed/22")
        .then(response => response.text())
        .then(str => parser.parseStringPromise(str))
        .then(function(data) {
          let mivzak = data.rss.channel[0].item[0]
          let text = mivzak.description[0].replace(/<[^>]*>/g, '')
          text += mivzak.title
          return {
            url: mivzak.link[0], 
            text 
          }
        });
}

wallaFetcher = function() {
  this.fetchMivzak = async function(cb) {
    let mivzak = await scrapMivzak()
    cb(null, mivzak);
  };
};

exports.wallaFetcher = wallaFetcher;
