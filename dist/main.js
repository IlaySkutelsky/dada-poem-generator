let words
let newWords = []
let currMivzakURL
let bodyLoaded = false
let isForDisplay

function checkIfForDisplay() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  isForDisplay = urlParams.has('for-display');
}
checkIfForDisplay()

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
  pickTitle()
  // recursiveAnimateNumbers()
  recursiveCheckForNewMivzak()
}

async function recursiveCheckForNewMivzak() {
  console.log("checking for new mivzak")
  result = await getMivzakim()
  if (currMivzakURL !== result.url) {
    console.log("new mivzak found")
    let poemElm = document.getElementById('poem')
    poemElm.innerHTML = ''
    hideElement('footer')
    showElement('loader')
    let randomWaitTime = Math.random()*2000+2000
    await sleep(randomWaitTime)
    run(result)
  } else {
    console.log("old mivzak found")
    setTimeout(recursiveCheckForNewMivzak, 60*1000);
  }
}

function handleBodyLoaded() {
  bodyLoaded=true
  if (isForDisplay) document.body.classList.add("for-display")
}

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
      // let minWidth = Math.pow(word.length-amountOfDigits, 0.5) + Math.pow(amountOfDigits, 0.75) + word.length*0.1
      // styleStr = `style="min-width: ${twoDigits(minWidth)}em"`
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
    if (!isForDisplay) showElement('footer')
  }

  setTimeout(function () {
    appearifyWords()
  }, 100);
}

function pickTitle() {
  console.log(1);
  let poem = document.querySelector('#poem').innerText
  let lines = poem.split('\n').map(line => line.trim())
  console.log(lines);
  let title = ''
  findTitleBlock: {
    if (lines[0].split(' ').length == 4) title = lines[0]
    else if (lines[0].split(' ').length == 3) title = lines[0]
    else {
      console.log(2);
      if (lines[lines.length-1].split(' ').length == 4) title = lines[lines.length-1]
      else {
        console.log(3);
        for (let i= 0; i< lines.length; i++) {
          let line = lines[i];
          let chunks = line.split(/[,\.]/g)
          for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];
            if (chunk.split(' ').length == 3) {
              title = chunk
              break findTitleBlock
            }
          }
        }
        console.log(4);
        for (let i= 0; i< lines.length; i++) {
          let line = lines[i];
          let chunks = line.split(/[,\.]/g)
          for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];
            if (chunk.split(' ').length == 4) {
              title = chunk
              break findTitleBlock
            }
          }
        }
        console.log(5);
        for (let i= 0; i< lines.length; i++) {
          let line = lines[i];
          let chunks = line.split(/[,\.]/g)
          for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];
            if (chunk.split(' ').length == 2) {
              title = chunk
              break findTitleBlock
            }
          }
        }
        console.log(6);
        for (let i= 0; i< lines.length-1; i++) {
          let joinedLine = lines[i]+lines[i+1];
          if (joinedLine.split(' ').length == 4) {
            title = joinedLine
            break findTitleBlock
          }
        }
        console.log(7);
        title = lines[0]
      }
    }
  }
  console.log(8);
  document.querySelector('h1').innerText = title
  console.log(title)
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
  if (isForDisplay || wordElm.classList.contains('hovered')) return
  wordElm.classList.add('hovered');
  newWords.push(words[wordElm.dataset.index])
  if (newWords.length === words.length) {
    words = newWords
    newWords = []
    setTimeout(function () {
      renderWords(words)
    }, 1000);
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
  let poemElm = document.querySelector('#poem')
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

run()
