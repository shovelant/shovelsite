var express = require('express')
app = module.exports = express()

app.get('/team', function(req, res) {
    res.render('team');
});