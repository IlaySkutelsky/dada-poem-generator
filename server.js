const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const wallaFetcherService = require('./wallaFetcher').wallaFetcher;
const wallaFetcher = new wallaFetcherService();

app.get('/mivzak', function(req, res) {
  wallaFetcher.fetchMivzak(function(error, mivzak) {
    res.set('Cache-Control', 'no-store')
    res.send(mivzak);
  });
});

app.use(express.static('dist'))

app.listen(port, () => console.log(`Dada-poem-generator server listening on port ${port}!`))