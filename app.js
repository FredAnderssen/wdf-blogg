const dummyData = require ('./dummy-data')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')

app.engine('hbs', expressHandlebars({
  defaultLayout: 'main',
  extname: '.hbs'
}))

//middleware 1
//static files never change
app.use(express.static('public_html'))
app.use(bodyParser.urlencoded({extended: false}))

//middleware 2
app.set('partialsDir', 'views/partials/')

//middleware 3
app.get('/humans',
function(request, response){
  const model = {
    humans: dummyData.humans,
    title: dummyData.title
  }
  response.render("page-humans.hbs", model)
})

app.post('/login',
function(request, response)
{
  const username = request.body.un
  const password = request.body.pw
})


//middleware 4, homepage
app.get('/',
function(request, response)
{
  response.render('./index.hbs')
  response.status(200)
})

app.get(
  '/about',
  function(request, response)
  {
    response.render('about.hbs')
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



app.listen(8080, function() {
  console.log("Web application up and running, listening on port 8080.")
})
