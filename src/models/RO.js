const mongoose = require("mongoose")
const {empresaSchema} = require('./Empresa')
const {usuarioSchema} = require('./Usuario')
const { anexoSchema } = require("./Anexo")

const { Schema } = mongoose

const roSchema = new Schema({

        id_ro: {
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
        fase: {
            type: String,
            enum: ['pendente', 'em andamento', 'concluido'],
            required: true,
            default: 'pendente'
        }, 
        dataRegistro: {
            type: String,
            required: true
        },
        horaRegistro: {
            type: String,
            required: true,
        },
        numroOcorrencia: {
            type: String,
            required: true,
        },
        nomeRelator: {
            type: String,
            required: true,
        },
        nomeResponsavel: {
            type: String,
            required: true,
        },
        colaboradorIACIT: {
            type: String,
            required: true,
        },
        class_defeito: {
            type: String,
            enum: ['hardware', 'software'],
            required: true,
            default: 'hardware'
        },
        //Opções softaware
        versaoBaseDados: {
            type: String,
        },
        versaoSoftware: {
            type: String,
        },
        logsAnexado: {
            type: [anexoSchema]
        },
        //Opções Hardware
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
        //-----
        tituloOcorrencia : {
            type: String,
            required: true,
            
        },
        descricaoOcorrencia : {
            type: String,
            required: true,
            
        },
        procedTecnicos : {
            type: String,
            required: true,
        },
    },  { timestamps: true }
)

const RO = mongoose.model("RO", roSchema)

module.exports = RO
