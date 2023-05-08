const mongoose = require("mongoose");

async function connectToMainDb() {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.createConnection(process.env.DB_URL_MAIN);
        console.log("Conectado ao banco de dados principal da aplicação.");
    } catch (error) {
        console.error(`Erro ao conectar ao banco de dados principal: ${error}`);
    };
};

module.exports = { connectToMainDb };
