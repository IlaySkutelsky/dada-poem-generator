let words
let hoveredWords = 0

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

    let classesStr = ''
    if (['ממשלה','ישראל','כנסת'].some(function(v) { return word.indexOf(v) >= 0; })) {
      classesStr = ' poop'
    }
    if (word.search(/\d/) !== -1) {
      console.log('word: ' + word + ' has a number');
    }
    poemString += `<span class="word word${i}${classesStr}" onmouseover="hoveredWord(this)">${word+' '}</span>`
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
  return Promise.resolve()
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
    cssString += `.word${i} {
      transform: scale(${ twoDigits(Math.random()*0.9 + 0.6) })
                 rotateZ(${ twoDigits(Math.random()*30 - 15) }deg)
                 translateX(${ twoDigits(Math.random()*50 - 25) }px)
                 translateY(${ twoDigits(Math.random()*20 - 10) }px) !important;
      transition: ${ twoDigits(Math.random() * 1100 + 100) }ms;
    }
    `
  }
  sheet.innerHTML = cssString;
  document.body.appendChild(sheet);
}

// function resetStyle() {
//   console.log('called reset styele');
//   let sheet = document.getElementById('random-style')
//   if (sheet) {
//       sheet.innerHTML = ''
//   } else {
//     sheet = document.createElement('style')
//     sheet.setAttribute('id', 'random-style')
//   }
//   let cssString = ` .word {
//       transform: scale(1);
//       opacity: 1 !important;
//       top: 0 !important;
//   }
//
//   `
//   sheet.innerHTML = cssString;
//   document.body.appendChild(sheet);
//
//   setTimeout(function () {
//     createRandomStyle()
//   }, 100);
// }

function hoveredWord(wordElm) {
  if (wordElm.className.includes('hovered')) return
  wordElm.className += ' hovered';
  hoveredWords++
  if (hoveredWords === words.length) {
    // setTimeout(function () {
    //   resetStyle()
    // }, 300);
  } else {
    setTimeout(function () {
      createRandomStyle()
    }, 100);
  }
}

async function run() {
  let result = await getMivzakim()
  words = result.words
  await cleanArray(words)
  await shuffleArray(words)
  console.log(words);
  await renderWords(words)
  await createRandomStyle()
}

function twoDigits(num) {
  return Math.round(num * 100) / 100
}

run()
