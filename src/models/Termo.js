const mongoose = require('mongoose');
const conn = require('../config/multipleDbsConnections')
const Schema = mongoose.Schema;

const termoSchema = new Schema({
    _id: {
        required: true,
        type: String,
    },
    url: {
        required: true,
        type: String
    },
    lancadoEm: {
        default: new Date().toLocaleString("en-US", {timezone: 'America/Sao_Paulo'}),
        type: Date,
    },
});

const Termo = conn.main.model("Termo", termoSchema)

module.exports = { Termo, termoSchema };