let express = require('express')
app = module.exports = express()

app.get('/', function(req, res) {
    res.render('index')
})