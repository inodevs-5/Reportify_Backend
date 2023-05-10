const mongoose = require("mongoose")
const roSuporteSchema = require("./RoSuporte")
const { empresaSchema } = require("./Empresa")
const { anexoSchema } = require("./Anexo")
const conn = require('../config/multipleDbsConnections')

const { Schema } = mongoose

const roSchema = new Schema({

        _id: {
            type: Number,
            required: true
        },
        contrato: {
            type: String,
            required: true
        },
        orgao: {
            type: String,
            required: true
        },
        dataRegistro: {
            type: Date,
            required: true,
            default: new Date().toLocaleString("en-US", {timezone: 'America/Sao_Paulo'})
        },
        classDefeito: {
            type: String,
            enum: ['hardware', 'software'],
            required: true,
        },
        opcoesSoftware: {
            type: {
                versaoBaseDados: {
                    type: String,
                },
                versaoSoftware: {
                    type: String,
                },
                logsAnexado: {
                    type: [anexoSchema]
                },
            },
            _id: false
        },
        opcoesHardware: {
            type: {
                equipamento: {
                    type: String,
                },
                equipPosicao : {
                    type: String,
                },
                partNumber : {
                    type: String,
                },
                serialNumber : {
                    type: String,
                },
            },
            _id: false
        },    
        tituloOcorrencia : {
            type: String,
            required: true,            
        },
        descricaoOcorrencia : {
            type: String,
        },
        relator: {
            type: {
                id: { 
                    type: Schema.Types.ObjectId, 
                    ref: 'Usuario',
                    required: true
                },
                nome: {
                    type: String, 
                    ref: 'Usuario',
                    required: true
                },
                posGrad: {
                    type: String, 
                    required: true
                }
            },
            require: true,
            _id: false
        }, 
        responsavel: {
            type: {
                id: { 
                    type: Schema.Types.ObjectId, 
                    ref: 'Usuario',
                    required: true
                },
                nome: {
                    type: String, 
                    ref: 'Usuario',
                    required: true
                },
                posGrad: {
                    type: String, 
                    required: true
                }
            },
            _id: false
        },
        suporte: {
            type: roSuporteSchema,
            _id: false
        }
    },
)

const RO = conn.main.model("RO", roSchema)

module.exports = RO
