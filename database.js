const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('my-database.db')
//File System module
const fs = require('fs')
const multer = require('multer')
const bcrypt = require('bcrypt')

exports.db = db
