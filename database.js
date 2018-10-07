const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('my-database.db')

db.run('CREATE TABLE IF NOT EXISTS faqs (username TEXT PRIMARY KEY NOT NULL UNIQUE, question TEXT NOT NULL, answer TEXT)')

exports.createFaq = function(question, answer, callback) {
  const query = "INSERT INTO faqs (question, answer) VALUES (?, ?)"
  const values = [question, answer]

  db.run(query, values, function(error) {
    callback(error)
  })

}

//inserting rows
//use place holder ? for the user to put in
db.run('INSERT INTO faqs (username, question, answer) VALUES ("dragonslayer", "how old are u", "im twentyone")'
, function(error) {
  if(error) {

  } else {

    //const id = this.lastID
  }
})

exports.getAllFaqs = function(callback) {
  const query = "SELECT * FROM faqs"
  db.all(query, function(error, faqs) {
    callback(error, faqs)
  })
}

//test print TABLE faqs
db.serialize(function () {
  db.each('SELECT * FROM faqs', function(err, table) {
    console.log(table)
  })
})
