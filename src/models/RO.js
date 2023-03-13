const mongoose = require("mongoose")
const {empresaSchema} = require('./Empresa')

const { Schema } = mongoose

const roSchema = new Schema({
        empresa: {
            type: empresaSchema,
            required: true
        },
        titulo: {
            type: String,
            required: true,
        },
        descricao: {
            type: String,
            required: true,
        },
        prioridade: {
            type: String,
            enum: ['alta', 'media', 'baixa'],
            required: true,
            default: 'baixa'
        }, 
        contatoColab : {
            type: String,
            required: true
        },
        // anexos { }
    }
)

const RO = mongoose.model("User", roSchema)

module.exports = {
    RO
}