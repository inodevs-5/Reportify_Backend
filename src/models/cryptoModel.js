const mongoose = require('mongoose');
const conn = require('../config/multipleDbsConnections')

const cryptoSchema = new mongoose.Schema({
  cryptoKey: {
    type: String
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  }
});

const Crypto = conn.crypto.model('Crypto', cryptoSchema);

module.exports = {
  Crypto,
  cryptoSchema
};
