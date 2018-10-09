const express = require('express')
const multer = require('multer')
//TODO ändra folder till img
var upload = multer({ dest: 'public_html/'})
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
app.use('/', express.static(__dirname + '/public'))

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

app.get("/about", function(request, response) {
  myDB.getAllFaqs(function(error, faqs) {
    const model = {
      faqs: faqs
    }
    response.render("about.hbs", model)
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
      response.redirect("/about")
    })
  })

  //TODO implement authentication to answer faqs and comment blogposts
  app.post('/login', function(request, response) {
    const username = request.body.username
    const password = request.body.password

    if (username == "PetterLarsson@kungar.se" && password == "123") {
      console.log("Successfully logged in TEST")
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

  /**
  * Multer
  **/
  const multerConfig = {

    storage: multer.diskStorage({
      destination: function(req, file, next){
        next(null, './public_html/img')
      },

      filename: function(req, file, next){
        console.log(file)
        const ext = file.mimetype.split('/')[1]
        next(null, file.fieldname + '-' + Date.now() + '.'+ext)
      }
    }),
    //TODO fix so only images can be uploaded
  };

  app.post('/',multer(multerConfig).single('photo'),function(req,res){
     res.send('Complete! Image uploaded to folder')
  })




  app.listen(8080, function() {
    console.log("Web application up and running, listening on port 8080.")
    console.log("  ")
  })
