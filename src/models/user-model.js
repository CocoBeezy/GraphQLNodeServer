const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  age: {
    type: Number
  },
  email: {
    type: String,
    unique: 'Email already exists',
    required: 'Please fill in an email',
    lowercase: true,
    trim: true
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  }
});

module.exports = mongoose.model('User', UserSchema);
