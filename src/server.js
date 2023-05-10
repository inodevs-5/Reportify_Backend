require('dotenv').config();
const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())

app.use(express.json())

// conect to databases
// const mongoose = require("mongoose");
// const { connectToMainDb } = require("./config/connectToMainDb");
// const { connectToSecondDb } = require("./config/connectToSecondDb");
// connectToMainDb();
// connectToSecondDb();

const routes = require("./routes/router")
app.use("/", routes)

port = process.env.PORT || 3000

app.listen(port, function() {
    console.log("Servidor rodando na porta", port)
})