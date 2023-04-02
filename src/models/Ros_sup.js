const mongoose = require("mongoose")
const {empresaSchema} = require('./Empresa')
const {usuarioSchema} = require('./Usuario')

const { Schema } = mongoose

const roSchema = new Schema ({
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
        //Opção defeito
        defeito: {
            type: String,
            enum: ['Crítico', 'alto', 'baixo'],
            required: true,
            default: 'Crítico'
        }, 
        //Opçao melhoria
        melhoria: {
            type: String,
            enum: ['Funcionalidade existente', 'Funcionalidade não existente'],
            required: true,
            default: 'Funcionalidade existente'
        },
        //Opção outros
        outros: {
            type: String,
            enum: ['Investigação', 'Causa externa'],
            required: true,
            default: 'Crítico'
        }, 
        justificativaReclassificacao: {
            type: String,
            required: true
        },
        validacaoFechamentoRo: {
            type: String,
            required: true
        },
         categoria: {
            type: String,
            required: true
        }
    }, { timestamps: true }
    )
    

    const Ros_sup = mongoose.model("Ros_sup", rossupSchema)

module.exports = RO