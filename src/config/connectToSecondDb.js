const mongoose = require('mongoose');

async function connectToSecondDb() {
  try {
    await mongoose.createConnection(process.env.DB_URL_SECOND_DB);
    console.log("Conectado ao banco de dados secundário da aplicação.");
  } catch (error) {
    console.error(`Erro ao conectar ao banco de dados secundário: ${error}`);
  };
};

module.exports = { connectToSecondDb };
