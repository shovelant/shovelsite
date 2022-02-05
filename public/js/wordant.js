const KEYBOARD_LAYOUT = [10, 9, 9]
let won = false
let words
let target

loadWords().then((response) => {
    words = new Set(response)
    target = response[Math.floor(Math.random() * response.length)]
})

document.addEventListener('keyup', (event) => {
    let keyPressed = event.key.toLowerCase()
    if (keyPressed == 'enter') {
        enter()
    } else if (keyPressed == 'backspace') {
        back()
    } else if (keyPressed.length == 1 && keyPressed.charCodeAt(0) >= 97 && keyPressed.charCodeAt(0) <= 122) {
        key(keyPressed)
    }
})

async function loadWords() {
    const response = await fetch('txt/wordant.txt')
    return (await response.text()).split('\n')
}

function enter() {
    if (!won) {
        const guesses = document.getElementById('guesses')
        const guess = guesses.children[guesses.children.length - 1]
        const submitted = guess.innerText
        if (!submitted.includes('_')) {
            if (!words.has(submitted)) {
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
                won = true
                for (let i = 0; i < 5; i++) {
                    guess.innerHTML += `<span class="${status[i]}">${submitted[i]}</span>`
                    if (status[i] != 'right') {
                        won = false
                    }
                }
                if (!won) {
                    newGuess = document.createElement('div')
                    newGuess.className = 'guess'
                    newGuess.innerText = '_____'
                    document.getElementById('guesses').appendChild(newGuess)
                    if (Math.random() < 0.25) {
                        target = shiftWord(target)
                    }
                    shuffleKeyboard()
                }
            }
        }
    }
}

function shiftWord(word) { // Very lazy approach
    let newWord = randomShift(word)
    let attempts = 0
    while (!words.has(newWord)) {
        newWord = randomShift(word)
        attempts++
        if (attempts > 25) {
            return word
        }
    }
    return newWord
}

function randomShift(word) {
    const index = 4
    let charCode = Math.floor(Math.random() * 25 + 97)
    if (word.charCodeAt(index) == charCode) {
        charCode = 122
    }
    return word.slice(0, index) + String.fromCharCode(charCode) + word.slice(index + 1)
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
    if (!won) {
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
}

function key(letter) {
    if (!won) {
        const guesses = document.getElementById('guesses')
        const guess = guesses.children[guesses.children.length - 1]
        const index = guess.innerText.indexOf('_')
        if (index != -1) {
            guess.innerText = guess.innerText.slice(0, index) + letter.toLowerCase() + '_'.repeat(4 - index)
        }
    }
}