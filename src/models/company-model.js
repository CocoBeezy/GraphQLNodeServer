const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = Schema({
  name: {
    type: String
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Company', CompanySchema);
