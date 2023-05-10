const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const anexoSchema = new Schema({
    nomeAnexo: {
        required: true,
        type: String,
    },
    idAnexo: {
        required: true,
        type: String,
    },
    criadoEm: {
        default: new Date().toLocaleString("en-US", {timezone: 'America/Sao_Paulo'}),
        type: Date,
    },
    _id: false
});

module.exports = { anexoSchema };