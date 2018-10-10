const database = require('./database')
const db = database.db

db.run('CREATE TABLE IF NOT EXISTS faqs (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, answer TEXT)')

exports.createFaq = function(question, answer, callback) {
  const query = "INSERT INTO faqs (question, answer) VALUES (?, ?)"
  const values = [question, answer]

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

//test print TABLE faqs console
db.serialize(function () {
  db.each('SELECT * FROM faqs', function(err, table) {
    console.log(table)
  })
})
