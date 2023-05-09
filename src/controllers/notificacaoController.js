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
                subject: 'teste de envio de email',
                html: `
                    <h1>O RO ${ro._id} </h1>
                    <p>Você acabou de ser cadastrado no aplicativo Reportify por um administrador do sistema. Após instalar o aplicativo no seu celular, clique <a href="http://reportify-app-inodevs-2023/senha/${usuario._id}">aqui</a> para definir a sua senha e conseguir se autenticar no aplicativo.</p>
                    <p>Além disso, confira abaixo as suas informações que foram salvas no nosso banco de dados:</p>
                    <ul>
                        <li><strong>Nome: </strong>${usuario.nome}</li>
                        <li><strong>E-mail: </strong>${ro.dataRegistro}</li>
                        <li><strong>Empresa: </strong>${ro.classDefeito}</li>
                        <li><strong>Contato da Empresa: </strong>${ro.tituloOcorrencia}</li>
                        <li><strong>Contato da Empresa: </strong>${ro.descricaoOcorrencia}</li>
                    </ul>
                    <p>Estes são seus dados no sistema. Em relação a sua senha que ainda será definida por você, ela será completamente criptografada antes de ser armazenada. Caso queira alterar qualquer informação que está no nosso banco de dados, você pode enviar um e-mail de solicitação para esse mesmo endereço.</p>
                `
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