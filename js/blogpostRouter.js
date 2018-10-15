const express = require('express')
const blogpostHandler = require('./blogpostHandler')

var router = express.Router()

router.post('/createpost', function(request, response) {
  if(request.session.isLoggedIn) {
    const post = request.body.blogpost
    const title = request.body.titlepost

    if(request.session.token == request.body.token) {
      blogpostHandler.createPost(post, title, function(error) {
        if(error)
        response.send(error)
        else
        response.redirect('/')
      })
    } else {
      response.send('Unsuccessfully created blogpost, you might not intentelly send this request')
    }
  } else
  response.send('Not authorized to create posts, please login')
})

router.get('/updatepost/:id', function(request, response) {
  if(request.session.isLoggedIn) {
    const id = request.params.id
    request.session.token = Math.random()

    blogpostHandler.getPostId(id, function(error, blogpost) {
      if(error)
      response.send(error)

      const model = {
        blogpost: blogpost,
        token: request.session.token
      }
      response.render('updatepost.hbs', model)
    })
  } else {
    response.send('Not authorized to visit this page, please login')
  }
})

router.post('/updatepost/:id', function(request, response) {
  if(request.session.isLoggedIn) {
    const id = request.params.id
    const post = request.body.blogpost
    const title = request.body.titlepost

    if(request.session.token == request.body.token) {
      blogpostHandler.updatePost(id, post, title, function(error) {
        if(error)
        response.send(error)
        else
        response.redirect('/')
      })
    } else
    response.send('Unsuccessfully updated blogpost, you might not intentelly send this request')

  } else
    response.redirect("/")
})

router.get('/deletepost/:id', function(request, response) {
  if(request.session.isLoggedIn) {
    const id = request.params.id

    blogpostHandler.deletePost(id, function(error) {
      if(error)
      response.send(error)
      else
      response.redirect('/')
    })
  } else
  response.send('Not authorized to delete posts, please login')
})

module.exports = router
