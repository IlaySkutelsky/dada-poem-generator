
async function getMivzakim() {
  let response = await fetch('/mivzak');
  let mivzak = await response.json()
  console.log(mivzak);
  let words = mivzak.text.split(" ")
  shuffleArray(words)
  console.log(words);
  let poemString = ''
  for (let i=0; i<words.length; i++) {
    poemString += words[i] + ' '
    if (Math.random() > 0.725) {
      poemString += '\n'
    }
  }
  let loaderElm = document.getElementById('loader')
  loaderElm.className += ' hidden'
  let poemElm = document.getElementById('poem')
  poemElm.innerText = poemString

  let linkElm = document.getElementById('link')
  linkElm.href = mivzak.url
  let footerElm = document.getElementById('footer')
  footerElm.className = ''
}

getMivzakim()

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
