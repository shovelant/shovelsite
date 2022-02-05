const KEYBOARD_LAYOUT = [10, 9, 9]
const SHIFT_CHANCE = 0.25
let gameStatus = 0 // 0 for still playing, 1 for won, 2 for lost
let guessNumber = 0
let emojis = '' // The text you share with your friends, if you have any
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
    if (gameStatus == 0) {
        const guesses = document.getElementById('guesses')
        const guess = guesses.children[guessNumber]
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
                gameStatus = 1
                for (let i = 0; i < 5; i++) {
                    guess.innerHTML += `<span class="${status[i]}">${submitted[i]}</span>`
                    if (status[i] == 'right') {
                        emojis += '🟩' // Green
                    } else if (status[i] == 'contains') {
                        gameStatus = 0
                        emojis += '🟨' // Red
                    } else {
                        gameStatus = 0
                        emojis += '⬛' // Black
                    }
                }
                emojis += '\n'
                guessNumber++
                if (gameStatus == 0 && guessNumber >= 10) {
                    gameStatus = 2
                }
                if (gameStatus == 0) {
                    if (Math.random() < SHIFT_CHANCE) {
                        target = shiftWord(target)
                    }
                    shuffleKeyboard()
                } else {
                    let endgame = document.getElementById('endgame')
                    if (gameStatus == 1) {
                        endgame.innerHTML = 'Nice! <span id="copy">&ltCopy to clipboard&gt</span>'
                        let copy = document.getElementById('copy')
                        copy.onclick = function() {
                            let share = `Wordant ${guessNumber}/10\n\n` + emojis
                            navigator.clipboard.writeText(share)
                        }
                    } else {
                        endgame.innerText = `The answer was ${target}`
                    }
                    endgame.hidden = false
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
    const index = Math.floor(Math.random() * 5)
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
    if (gameStatus == 0) {
        const guesses = document.getElementById('guesses')
        const guess = guesses.children[guessNumber]
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
    if (gameStatus == 0) {
        const guesses = document.getElementById('guesses')
        const guess = guesses.children[guessNumber]
        const index = guess.innerText.indexOf('_')
        if (index != -1) {
            guess.innerText = guess.innerText.slice(0, index) + letter.toLowerCase() + '_'.repeat(4 - index)
        }
    }
}