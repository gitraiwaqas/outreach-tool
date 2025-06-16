const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  domain: { type: String, unique: true },
  dealed: { type: Boolean, default: false },
  dealDate: { type: Date, default: null }
});

module.exports = mongoose.model('Site', siteSchema);