const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('my-database.db')
//File System module
const fs = require('fs')
const multer = require('multer')


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

/**
* ImageHandlerSection
**/
db.run('CREATE TABLE IF NOT EXISTS imageTable (id INTEGER PRIMARY KEY AUTOINCREMENT, imageName TEXT NOT NULL, fileExt TEXT NOT NULL)')

exports.uploadImageToTable = function(request, callback) {
  const name = request.file.filename
  const ext =  request.file.mimetype.replace("image/", "")
  const query = 'INSERT INTO imageTable (imageName, fileExt) VALUES (?, ?)'

  db.run(query, [name, ext], function(error) {
    callback(error)
  })
}

exports.getImagesFromTable = function(startIx, endIx, callback) {
  const query = 'SELECT imageName, fileExt FROM imageTable WHERE id >= ? LIMIT ?'
  db.all(query, [startIx, endIx], function(error, imageTable) {
    if(error) {
      console.log(error)
    }
    callback(error, imageTable)
  })
}

db.serialize(function () {
  db.each('SELECT * FROM imageTable', function(err, table) {
    console.log(table)
  })
})
