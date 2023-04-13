const mongoose = require("mongoose")

const { Schema } = mongoose

const empresaSchema = new Schema({
        nome: {
            type: String,
            required: true
        },
        cnpj: {
            type: String,
            required: true,
            unique: true,
        },
        contato: {
            type: String,
            required: true,
        },
        _id: false
    }
)

module.exports = {
    empresaSchema
}