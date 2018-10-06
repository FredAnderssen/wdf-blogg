const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('my-database.db')

db.run('CREATE TABLE IF NOT EXISTS faqs (username TEXT PRIMARY KEY NOT NULL UNIQUE, question TEXT NOT NULL, answer TEXT)')


//inserting rows
//use place holder ? for the user to put in
db.run('INSERT INTO faqs (username, question, answer) VALUES ("dragonslayer", "how old are u", "im twentyone")'
, function(error) {
  if(error) {

  } else {

    //const id = this.lastID
  }
})

//test print first row in TABLE faqs
db.serialize(function () {
  db.get('SELECT * FROM faqs', function(err, table) {
    console.log(table)
  })
})

//USE Placeholder ? to defend from vulnarbilities
//retrieving a single row
const name = "Alice"
const query = "SELECT * FROM Humans WHERE Name = ?"
db.get(query, [name], function(error, human) {
  if(error) {

  }else {
    // human = {id: 1, Name: "ALice", Age = 10}
  }

})

//retrieving multiple rows
const maxAge = 18
const query1 = "SELECT * FROM Humans WHERE Age < Age ?"
db.all(query1, [maxAge], function(error, humans) {
  if (error) {

  } else {

  }
})

//uploading rows
const id = 1
const newName = "ALicia"
const query2 = "UPDATE Humans SET Name = ? WHERE id = ?"
db.run(query2, [newName, id], function(error) {
  if (error) {

  } else {
    const numberOfUpdatedRows = this.changes
  }
})

//deleting rows
const id2 = 1
const query3 = "DELETE FROM Humans WHERE id2 = ?"
db.run(query3, [id2], function(error) {
  if (error) {

  } else {
    const numberOfDeletedRows = this.changes
  }
})
