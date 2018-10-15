const express = require('express')
const faqHandler = require('./faqHandler')

var router = express.Router()

router.get('/add-faq', function(request, response) {
  response.redirect("/about")
})

router.post("/add-faq", function(request, response) {
  const question = request.body.question
  const answer = ""

  if(request.session.token == request.body.token1) {
    faqHandler.createFaq(question, answer, function(error)  {
      if(error)
      response.send("Internal server error, we are working on fixing it <br> <br>" + error)
      else
      response.redirect("/about")
    })
  } else
  response.send('Unsuccessfully created faq, you might not intentelly send this request')
})

router.get('/update-answer/:id', function(request, response) {
  if(request.session.isLoggedIn) {
    const id = request.params.id
    request.session.token = Math.random()

    faqHandler.getFaqId(id, function(error, faqs) {
      if(error)
      response.send(error)
      const model = {
        faqs: faqs,
        token: request.session.token
      }
      response.render('faqPanel.hbs', model)
    })
  } else
  response.send('Not authorized to update FaQ, please login')
})

router.post('/update-answer/:id', function(request, response) {
  if(request.session.isLoggedIn) {
    const id = request.params.id
    const question = request.body.question
    const answer = request.body.answer

    if(request.session.token == request.body.token) {
      faqHandler.updateFaq(id, question, answer, function(error) {
        if(error)
        response.send(error)
        else
        response.redirect('/about')
      })
    } else
    response.send('Unsuccessfully updated answer, you might not intentionally send this request')

  } else
  response.send('Not authorized to update FaQ, please login')
})

router.get('/delete-faq/:id', function(request, response) {
  if(request.session.isLoggedIn) {
    const id = request.params.id

    faqHandler.deleteFaq(id, function(error) {
      if(error)
      response.send(error)
      else
      response.redirect('/about')
    })
  } else
  response.send('Not authorized to delete FaQ, please login')
})

module.exports = router
