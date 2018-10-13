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
      response.redirect("/about")
    })
  } else
  response.send('Unsuccessfully created faq, you might not intentelly send this request')
})

router.get('/update-answer/:id', function(request, response) {
  const id = request.params.id
  request.session.token = Math.random()

  //TODO if u are loggedin
  faqHandler.getFaqId(id, function(error, faqs) {
    const model = {
      faqs: faqs,
      token: request.session.token
    }
    response.render('faqPanel.hbs', model)
  })
})

router.post('/update-answer/:id', function(request, response) {
  const id = request.params.id
  const question = request.body.question
  const answer = request.body.answer

  if(request.session.token == request.body.token) {
    console.log("IM IN FAQ UPDATE ANSWER")
    faqHandler.updateFaq(id, question, answer, function(error) {
      response.redirect('/about')
    })
  } else
    response.send('Unsuccessfully updated answer, you might not intentelly send this request')
})

router.get('/delete-faq/:id', function(request, response) {
  const id = request.params.id

  faqHandler.deleteFaq(id, function(error) {
    response.redirect('/about')
  })
})



module.exports = router
