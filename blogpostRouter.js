const express = require('express')
const blogpostHandler = require('./blogpostHandler')

var router = express.Router()

router.post('/createpost', function(request, response) {
  const post = request.body.blogpost
  const title = request.body.titlepost
  blogpostHandler.createPost(post, title, function(error) {
    response.redirect('/')
  })
})

router.get('/updatepost', function(request, response) {
  response.render('updatepost.hbs')
})

router.get('/updatepost/:id', function(request, response) {
  const id = request.params.id

  //TODO if u are loggedin
  blogpostHandler.getPostId(id, function(error, blogpost) {
    const model = {
      blogpost: blogpost
    }
    response.render('updatepost.hbs', model)
  })
})

//TODO if u are logged in
router.post('/updatepost/:id', function(request, response) {
  const id = request.params.id
  const post = request.body.blogpost
  const title = request.body.titlepost

  blogpostHandler.updatePost(id, post, title, function(error) {
    response.redirect('/')
  })
})

//TODO if u are loogged in
router.get('/deletepost/:id', function(request, response) {
  const id = request.params.id

  blogpostHandler.deletePost(id, function(error) {
    response.redirect('/')
  })
})

module.exports = router
