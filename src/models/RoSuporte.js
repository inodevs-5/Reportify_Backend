const mongoose = require("mongoose")

const { Schema } = mongoose

const roSuporteSchema = new Schema ({
        fase: {
            type: String,
            enum: ['pendente', 'em andamento', 'aguardando validacao', 'concluido'],
            required: true,
            default: 'pendente'
        },
        colaboradorIACIT: {
            type: {
                id: { 
                    type: Schema.Types.ObjectId, 
                    ref: 'Usuario' ,
                    required: true
                },
                nome: {
                    type: Schema.Types.ObjectId, 
                    ref: 'Usuario' ,
                    required: true
                },
                _id: false
            },
        },
        procedTecnicos : {
            type: String,
        },
        dataRecebRo: {
            type: String,
        },
        horaRecebRo: {
            type: String,
        },
        classificacao: {
            type: String,
            enum: ['defeito', 'melhoria', 'outros'],
        }, 
        defeito: {
            type: String,
            enum: ['Crítico', 'alto', 'baixo'],
        }, 
        melhoria: {
            type: String,
            enum: ['Funcionalidade existente', 'Funcionalidade não existente'],
        },
        outros: {
            type: String,
            enum: ['Investigação', 'Causa externa'],
        }, 
        justificativaReclassificacao: {
            type: String,
        },
        validacaoFechamentoRo: {
            type: String,
            enum: ['Encerrado', 'Aberto'],
        },
         categoria: {
            type: String,
        },
    }
)

module.exports = roSuporteSchema