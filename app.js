var express = require('express')

var app = express()
app.use(express.static('public'))
app.set('view engine', 'hbs')

var index = require('index')
var about = require('about')
var team = require('team')
var contact = require('contact')

app.use(index)
app.use(about) 
app.use(team)
app.use(contact)

app.listen(process.env.PORT)
console.log('Server started')