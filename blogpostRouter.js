const express = require('express')
const blogpostHandler = require('./blogpostHandler')

var router = express.Router()

router.post('/createpost', function(request, response) {
  const post = request.body.blogpost
  const title = request.body.titlepost

  if(request.session.token == request.body.token) {
    blogpostHandler.createPost(post, title, function(error) {
      response.redirect('/')
      if(error)
      response.send(error)
    })
  } else {
    response.send('Unsuccessfully created blogpost, you might not intentelly send this request')
  }
})

router.get('/updatepost/:id', function(request, response) {
  const id = request.params.id
  request.session.token = Math.random()

  //TODO if u are loggedin
  blogpostHandler.getPostId(id, function(error, blogpost) {
    const model = {
      blogpost: blogpost,
      token: request.session.token
    }
    response.render('updatepost.hbs', model)
  })
})

//TODO if u are logged in
router.post('/updatepost/:id', function(request, response) {
  const id = request.params.id
  const post = request.body.blogpost
  const title = request.body.titlepost

  if(request.session.token == request.body.token) {
    blogpostHandler.updatePost(id, post, title, function(error) {
      response.redirect('/')
    })
  } else
    response.send('Unsuccessfully updated blogpost, you might not intentelly send this request')

})

//TODO if u are loogged in
router.get('/deletepost/:id', function(request, response) {
  const id = request.params.id

  blogpostHandler.deletePost(id, function(error) {
    response.redirect('/')
  })
})

module.exports = router
