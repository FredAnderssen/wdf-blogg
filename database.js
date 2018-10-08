const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('my-database.db')

db.run('CREATE TABLE IF NOT EXISTS faqs (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, answer TEXT)')
//db.run('ALTER TABLE faqs RENAME TO oldfaqs')
//db.run('CREATE TABLE faqs (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, answer TEXT)')
//db.run('DROP TABLE oldfaqs')

exports.createFaq = function(question, answer, callback) {
  const query = "INSERT INTO faqs (question, answer) VALUES (?, ?)"
  const values = [question, answer]

  db.run(query, values, function(error) {
    callback(error)
  })
}

//inserting rows
//use place holder ? for the user to put in
//WORKS
//const namn = "Atta"
//const fraga = "INSERT INTO faqs (username, question) VALUES (?, 'are u strong?')"
//db.run(fraga, [namn])

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
