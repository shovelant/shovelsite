const PORT = 80

var express = require('express')

var app = express()
app.use(express.static('public'))
app.set('view engine', 'hbs')

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/team', function(req, res) {
    res.render('team');
});

var listener = app.listen(PORT, function() {
    console.log('Server started')
});