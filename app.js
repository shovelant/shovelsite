const express = require('express')
const fs = require('fs')
const https = require('https')
const app = express()

app.use(express.static('public'))
app.set('view engine', 'hbs')

const index = require('index')
const about = require('about')
const team = require('team')
const contact = require('contact')
const wordant = require('wordant')

app.use(index)
app.use(about) 
app.use(team)
app.use(contact)
app.use(wordant)

app.get("*", (req,res) => { // Handle 404s
    res.status(404)
    res.render('404')
})

const key = fs.readFileSync('/etc/letsencrypt/live/shovelant.com/privkey.pem')
const cert = fs.readFileSync('/etc/letsencrypt/live/shovelant.com/fullchain.pem')

https.createServer({key, cert}, app).listen(443)
console.log('Server started')