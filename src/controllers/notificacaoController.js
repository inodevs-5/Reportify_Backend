const nodemailer = require('nodemailer')
const { Usuario } = require("../models/Usuario")
const RO = require("../models/RO")
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
                subject: 'Novo Registro de Ocorrência cadastrado',
                text: `
                    <h1>RO ${ro._id}</h1>
                    <p>Olá senhor(a) ${usuario.nome}, esse email foi enviado para lhe informar que o Registro de Ocorrência ${ro._id}, foi cadastrado com sucesso.
                        Agora basta esperar, que logo um de nossos colaboradores irá resolve-lo, e quando isso ocorrer você receberá uma notificação nesse mesmo e-mail</p>
                        <p><strong>Status atual: </strong>Pendente </p>
                        </br></br>
                        <p>Informações cadastrados do Registro de Ocorrência:</p>
                    <ul>
                        <li><strong>Nome: </strong>${usuario.nome}</li>
                        <li><strong>data do registro: </strong>${ro.dataRegistro}</li>
                        <li><strong>Tipo: </strong>${ro.classDefeito}</li>
                        <li><strong>Título do RO: </strong>${ro.tituloOcorrencia}</li>
                        <li><strong>Descrição: </strong>${ro.descricaoOcorrencia}</li>
                    </ul>
                `
            }

            sendEmail(cadastroRO)
        } catch (error) {
            console.log(error)
            return {error: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"}
        }
    },

    atendido: async (id, adm_id) => {
        try {
            const { _id, dataRegistro, classDefeito, nome, tituloOcorrencia, descricaoOcorrencia } = req.body

            const ro = await RO.findById(_id);

            const usuario = await Usuario.findById(id);

            const usuario_adm = await Usuario.findById(adm_id);
            

            if (!usuario) {
                return { error: 'Usuário não encontrado' };
            }
            
            const RoAtendido = {
                from: process.env.EMAIL,
                to: usuario.email,
                subject: 'Alteração do status do registro de ocorrência',
                html: `
                    <h1>RO ${ro._id}</h1>
                    <p>Olá senhor(a) ${usuario.nome}, esse email foi enviado para lhe informar que o RO ${ro._id}, foi atendido.
                        Entre no aplicativo para confirmar se o atendimente resolve seu problema</p>
                        <p><strong>Status atual: </strong>Atendido</p>
                `
            }

            const RoAtendidoAdm = {
                from: process.env.EMAIL,
                to: usuario_adm.email,
                subject: 'teste de envio de email',
                html:  `
                    <h1>RO ${ro._id}</h1>
                    <p>Olá senhor(a) ${usuario.nome}, esse email foi enviado para lhe informar que o RO ${ro._id} que você atendeu, já foi encaminhado para o relator.</p>
                        <p><strong>Status atual: </strong>Atendido</p>
                `
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
                subject: 'Registro de Ocorrência encerrado',
                html: `
                    <h1>RO ${ro._id}</h1>
                    <p>Olá senhor(a) ${usuario.nome}, esse email foi enviado para lhe informar que o RO ${ro._id}, foi concluído.
                        Qualquer erro entre em contato com algum colaborador via chat</p>
                        <p><strong>Status atual: </strong>Concluído</p>
                `
            }

            const RoFechadoAdm = {
                from: process.env.EMAIL,
                to: usuario_adm.email,
                subject: 'Registro de Ocorrência encerrado',
                html:  `
                <h1>RO ${ro._id}</h1>
                <p>Olá senhor(a) ${usuario.nome}, esse email foi enviado para lhe informar que o RO ${ro._id} que você atendeu, foi fechado, pois atendeu o problema do relator.</p>
                    <p><strong>Status atual: </strong>Concluído</p>
            `
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