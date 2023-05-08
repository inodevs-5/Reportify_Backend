const mongoose = require("mongoose")

const { Schema } = mongoose

const usuarioSchema = new Schema({
        nome: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        perfil: {
            type: String,
            enum: ['admin', 'cliente'],
            required: true,
            default: 'cliente'
        },
        empresa: {
            type: String,
            required: true
        },
        contato_empresa: {
            type: String,
            required: true
        },
        senha: {
            type: String,
            required: true
        },
        notificacao: {
            type:{            
                destinatario: {
                    type: String,
                    required: false,
                },
                tipo: {
                    type: String,
                    enum: ['criacaoRO', 'roAtendido', 'roFechado'],
                    required: false,
                }, 
                conteudo: {
                    type: String,
                    required: false,
                }
            }
        }
    }
)

const Usuario = mongoose.model("Usuario", usuarioSchema)

module.exports = {
    Usuario,
    usuarioSchema
}