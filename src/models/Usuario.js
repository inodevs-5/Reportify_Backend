const mongoose = require("mongoose")
const conn = require('../config/multipleDbsConnections')
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
        },
        notificacoes: [{
            colaboradoIACIT:{
                type: Schema.Types.ObjectId,
                ref: 'RO',
            },
            idRo: {
                type: Number,
                ref: 'RO',
            },
            mensagem: {
                type: String,
            },
            data:{
                type: Date,
                required: true,
                default: new Date().toLocaleString("en-US", {timezone: 'America/Sao_Paulo'})
            },
            visualizar:{
                type: Boolean,
            }
        }]
    }
)

const Usuario = conn.main.model("Usuario", usuarioSchema)

module.exports = {
    Usuario,
    usuarioSchema
}