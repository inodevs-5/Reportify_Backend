const mongoose = require('mongoose');

// botei essa linha aqui mas não sei se é o lugar certo, mas o erro sumiu =/
mongoose.set("strictQuery", true)

// estou confusa com as variáveis de ambiente, não sei se é essa mesmo aqui
mongoose.connect(process.env.DB_URL_MAIN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(conn => {
  console.log('MongoDb Main Conected')
})
.catch( error => {
  console.log("Error:" + error.message)
})

mongoose.main = mongoose.createConnection(process.env.DB_URL_MAIN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

mongoose.crypto = mongoose.createConnection(process.env.DB_URL_SECOND_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

module.exports = mongoose;

// dei um require do conn no cryptoModel e no Usuario.js (model)
// comentei as linhas da antiga conexão no server.js
// se for testar lembra de tirar o checkAdmin da rota do usuario e o checkToken do router.js