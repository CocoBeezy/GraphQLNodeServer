import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import config from './config';
import fs from 'fs';

// Models - require all Models
// this allows the user of the
// following syntax:
// const User = mongoose.mode('User');
console.log('Loaded Mongoose Models...')
fs.readdirSync(__dirname + '/models')
  .forEach(file => { 
    if (~file.indexOf('.js')) 
      require(__dirname + '/models/' + file); 
  });
console.log('Finished!');

export default callback => {
  let db = mongoose.connect(config.mongoUrl);
  callback(db);
}