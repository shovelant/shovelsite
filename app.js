var express = require('express')

var app = express()
app.use(express.static('public'))
app.set('view engine', 'hbs')

var index = require('index')
var team = require('team')

app.use(index)
app.use(team)

app.listen(process.env.PORT)
console.log('Server started')