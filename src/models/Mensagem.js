const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conn = require('../config/multipleDbsConnections')

const mensagemSchema = new Schema({
    conteudo: {
        required: true,
        type: String,
    },
    remetente: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true
    },
    destinatario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
    },
    enviadoEm: {
        default: new Date().toLocaleString("en-US", {timezone: 'America/Sao_Paulo'}),
        type: Date,
    },
});

const Mensagem = conn.main.model("Mensagem", mensagemSchema)

module.exports = { Mensagem, mensagemSchema };