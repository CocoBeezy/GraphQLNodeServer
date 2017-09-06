const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('./config');
const fs = require('fs');

// Models - require all Models
// this allows the user of the
// following syntax:
// const User = mongoose.mode('User');
console.log('Loaded Mongoose Models...');
fs.readdirSync(__dirname + '/models')
  .forEach(file => { 
    if (~file.indexOf('.js')) 
      require(__dirname + '/models/' + file); 
  });
console.log('Finished!');

module.exports = function(callback) {
  let db = mongoose.connect(config.mongoUrl);
  callback(db);
}