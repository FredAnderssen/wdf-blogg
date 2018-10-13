const express = require('express')
const multer = require('multer')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const myDB = require('./database')
const fs = require('fs')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const blogpostHandler = require('./blogpostHandler')
const galleryHandler = require('./galleryHandler')
const faqHandler = require('./faqHandler')
const bcrypt = require('bcrypt')

const app = express()

app.engine('hbs', expressHandlebars({
  defaultLayout: 'main',
  extname: '.hbs'
}))

app.use(express.static('public_html'))
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', express.static(__dirname + '/public'))
app.use(cookieParser())

/**
* Cookie and Sessions
**/

app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'ahsgahsfq'
}))

//Create cookie
app.get('/create-cookie', function(request, response) {
  response.cookie("lastVisited", Date.now())
  //...
})

//Read cookie
app.get('/read-cookie', function(request, response) {
  const lastVisited = parseInt(request.cookies.lastVisit)
  //...
})

/*******
*******/

const blogpostRouter = require('./blogpostRouter')
app.use('/blogpost', blogpostRouter)

const galleryRouter = require('./galleryRouter')
app.use('/gallery', galleryRouter)

const faqRouter = require('./faqRouter')
app.use('/about/faq', faqRouter)

app.set('partialsDir', 'views/partials/')

app.get("/about", function(request, response) {
  const isLoggedIn = request.session.isLoggedIn

  faqHandler.getAllFaqs(function(error, faqs) {
    const model = {
      faqs: faqs,
      isLoggedIn: isLoggedIn
    }
    response.render("about.hbs", model)
  })
})

  //TODO implement authentication to answer faqs and comment blogposts
  app.post('/login', function(request, response) {
    const username = request.body.username
    const password = request.body.password

    //TODO error checks inputs
    if (username == "abc@com" && bcrypt.compareSync(password,
      "$2b$10$ohyAZoU4gmAvbF2PeLZzYObWLBlLjY5mvS.frjmUkMrpN.RElF7rS")) {
      request.session.isLoggedIn = true
      console.log("Successfully logged in")
      response.redirect("/")

    } else {
      console.log("login attempt failed")
      response.redirect("/")
    }
  })

  app.post('/logut', function(request, response) {
    request.session.isLoggedIn = false
    response.redirect('/')
  })

  app.get(
    '/contact',
    function(request, response)
    {
      response.render('./contact.hbs')
      response.status(200)
    }
  )

  app.get('/', function(request, response) {

    const isLoggedIn = request.session.isLoggedIn
    blogpostHandler.getAllPosts(function(error, postTable) {
      const model = {
        postTable: postTable,
        isLoggedIn: isLoggedIn
      }
      response.render("index.hbs", model)
    })
  })

  app.listen(8080, function() {
    console.log("Web application up and running, listening on port 8080.")
    console.log("  ")
  })
