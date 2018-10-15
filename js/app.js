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

app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'ahsgahsfq'
}))

const blogpostRouter = require('./blogpostRouter')
app.use('/blogpost', blogpostRouter)

const galleryRouter = require('./galleryRouter')
app.use('/gallery', galleryRouter)

const faqRouter = require('./faqRouter')
app.use('/about/faq', faqRouter)

app.set('partialsDir', 'views/partials/')

app.get("/about", function(request, response) {
  const isLoggedIn = request.session.isLoggedIn
  request.session.token = Math.random()

  faqHandler.getAllFaqs(function(error, faqs) {
    if(error)
    response.send("Internal server error, we are working on fixing it <br> <br>" + error)

    const model = {
      faqs: faqs,
      isLoggedIn: isLoggedIn,
      token: request.session.token
    }
    response.render("about.hbs", model)
  })
})

app.post('/login', function(request, response) {
  if(request.session.token == request.body.token) {
    const username = request.body.username
    const password = request.body.password

    if (username == "peterlarsson@kungar.se" && bcrypt.compareSync(password,
      "$2b$10$ohyAZoU4gmAvbF2PeLZzYObWLBlLjY5mvS.frjmUkMrpN.RElF7rS")) {
        request.session.isLoggedIn = true
        console.log("Successfully logged in")
        response.redirect("/")

      } else {
        console.log("Login attempt failed")
        response.redirect("/")
      }
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
      response.render('contact.hbs')
      response.status(200)
    }
  )

  app.get('/', function(request, response) {
    const isLoggedIn = request.session.isLoggedIn
    request.session.token = Math.random()

    blogpostHandler.getAllPosts(function(error, postTable) {
      if(error)
      response.send("Internal server error, we are working on fixing it <br> <br>" + error)

      const model = {
        postTable: postTable,
        isLoggedIn: isLoggedIn,
        token: request.session.token
      }
      response.render("./index.hbs", model)
    })
  })

  app.listen(8080, function() {
    console.log("Web application up and running, listening on port 8080.")
  })
