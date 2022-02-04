const express = require('express')
app = module.exports = express()

app.get('/contact', function(req, res) {
    res.render('contact')
})