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
});

module.exports = { anexoSchema };