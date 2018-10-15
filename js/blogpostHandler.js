const database = require('./database')
const errHandler = require('./errorHandler')
const db = database.db

db.run('CREATE TABLE IF NOT EXISTS postTable (id INTEGER PRIMARY KEY AUTOINCREMENT, comment TEXT NOT NULL, title TEXT NOT NULL)')

exports.createPost = function(post, title, callback) {
  const query = 'INSERT INTO postTable (comment, title) VALUES (?, ?)'
  const values = [post, title]

  db.run(query, values, function(error) {
    callback(error)
  })
}

exports.getAllPosts = function(callback) {
  const query = 'SELECT * FROM postTable'

  db.all(query, function(error, postTable) {
    if (error) {
      console.log(error)
    }
    callback(error, postTable)
  })
}

exports.getPostId = function(id, callback) {
  const query = 'SELECT * FROM postTable WHERE id = ?'

  db.get(query, [id], function(error, blogpost) {
    callback(error, blogpost)
  })
}

exports.updatePost = function(id, newPost, newTitle, callback) {
  const query = 'UPDATE postTable SET comment = ?, title = ? WHERE id = ?'
  const values = [newPost, newTitle, id]

  db.run(query, values, function(error) {
    callback(error)
  })
}

exports.deletePost = function(id, callback) {
  const query = 'DELETE FROM postTable WHERE id = ?'
  const value = [id]

  db.run(query, value, function(error) {
    callback(error)
  })
}
