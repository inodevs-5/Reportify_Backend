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
        default: Date.now(),
        type: Date,
    },
    _id: false
});

module.exports = { anexoSchema };