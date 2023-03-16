const mongoose = require("mongoose")
const {empresaSchema} = require('./Empresa')
const {usuarioSchema} = require('./Usuario')

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
        cliente : {
            type: usuarioSchema,
            required: true
        },
        suporte : {
            type: usuarioSchema,
            required: true
        },
        status : {
            type: String,
            enum: ['Tratado', 'Em tratamento', 'Pendente', 'Resolvido', 'Requisição inválida'],
            required: true,
            default: 'Pendente'
        },

        // anexos { }
    },  { timestamps: true }
)

const RO = mongoose.model("RO", roSchema)

module.exports = RO
