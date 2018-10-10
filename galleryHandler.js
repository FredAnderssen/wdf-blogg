const database = require('./database')
const db = database.db

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