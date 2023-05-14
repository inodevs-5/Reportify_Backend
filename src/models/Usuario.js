const mongoose = require("mongoose")
const conn = require('../config/multipleDbsConnections')
const { roSchema } = require("./RO")
const {mensagemSchema} = require('./Mensagem')
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
                required: false
            },
            idRo: {
                type: Number,
                ref: 'RO',
                required: false
            },
            mensagem: {
                type: String,
                required: false
            },
            data:{
                type: Date,
                required: true,
                default: new Date().toLocaleString("en-US", {timezone: 'America/Sao_Paulo'})
            },
            required: false
        }]
    }
)

const Usuario = conn.main.model("Usuario", usuarioSchema)

module.exports = {
    Usuario,
    usuarioSchema
}