const KEYBOARD_LAYOUT = [10, 9, 9]
let words = new Set()
let target = ''

loadWords().then((response) => {
    words = response
    target = randWord()
    if (words.has(target)) {
        target = randWord()
    }
})

async function loadWords() {
    const response = await fetch('txt/wordant.txt');
    return new Set((await response.text()).split('\n'));
}

function randWord() {
    let word = ''
    for (let i = 0; i < 5; i++) {
        word += String.fromCharCode(Math.random() * 26 + 97)
    }
    return word
}

function key(letter) {
    const guesses = document.getElementById('guesses')
    const guess = guesses.children[guesses.children.length - 1]
    const index = guess.innerText.indexOf('_')
    if (index != -1) {
        guess.innerText = guess.innerText.slice(0, index) + letter.toLowerCase() + '_'.repeat(4 - index)
    }
}

function enter() {
    const guesses = document.getElementById('guesses')
    const guess = guesses.children[guesses.children.length - 1]
    const submitted = guess.innerText
    if (!submitted.includes('_')) {
        if (words.has(submitted)) {
            guess.classList.add('bad')
        } else {
            let status = []
            let leftover = []
            for (let i = 0; i < 5; i++) {
                if (target[i] == submitted[i]) {
                    leftover.push('')
                    status.push('right')
                } else {
                    leftover.push(target[i])
                    status.push('wrong')
                }
            }
            for (let i = 0; i < 5; i++) {
                if (status[i] == 'wrong') {
                    let index = leftover.indexOf(submitted[i])
                    if (index != -1) {
                        leftover[index] = ''
                        status[i] = 'contains'
                    }
                }
            }
            guess.innerText = ''
            for (let i = 0; i < 5; i++) {
                guess.innerHTML += `<span class="${status[i]}">${submitted[i]}</span>`
            }
            newGuess = document.createElement('div')
            newGuess.className = 'guess'
            newGuess.innerText = '_____'
            document.getElementById('guesses').appendChild(newGuess)
            shuffleKeyboard()
        }
    }
}

function shuffleKeyboard() {
    let keys = 'abcdefghijklmnopqrstuvwxyz'.split('').concat(['enter', 'back'])
    let newHTML = ''
    for (let row = 0; row < KEYBOARD_LAYOUT.length; row++) {
        newHTML += '<div class="row">'
        for (let keyIndex = 0; keyIndex < KEYBOARD_LAYOUT[row]; keyIndex++) {
            const removeIndex = Math.floor(Math.random() * keys.length)
            const key = keys[removeIndex]
            keys.splice(removeIndex, 1)
            newHTML += '<div class="key" onclick="'
            if (key == 'enter') {
                newHTML += 'enter()'
            } else if (key == 'back') {
                newHTML += 'back()'
            } else {
                newHTML += `key('${key}')`
            }
            newHTML += `">&lt${key}&gt</div>`
        }
        newHTML += '</div>'
    }
    document.getElementById('keyboard').innerHTML = newHTML
}

function back() {
    const guesses = document.getElementById('guesses')
    const guess = guesses.children[guesses.children.length - 1]
    let index = guess.innerText.indexOf('_')
    if (index != 0) {
        if (index == -1) {
            index = 5
        }
        guess.innerText = guess.innerText.slice(0, index - 1) + '_'.repeat(6 - index)
    }
    guess.classList.remove('bad')
}
