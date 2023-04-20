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
                    type: String, 
                    ref: 'Usuario',
                    required: true 
                },
                _id: false
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
            default: 'Crítico'
        }, 
        melhoria: {
            type: String,
            enum: ['Funcionalidade existente', 'Funcionalidade não existente'],
            default: 'Funcionalidade existente'
        },
        outros: {
            type: String,
            enum: ['Investigação', 'Causa externa'],
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