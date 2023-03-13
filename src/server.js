require('dotenv').config()
const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())

app.use(express.json())

const conn = require("./db/conn")
conn()

port = process.env.PORT || 3000

app.listen(port, function() {
    console.log("Servidor rodando na porta", port)
})