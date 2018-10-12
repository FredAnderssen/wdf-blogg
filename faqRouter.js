const express = require('express')
const faqHandler = require('./faqHandler')

var router = express.Router()

router.get('/add-faq', function(request, response) {
  console.log("IM IN /about/faq/add-faq middleware")
  response.redirect("/about")
})

router.post("/add-faq", function(request, response) {
  const question = request.body.question
  const answer = ""

  faqHandler.createFaq(question, answer, function(error)  {
    response.redirect("/about")
  })
})

router.get('/update-answer/:id', function(request, response) {
  const id = request.params.id

  //TODO if u are loggedin
  faqHandler.getFaqId(id, function(error, faqs) {
    const model = {
      faqs: faqs
    }
    response.render('faqPanel.hbs', model)
  })
})

router.post('/update-answer/:id', function(request, response) {
  const id = request.params.id
  const question = request.body.question
  const answer = request.body.answer

  faqHandler.updateFaq(id, question, answer, function(error) {
    response.redirect('/about')
  })
})

router.get('/delete-faq/:id', function(request, response) {
  const id = request.params.id

  faqHandler.deleteFaq(id, function(error) {
    response.redirect('/about')
  })
})



module.exports = router
