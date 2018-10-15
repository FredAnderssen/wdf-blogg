const express = require('express')
const galleryHandler = require('./galleryHandler')
const multer = require('multer')

var router = express.Router()

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

};

router.post('/', multer(multerConfig).single('photo'), function(req,res){
  if(req.session.isLoggedIn) {
    if(req.session.token == req.body.token) {
      res.send('Complete! Image uploaded to folder')
      galleryHandler.uploadImageToTable(req, function(error) {
        if(error)
        res.send(error)
      })
    }
    else {
      res.redirect('/about')
    }
  } else
  res.send('Not authorized to post images, please login')
})

router.get('/',
function(request, response) {
  request.session.token = Math.random()
  const isLoggedIn = request.session.isLoggedIn

  galleryHandler.getImagesFromTable(4, 20, function(error, imageTable) {
    if(error)
    response.send("Internal server error, we are working on fixing it <br> <br>" + error)

    const model = {
      isLoggedIn: isLoggedIn,
      imageTable: imageTable,
      token: request.session.token
    }
    response.render('gallery.hbs', model)
    response.status(200)
  })
})

router.get('/updategallery/:id', function(request, response) {
  if(request.session.isLoggedIn) {
    const id = request.params.id

    galleryHandler.getImageId(id, function(error, imageTable) {
      if(error)
      response.send(error)
      const model = {
        imageTable: imageTable
      }
      response.render('updategallery.hbs', model)
    })
  } else
  response.send('Not authorized to update images, please login')
})

router.post('/updategallery/:id', multer(multerConfig).single('photo'), function(request, response) {
  if(request.session.isLoggedIn) {
    const id = request.params.id

    galleryHandler.updateImage(request, id, function(error) {
      if(error)
      response.send(error)
      response.redirect('/gallery')
    })
  } else
  response.send('Not authorized to update images, please login')
})

router.get('/deletegallery/:id', function(request, response) {
  if(request.session.isLoggedIn) {
    const id = request.params.id

    galleryHandler.deleteImage(id, function(error) {
      if(error)
      response.send(error)
      response.redirect('/gallery')
    })
  } else
  response.send('Not authorized to delete images, please login')
})

module.exports = router
