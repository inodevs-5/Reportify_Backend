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
    }
)

const RO = mongoose.model("Empresa", empresaSchema)

module.exports = {
    Empresa,
    empresaSchema
}