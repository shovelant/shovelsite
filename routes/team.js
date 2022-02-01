var express = require('express')
app = module.exports = express()

app.get('/team', function(req, res) {
    people = ['Brad', 'Gabe', 'Iggy', 'Nico', 'Onur']
    for (var i = people.length - 1; i > 0; i--) {
        var swap = Math.floor(Math.random() * (i + 1));
        var temp = people[i];
        people[i] = people[swap];
        people[swap] = temp;
    }
    res.render('team', {people: people});
});