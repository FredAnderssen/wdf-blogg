const dummyData = require ('./dummy-data')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

app.engine('hbs', expressHandlebars({
  defaultLayout: 'main',
  extname: '.hbs'
}))

//middleware 1, TODO why <head> not applying on index.html?
app.use(express.static('public_html'))

//middleware 2
app.set('partialsDir', 'views/partials/')

//middleware 3
app.get('/', function(request, response){
  const model = {
    humans: dummyData.humans
  }
  response.render("page-humans.hbs", model)
})

app.get(
  '/about',
  function(request, response)
  {
    response.render('./about.hbs')
    response.status(200)
  }
)

app.get(
  '/contact',
  function(request, response)
  {
    response.render('./contact.hbs')
    response.status(200)
  }
)


app.listen(8080)
