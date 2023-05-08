const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const anexoSchema = new Schema({
    nomeAnexo: {
        required: false,
        type: String,
    },
    idAnexo: {
        required: false,
        type: String,
    },
    criadoEm: {
        default: new Date().toLocaleString("en-US", {timezone: 'America/Sao_Paulo'}),
        type: Date,
    },
    _id: false
});

module.exports = { anexoSchema };