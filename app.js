const express = require('express')
const multer = require('multer')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const myDB = require('./database')
const fs = require('fs')
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

app.set('partialsDir', 'views/partials/')

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

    if (username == "PetterLarsson@kungar.se" && password == "123") {
      console.log("Successfully logged in")


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
    blogpostHandler.getAllPosts(function(error, postTable) {
      const model = {
        postTable: postTable
      }
      response.render("index.hbs", model)
    })
  })

  app.get('/updatepost', function(request, response) {
    response.render('updatepost.hbs')
  })

  app.get('/updatepost/:id', function(request, response) {
    const id = request.params.id

    blogpostHandler.getPostId(id, function(error, blogpost) {
      const model = {
        blogpost: blogpost
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

  app.post('/gallery', multer(multerConfig).single('photo'),function(req,res){
    res.send('Complete! Image uploaded to folder')
    galleryHandler.uploadImageToTable(req, function(error) {
    })
  })

  app.get('/gallery',
  function(request, response) {
    galleryHandler.getImagesFromTable(4, 20, function(error, imageTable) {
      const model = {
        imageTable: imageTable
      }
      response.render('gallery.hbs', model)
      response.status(200)
    })
  })

  app.listen(8080, function() {
    console.log("Web application up and running, listening on port 8080.")
    console.log("  ")
  })
