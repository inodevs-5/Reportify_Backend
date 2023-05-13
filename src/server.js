require('dotenv').config()
const {dbBackup} = require("./middlewares/backup")
const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())

app.use(express.json())

const conn = require("./config/connDB")
conn()

const routes = require("./routes/router")
app.use("/", routes)

port = process.env.PORT || 3001

app.listen(port, function() {
    console.log("Servidor rodando na porta", port)
})

dbBackup()
