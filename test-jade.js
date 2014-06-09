var express = require('express')
var app = express()

app.set('view engine', 'jade')
app.set('views', 'views')

app.use(express.static('assets'))

app.use(function(req, res){
  res.render(req.query['q'] || 'home')
})

app.listen(3000)