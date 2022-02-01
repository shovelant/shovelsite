var express = require('express')
app = module.exports = express()

app.get('/about', function(req, res) {
    res.render('about');
});