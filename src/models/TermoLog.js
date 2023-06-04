const mongoose = require('mongoose');
const conn = require('../config/multipleDbsConnections')
const Schema = mongoose.Schema;

const termoLogSchema = new Schema({
    versaoTermo: {
        required: true,
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true
    },
    aceitoEm: {
        default: new Date().toLocaleString("en-US", {timezone: 'America/Sao_Paulo'}),
        type: Date,
    },
});

const TermoLog = conn.main.model("TermoLog", termoLogSchema)

module.exports = { TermoLog, termoLogSchema };