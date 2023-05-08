const mongoose = require('mongoose');

async function connectToSecondDb() {
  try {
    await mongoose.connect(process.env.SECOND_BD_URL_MAIN);
    console.log("Conectado ao banco de dados secundário da aplicação.");
  } catch (error) {
    console.error(`Erro ao conectar ao banco de dados secundário: ${error}`);
  };
};

module.exports = { connectToSecondDb };
