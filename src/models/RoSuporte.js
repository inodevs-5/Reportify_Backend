const mongoose = require("mongoose")
const {empresaSchema} = require('./Empresa')
const {usuarioSchema} = require('./Usuario')

const { Schema } = mongoose

const roSuporteSchema = new Schema ({
        fase: {
            type: String,
            enum: ['pendente', 'em andamento', 'concluido'],
            required: true,
            default: 'pendente'
        },
        colaboradorIACIT: {
            type: {
                id: { 
                    type: Schema.Types.ObjectId, 
                    ref: 'Usuario' ,
                    required: true,
                },
                nome: {
                    type: String, 
                    ref: 'Usuario',
                    required: true 
                },
            },
            required: true,
        },
        procedTecnicos : {
            type: String,
            required: true
        },
        dataRecebRo: {
            type: String,
            required: true
        },
        horaRecebRo: {
            type: String,
            required: true
        },
        classificacao: {
            type: String,
            enum: ['defeito', 'melhoria', 'outros'],
            required: true,
            default: 'defeito'
        }, 
        defeito: {
            type: String,
            enum: ['Crítico', 'alto', 'baixo'],
            required: true,
            default: 'Crítico'
        }, 
        melhoria: {
            type: String,
            enum: ['Funcionalidade existente', 'Funcionalidade não existente'],
            required: true,
            default: 'Funcionalidade existente'
        },
        outros: {
            type: String,
            enum: ['Investigação', 'Causa externa'],
            required: true,
        }, 
        justificativaReclassificacao: {
            type: String,
            required: true
        },
        validacaoFechamentoRo: {
            type: String,
            enum: ['Encerrado', 'Aberto'],
            required: true,
            default: 'Aberto'
        },
         categoria: {
            type: String,
            required: true
        },
    }
)

module.exports = roSuporteSchema