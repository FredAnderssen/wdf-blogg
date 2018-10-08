const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const myDB = require('./database')

const app = express()

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

app.get("/faqs", function(request, response) {
  myDB.getAllFaqs(function(error, faqs) {
    const model = {
      faqs: faqs
    }
    response.render("faqs.hbs", model)
  })
})

app.get(
  '/add-faq',
function(request, response) {
  response.render("add-faq.hbs")
})

app.post("/add-faq", function(request, response) {
  const question = request.body.question
  const answer = ""
  myDB.createFaq(question, answer, function(error)  {
    response.redirect("/faqs")
  })
})

app.post('/login', function(request, response) {
  const username = request.body.username
  const password = request.body.password

  if (username == "PetterLarsson@kungar.se" && password == "123") {
    
  } else {

  }
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
  console.log("  ")
})
