const mongoose = require("mongoose")
const conn = require('../config/newConnections')

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
            enum: ['admin', 'cliente'],
            required: true,
            default: 'cliente'
        },
        empresa: {
            type: String,
            required: true
        },
        contato_empresa: {
            type: String,
            required: true
        },
        senha: {
            type: String,
            required: true
        },
    }
)

const Usuario = conn.main.model("Usuario", usuarioSchema)

module.exports = {
    Usuario,
    usuarioSchema
}