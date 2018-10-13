const express = require('express')
const galleryHandler = require('./galleryHandler')
const multer = require('multer')

var router = express.Router()


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

router.post('/', multer(multerConfig).single('photo'), function(req,res){
  if(req.session.token == req.body.token) {
    res.send('Complete! Image uploaded to folder')
    galleryHandler.uploadImageToTable(req, function(error) {
    })
  }
  else {
    res.redirect('/about')
  }
})

router.get('/',
function(request, response) {
  request.session.token = Math.random()
  const isLoggedIn = request.session.isLoggedIn


  galleryHandler.getImagesFromTable(4, 20, function(error, imageTable) {
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
  const id = request.params.id

  galleryHandler.getImageId(id, function(error, imageTable) {
    const model = {
      imageTable: imageTable
    }
    response.render('updategallery.hbs', model)
  })
})

router.post('/updategallery/:id', multer(multerConfig).single('photo'), function(request, response) {
  const id = request.params.id

  galleryHandler.updateImage(request, id, function(error) {
    response.redirect('/gallery')
  })
})

router.get('/deletegallery/:id', function(request, response) {
  const id = request.params.id

  galleryHandler.deleteImage(id, function(error) {
    response.redirect('/gallery')
  })

})

module.exports = router
