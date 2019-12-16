
const express = require('express')
const app = express()
const port = 3000

var YnetFetcher = require('./ynetFetcher').ynetFetcher;
var ynetFetcher = new YnetFetcher();

app.use(express.static('dist'))

app.get('/mivzak', function(req, res) {
  ynetFetcher.fetchMivzak(function(error, mivzak) {
    res.send(mivzak);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
