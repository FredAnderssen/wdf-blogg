const database = require('./database')
const db = database.db
const fs = require('fs')

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
  const query = 'SELECT imageName, fileExt, id FROM imageTable WHERE id >= ? LIMIT ?'
  db.all(query, [startIx, endIx], function(error, imageTable) {
    if(error) {
      console.log(error)
    }
    callback(error, imageTable)
  })
}

exports.getImageId = function(id, callback) {
  const query = 'SELECT * FROM imageTable WHERE id = ?'

  db.get(query, [id], function(error, imageTable) {
    callback(error, imageTable)
  })
}

exports.updateImage = function(request, id, callback) {
  const name = request.file.filename
  const ext =  request.file.mimetype.replace("image/", "")

  const query = 'UPDATE imageTable SET imageName = ?, fileExt = ? WHERE id = ?'
  const values = [name, ext, id]

  db.run(query, values, function(error) {
    callback(error)
  })
}

exports.deleteImage = function(id, callback) {
  const query = 'SELECT imageName, fileExt FROM imageTable WHERE id = ?'

  db.get(query, [id], function(error, image) {
    var filepath = "./public_html/img/" + image.imageName

    fs.unlink(filepath, function(error) {
      const query2 = 'DELETE from imageTable WHERE id = ?'

      db.run(query2, [id], function(error) {
        callback(error)
      })
    })
  })
}
