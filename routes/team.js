let express = require('express')
app = module.exports = express()

app.get('/team', function(req, res) {
    people = ['Brad', 'Gabe', 'Iggy', 'Nico', 'Onur']
    for (let i = people.length - 1; i > 0; i--) {
        const swap = Math.floor(Math.random() * (i + 1))
        const temp = people[i]
        people[i] = people[swap]
        people[swap] = temp
    }
    res.render('team', { people: people })
})