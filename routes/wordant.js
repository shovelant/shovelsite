const express = require('express')
app = module.exports = express()

app.get('/wordant', function(req, res) {
    res.render('wordant')
})