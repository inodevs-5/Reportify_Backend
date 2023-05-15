const mongoose = require("mongoose")

const { Schema } = mongoose

const roSuporteSchema = new Schema ({
        fase: {
            type: String,
            // enum: ['pendente', 'andamento', 'validacao', 'concluido'],
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
            // enum: ['defeito', 'melhoria', 'outros'],
        }, 
        defeito: {
            type: String,
            // enum: ['critico', 'alto', 'baixo'],
        }, 
        melhoria: {
            type: String,
            // enum: ['funcionalidadeexistente', 'funcionalidadenaoexistente'],
        },
        outros: {
            type: String,
            // enum: ['investigacao', 'causaexterna'],
        }, 
        justificativaReclassificacao: {
            type: String,
        },
         categoria: {
            type: String,
        },
    }
)

module.exports = roSuporteSchema