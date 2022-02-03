let express = require('express')
let fs = require('fs')
let http = require('http')
let https = require('https')
let app = express()

app.use(express.static('public'))
app.set('view engine', 'hbs')

let index = require('index')
let about = require('about')
let team = require('team')
let contact = require('contact')
let wordant = require('wordant')

app.use(index)
app.use(about) 
app.use(team)
app.use(contact)
app.use(wordant)

app.get("*", (req,res) => { // Handle 404s
    res.status(404)
    res.render('404')
})

http.createServer(function (req, res) { // Redirect http to https
    res.writeHead(301, 'https://' + req.headers['host'] + req.url);
    res.end();
}).listen(80);

const key = fs.readFileSync('/etc/letsencrypt/live/shovelant.com/privkey.pem')
const cert = fs.readFileSync('/etc/letsencrypt/live/shovelant.com/fullchain.pem')

https.createServer({key, cert}, app).listen(443)
console.log('Server started')