const nodemailer = require('nodemailer')
const { Usuario } = require("../models/Usuario")
require('dotenv').config()

const sendEmail = () => {
    const transportador = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        service: 'hotmail',
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.SENHA
        }
    })

    transportador.sendMail(email, (err) => {
        if(err) {
            console.log(err)
            return
        }
        console.log('Email enviado com sucesso!')
    })
}

const emailNotificacao = {
    criado: async (id) => {
        try {
            const usuario = await Usuario.findById(id);

            if (!usuario) {
                return { error: 'Usuário não encontrado' };
            }
            
            const cadastroRO = {
                from: process.env.EMAIL,
                to: usuario.email,
                subject: 'teste de envio de email',
                text: 'Ro criado'
            }

            sendEmail(cadastroRO)
        } catch (error) {
            console.log(error)
            return {error: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"}
        }
    },

    atendido: async (id, adm_id) => {
        try {
            const usuario = await Usuario.findById(id);

            const usuario_adm = await Usuario.findById(adm_id);
            

            if (!usuario) {
                return { error: 'Usuário não encontrado' };
            }
            
            const RoAtendido = {
                from: process.env.EMAIL,
                to: usuario.email,
                subject: 'teste de envio de email',
                text: 'RO atendido'
            }

            const RoAtendidoAdm = {
                from: process.env.EMAIL,
                to: usuario_adm.email,
                subject: 'teste de envio de email',
                text: 'RO atendido enviado'
            }

            sendEmail(RoAtendido)

            sendEmail(RoAtendidoAdm)
        } catch (error) {
            console.log(error)
            return {error: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"}
        }
    },

    fechado: async (id, adm_id) => {
        try {
            const usuario = await Usuario.findById(id);

            const usuario_adm = await Usuario.findById(adm_id);

            if (!usuario || !usuario_adm) {
                return { error: 'Usuário não encontrado' };
            }
            
            const RoFechado = {
                from: process.env.EMAIL,
                to: usuario.email,
                subject: 'teste de envio de email',
                text: 'Ro fechado'
            }

            const RoFechadoAdm = {
                from: process.env.EMAIL,
                to: usuario_adm.email,
                subject: 'teste de envio de email',
                text: 'Ro fechado adm'
            }

            sendEmail(RoFechado)

            sendEmail(RoFechadoAdm)
        } catch (error) {
            console.log(error)
            return {error: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"}
        }
    },
}

module.exports = emailNotificacao