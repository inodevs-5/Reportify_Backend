const mongoose = require('mongoose');
const conn = require('../config/multipleDbsConnections')
const Schema = mongoose.Schema;

const emailLogSchema = new Schema({
    emailNotif: {
        required: true,
        type: Boolean,
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true
    },
    aceitoEm: {
        // default: new Date().toLocaleString("en-US", {timezone: 'America/Sao_Paulo'}),
        default: Date.now(),
        type: Date
    },
});

const EmailLog = conn.main.model("EmailLog", emailLogSchema)

module.exports = { EmailLog, emailLogSchema };