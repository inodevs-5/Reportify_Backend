const mongoose = require('mongoose');

mongoose.set("strictQuery", true);

try {
  mongoose.main = mongoose.createConnection(process.env.DB_URL_MAIN);
  mongoose.crypto = mongoose.createConnection(process.env.DB_URL_SECOND_DB);
} catch (error) {
  console.error('Erro ao conectar ao banco de dados:', error);
}

module.exports = mongoose;