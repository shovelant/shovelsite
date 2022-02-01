const PORT = 80

var express = require('express')

var app = express()
app.set('view engine', 'hbs')

var indexRouter = require('./routes/index')
app.use('/', indexRouter);

var listener = app.listen(PORT, function() {
    console.log('Server started')
});