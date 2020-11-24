
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

var YnetFetcher = require('./ynetFetcher').ynetFetcher;
var ynetFetcher = new YnetFetcher();

app.use(express.static('dist'))
app.use('original', express.static('dist/original'))

app.get('/mivzak', function(req, res) {
  ynetFetcher.fetchMivzak(function(error, mivzak) {
    res.set('Cache-Control', 'no-store')
    res.send(mivzak);
  });
});

app.listen(port, () => console.log(`Dada-poem-generator server listening on port ${port}!`))
// var url = `http://localhost:${port}`;
// var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
// require('child_process').exec(start + ' ' + url);