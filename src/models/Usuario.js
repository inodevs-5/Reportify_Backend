const mongoose = require("mongoose")
const {empresaSchema} = require('./Empresa')

const { Schema } = mongoose

const usuarioSchema = new Schema({
        nome: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        perfil: {
            type: String,
            enum: ['admin', 'suporte', 'cliente'],
            required: true,
            default: 'cliente'
        },
        empresa: {
            type: empresaSchema
        },
        senha: {
            type: String,
            required: true
        },
    }
)

const Usuario = mongoose.model("Usuario", usuarioSchema)

module.exports = {
    Usuario,
    usuarioSchema
}