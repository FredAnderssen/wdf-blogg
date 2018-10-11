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

app.set('partialsDir', 'views/partials/')

app.get("/about", function(request, response) {
  faqHandler.getAllFaqs(function(error, faqs) {
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
    faqHandler.createFaq(question, answer, function(error)  {
      response.redirect("/about")
    })
  })

  //TODO implement authentication to answer faqs and comment blogposts
  app.post('/login', function(request, response) {
    const username = request.body.username
    const password = request.body.password

    //TODO error checks inputs
    if (username == "abc@com" && password == "123") {
      request.session.isLoggedIn = true
      console.log("Successfully logged in")
      response.redirect("/")

    } else {
      console.log("login attempt failed")
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
  * Blogpost section
  **/
  app.post('/', function(request, response) {
    const post = request.body.blogpost
    const title = request.body.titlepost
    blogpostHandler.createPost(post, title, function(error) {
      response.redirect('/')
    })
  })

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

  app.get('/updatepost', function(request, response) {
    response.render('updatepost.hbs')
  })

  app.get('/updatepost/:id', function(request, response) {
    const id = request.params.id
    //TODO if u are loggedin
    const blogposttest = true
    blogpostHandler.getPostId(id, function(error, blogpost) {
      const model = {
        blogpost: blogpost,
        blogposttest: blogposttest
      }
      response.render('updatepost.hbs', model)
    })
  })

  app.post('/updatepost/:id', function(request, response) {
    const id = request.params.id
    const post = request.body.blogpost
    const title = request.body.titlepost

    blogpostHandler.updatePost(id, post, title, function(error) {
      response.redirect('/')
    })
  })

  app.get('/deletepost/:id', function(request, response) {
    const id = request.params.id

    blogpostHandler.deletePost(id, function(error) {
      response.redirect('/')
    })
  })

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

  app.post('/gallery', multer(multerConfig).single('photo'), function(req,res){

    if(req.session.token == req.body.token) {
      res.send('Complete! Image uploaded to folder')
      galleryHandler.uploadImageToTable(req, function(error) {
      })
    }
    else {
      res.redirect('/about')
    }
  })

  app.get('/gallery',
  function(request, response) {
    request.session.token = Math.random()

    galleryHandler.getImagesFromTable(4, 20, function(error, imageTable) {
      const model = {
        imageTable: imageTable,
        token: request.session.token
      }
      response.render('gallery.hbs', model)
      response.status(200)
    })
  })

   app.get('/updategallery/:id', function(request, response) {
    const id = request.params.id

    galleryHandler.getImageId(id, function(error, imageTable) {
      const model = {
        imageTable: imageTable
      }
      response.render('updategallery.hbs', model)
    })
  })

  app.post('/updategallery/:id', multer(multerConfig).single('photo'), function(request, response) {
    const id = request.params.id

    galleryHandler.updateImage(request, id, function(error) {
      response.redirect('/')
    })
  })

  app.get('/deletegallery/:id', function(request, response) {
    const id = request.params.id

    galleryHandler.deleteImage(id, function(error) {
      response.redirect('/')
    })

  })



  app.listen(8080, function() {
    console.log("Web application up and running, listening on port 8080.")
    console.log("  ")
  })
