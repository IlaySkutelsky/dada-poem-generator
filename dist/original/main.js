
async function getMivzakim() {
  let response = await fetch('/mivzak');
  let mivzak = await response.json()
  console.log(mivzak);
  let words = mivzak.text.split(" ")
  return { words:words, url:mivzak.url }
}

function renderWords(words, url) {
  let poemString = ''
  for (let i=0; i<words.length; i++) {
    let word=words[i]
    if (word === '') continue

    let classesStr = ''
    if (['ממשלה','ישראל','כנסת'].some(function(v) { return word.indexOf(v) >= 0; })) {
      classesStr = ' poop'
    }
    if (word.search(/\d/) !== -1) {
      console.log('word: ' + word + ' has a number');
    }
    poemString += `<span >${word+' '}</span>`
    if (Math.random() > 0.725) {
      poemString += '\n'
    }
  }

  let loaderElm = document.getElementById('loader')
  loaderElm.className += ' hidden'
  let poemElm = document.getElementById('poem')
  poemElm.innerHTML = poemString

  let linkElm = document.getElementById('link')
  linkElm.href = url
  let footerElm = document.getElementById('footer')
  footerElm.className = ''
  return Promise.resolve();
}

function cleanArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    let idx = array[i].search(/[A-Z, a-z, א-ת, 0-9]/)
    if (idx < 0) {
      array.splice(i, 1)
    }
  }
  return Promise.resolve()
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

async function run() {
  let result = await getMivzakim()
  let words = result.words
  await cleanArray(words)
  await shuffleArray(result.words, result.url)
  console.log(words);
  await renderWords(words)
}

function twoDigits(num) {
  return Math.round(num * 100) / 100
}

run()
