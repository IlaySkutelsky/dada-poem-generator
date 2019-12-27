let words
let newWords = []

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
    let word=words[i].text

    let classesStr = ''
    if (['ממשלה','ישראל','כנסת'].some(function(v) { return word.indexOf(v) >= 0; })) {
      classesStr = 'poop'
    }
    if (word.search(/\d/) !== -1) {
      classesStr = 'number'
    }
    poemString += `<span class="word ${classesStr} hidden-word" data-index="${i}" onmouseover="hoveredWord(this)">${word+' '}</span>`
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
  setTimeout(function () {
    appearifyWords()
  }, 100);
}

function formatWords(words) {
  let wordObjs = []
  for (var i = words.length - 1; i > 0; i--) {
    let idx = words[i].search(/[A-Z, a-z, א-ת, 0-9]/)
    if (idx < 0) continue
    let wordObj = {
      text: words[i],
    }
    wordObjs.push(wordObj)
  }
  return wordObjs
}

function randomizeWordAttribute() {
  for (var i=0; i < words.length; i++) {
    let word = words[i]
    word.scale = twoDigits(Math.random()*0.9 + 0.6)
    word.rotateZ = twoDigits(Math.random()*30 - 15)
    word.translateX = twoDigits(Math.random()*50 - 25)
    word.translateY = twoDigits(Math.random()*20 - 10)
    word.transition = twoDigits(Math.random() * 1100 + 100)
  }
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function createRandomStyle() {
  let sheet = document.getElementById('random-style')
  if (sheet) {
      sheet.innerHTML = ''
  } else {
    sheet = document.createElement('style')
    sheet.setAttribute('id', 'random-style')
  }
  let cssString = ''
  for (var i=0; i < words.length; i++) {
    cssString += `.word[data-index='${i}'] {
      transform: scale(${ words[i].scale })
                 rotateZ(${ words[i].rotateZ }deg)
                 translateX(${ words[i].translateX }px)
                 translateY(${ words[i].translateY }px) !important;
      transition: ${ words[i].transition }ms;
    }
    `
  }
  sheet.innerHTML = cssString;
  document.body.appendChild(sheet);
}

function appearifyWords() {
    let wordElms = document.getElementsByClassName("word")
    for (let i=0; i< wordElms.length ; i++) {
      setTimeout(function (elm) {
        elm.classList.remove("hidden-word");
      }, (Math.random()*20 + 40) * i, wordElms[i]);
    }
}

function hoveredWord(wordElm) {
  if (wordElm.classList.contains('hovered')) return
  wordElm.classList.add('hovered');
  newWords.push(words[wordElm.dataset.index])
  if (newWords.length === words.length) {
    // reset or something

    words = newWords
    newWords = []
    setTimeout(function () {
      renderWords(words)
    }, 200);
  } else {
    setTimeout(function () {
      randomizeWordAttribute()
      createRandomStyle()
    }, 100);
  }
}

function recursiveAnimateNumbers() {
  let numberElms = document.getElementsByClassName("number");
  for (var i = 0; i < numberElms.length; i++) {
    setTimeout(function (elm) {
      let digits = elm.innerText.match(/\d+/)[0].length
      elm.innerText = elm.innerText.replace(/\d+/, Math.floor(Math.random()*Math.pow(10, digits)+(10^(digits-1))))
    }, Math.floor(Math.random()*900+100), numberElms[i]);
  }
  setTimeout(function () {
    recursiveAnimateNumbers()
  }, 150);
}

async function run() {
  let result = await getMivzakim()
  words = await formatWords(result.words)
  // await cleanArray(words)
  randomizeWordAttribute()
  shuffleArray(words)
  console.log(words);
  renderWords(words)
  createRandomStyle()
  recursiveAnimateNumbers()
}

function twoDigits(num) {
  return Math.round(num * 100) / 100
}

run()
