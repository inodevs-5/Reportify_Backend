const mongoose = require("mongoose")
const roSuporteSchema = require("./RoSuporte")
const { empresaSchema } = require("./Empresa")
const { anexoSchema } = require("./Anexo")

const { Schema } = mongoose

const roSchema = new Schema({

        numroOcorrencia: {
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
            type: String,
            required: true
        },
        horaRegistro: {
            type: String,
            required: true,
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
            }
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
            }
        },
        tituloOcorrencia : {
            type: String,
            required: true,            
        },
        descricaoOcorrencia : {
            type: String,
        },
        relator: {
            _id: { 
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
        responsavel: {
            type: {
                _id: { 
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
            }
        },
        suporte: {
            type: roSuporteSchema,
        }
    },
)

const RO = mongoose.model("RO", roSchema)

module.exports = RO
