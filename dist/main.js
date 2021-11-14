let words
let newWords = []
let currMivzakURL
let bodyLoaded = false

async function run(result) {
  if (!result) result = await getMivzakim()
  currMivzakURL = result.url
  words = await formatWords(result.text)
  randomizeWordAttribute()
  shuffleArray(words)
  console.log(words);
  await waitForBodyToLoad()
  checkIfRandomStyleIsOn()
  renderWords(words, result.url)
  createRandomStyle()
  recursiveAnimateNumbers()
}

function handleBodyLoaded() {bodyLoaded=true}

function waitForBodyToLoad() {
  return new Promise((resolve, reject)=>{
    function checkIfBodyLoaded() {
      if (bodyLoaded) resolve()
      else {
        setTimeout(checkIfBodyLoaded, 150)
      }
    }
    checkIfBodyLoaded()
  })
}

async function getMivzakim() {
  let response = await fetch('/mivzak');
  let mivzak = await response.json()
  console.log(mivzak);
  return { text:mivzak.text, url:mivzak.url }
}

function formatWords(mivzakText) {
  let words = mivzakText.split(" ")
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
    word.hue = Math.floor(Math.random()*360)
    word.lum = Math.floor(Math.random()*24)
  }
}

function renderWords(words, url) {
  let poemString = ''
  for (let i=0; i<words.length; i++) {
    let word=words[i].text
    let styleStr = ''

    let classesStr = ''
    if (['ממשלה','ישראל','כנסת'].some(function(v) { return word.indexOf(v) >= 0; })) {
      classesStr = 'poop'
    }
    if (word.search(/\d/) !== -1) {
      let amountOfDigits = word.match(/\d/g).length
      classesStr = 'number'
      let minWidth = Math.pow(word.length-amountOfDigits, 0.5) + Math.pow(amountOfDigits, 0.75) + word.length*0.1
      styleStr = `style="min-width: ${twoDigits(minWidth)}em"`
    }
    poemString += `<span class="word ${classesStr} hidden-word"
                         data-index="${i}"
                         ${styleStr}
                         onmouseover="hoveredWord(this)">${word+' '}</span>`
    if (Math.random() > 0.725) {
      poemString += '\n'
    }
  }

  hideElement('loader')
  let poemElm = document.getElementById('poem')
  poemElm.innerHTML = poemString

  if (url) {
    let linkElm = document.getElementById('link')
    linkElm.href = url
    showElement('footer')
  }

  setTimeout(function () {
    appearifyWords()
  }, 100);
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
    cssString += `#poem.with-random-style .word[data-index='${i}'] {
      color: hsl(${ words[i].hue}, 100%, ${words[i].lum}%);
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
      }, (Math.random()*20 + 50) * i, wordElms[i]);
    }
}

function recursiveAnimateNumbers() {
  let numberElms = document.getElementsByClassName("number");
  for (var i = 0; i < numberElms.length; i++) {
    setTimeout(function (elm) {
      let digitsList = elm.innerText.match(/\d+/g)
      let digits = elm.innerText.match(/\d+/g)[0].length
      elm.innerText = elm.innerText.replaceAll(/\d+/g, (number) => {
        let len = number.toString().length
        return Math.floor(Math.pow(10, len-1) + Math.random()*9*Math.pow(10, len-1))
      })
    }, Math.floor(Math.random()*1200+100), numberElms[i]);
  }
  setTimeout(function () {
    recursiveAnimateNumbers()
  }, 150);
}

// ----------- User Interactions -----------

async function hoveredWord(wordElm) {
  if (wordElm.classList.contains('hovered')) return
  wordElm.classList.add('hovered');
  newWords.push(words[wordElm.dataset.index])
  if (newWords.length === words.length) {
    words = newWords
    newWords = []
    if (Math.random()>0.725) {
      setTimeout(function () {
        hideElement('poem')
        showElement('loader')
      }, 1000)
      let result = await getMivzakim()
      hideElement('loader')
      showElement('poem')
      if (result.url != currMivzakURL) {
        run(result)
      } else {
        renderWords(words)
      }
    } else {
      setTimeout(function () {
        renderWords(words)
      }, 1000);
    }
  } else {
    setTimeout(function () {
      randomizeWordAttribute()
      createRandomStyle()
    }, 100);
  }
}

function toggleSettingsMenu(e) {
  e.stopPropagation()
  let menuElm = document.querySelector(".settings-menu")
  let menuIsHidden = menuElm.classList.toggle("hidden")
  document.body.onclick = ()=>{
    hideElement(".settings-menu")
    document.body.onclick = null;
  }
}

function changedRandomStyle(e) {
  let randomStyleCheckbox = document.querySelector(".settings-menu input")
  let isChecked = randomStyleCheckbox.checked
  let poemElm = document.querySelector('poem')
  poemElm.classList.toggle('with-random-style', isChecked)
  if (e) e.stopPropagation()
}

function checkIfRandomStyleIsOn() {
  let randomStyleCheckbox = document.querySelector(".settings-menu input")
  if (randomStyleCheckbox.checked) changedRandomStyle()
}

// ----------- Utilities -----------

function hideElement(selector) {
  let elm = document.getElementById(selector)
  elm.classList.add('hidden')
}

function showElement(selector) {
  let elm = document.getElementById(selector)
  elm.classList.remove('hidden')
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function twoDigits(num) {
  return Math.round(num * 100) / 100
}


run()
