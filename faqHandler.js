const database = require('./database')
const db = database.db

db.run('CREATE TABLE IF NOT EXISTS faqs (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, answer TEXT)')

exports.createFaq = function(question, answer, callback) {
  const query = "INSERT INTO faqs (question, answer) VALUES (?, ?)"
  const values = [question, answer]
  console.log("IM INSIDE CREATEFAQ")
  db.run(query, values, function(error) {
    callback(error)
  })
}

exports.getAllFaqs = function(callback) {
  const query = "SELECT * FROM faqs"
  db.all(query, function(error, faqs) {
    callback(error, faqs)
  })
}

exports.getFaqId = function(id, callback) {
  const query = 'SELECT * FROM faqs WHERE id = ?'

  db.get(query, [id], function(error, faqs) {
    callback(error, faqs)
  })
}

exports.updateFaq = function(id, newQuestion, newAnswer, callback) {
  const query = 'UPDATE faqs SET question = ?, answer = ? WHERE id = ?'
  const values = [newQuestion, newAnswer, id]

  db.run(query, values, function(error) {
    callback(error)
  })
}

exports.deleteFaq = function(id, callback) {
  const query = 'DELETE FROM faqs WHERE id = ?'
  const value = [id]

  db.run(query, value, function(error) {
    callback(error)
  })
}
