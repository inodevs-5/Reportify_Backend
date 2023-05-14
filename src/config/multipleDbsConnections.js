const mongoose = require('mongoose');

mongoose.set("strictQuery", true);

try {
  mongoose.main = mongoose.createConnection(process.env.DB_URL_MAIN, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  mongoose.crypto = mongoose.createConnection(process.env.DB_URL_SECOND_DB, {
    useUnifiedTopology: true,
    useUnifiedTopology: true
  });

  console.log("Application is connected to databases.")
} catch (error) {
  console.error('Erro ao conectar ao banco de dados:', error);
}

module.exports = mongoose;