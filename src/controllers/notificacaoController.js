const nodemailer = require('nodemailer')
const { Usuario } = require("../models/Usuario")
const RO = require("../models/RO")
require('dotenv').config()

function sendEmail (email) {
    console.log(email)
    const transportador = nodemailer.createTransport({
        host: process.env.HOST_EMAIL,
        port: process.env.PORT_EMAIL,
        service: 'hotmail',
        secure: false,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASS_EMAIL
        }
    })
    transportador.sendMail(email, (err) => {
        if(err) {
            console.log(err)
            return
        }
        console.log('Email enviado com sucesso!')
        // mostrarNumeroNotificacoes()
        // marcarNotificacoesVistas()
    })
}
const emailNotificacao = {
    criado: async (id, _id) => {
        try {
            const usuario = await Usuario.findById(id);

            const ro = await RO.findById(_id).populate(["relator.id"])

            console.log(Usuario.notificacoes) 

            usuario.notificacoes.push({
                idRo: _id,
                mensagem: `Registro de Ocorrência ${ro._id} cadastrado`,
                visualizar: false
            })

            await usuario.save()

            if (!usuario) {
                return { error: 'Usuário não encontrado' };
            }
            
            const cadastroRO = {
                from: `Inodevs <${process.env.USER_EMAIL}>`,
                to: usuario.email,
                subject: 'Novo Registro de Ocorrência cadastrado',
                html: `
                    <h1>RO ${ro._id}</h1>
                    <p>Olá senhor(a) ${ro.relator.id.nome}, esse email foi enviado para lhe informar que o Registro de Ocorrência ${ro._id}, foi cadastrado com sucesso.
                        Agora basta esperar, que logo um de nossos colaboradores irá resolve-lo, e quando isso ocorrer você receberá uma notificação nesse mesmo e-mail</p>
                        <p><strong>Status atual: </strong>Pendente </p>
                        </br></br>
                        <p>Informações cadastrados do Registro de Ocorrência:</p>
                    <ul>
                        <li><strong>Nome: </strong>${ro.relator.id.nome}</li>
                        <li><strong>Tipo: </strong>${ro.classDefeito}</li>
                        <li><strong>Título do RO: </strong>${ro.tituloOcorrencia}</li>
                        <li><strong>Descrição: </strong>${ro.descricaoOcorrencia}</li>
                    </ul> 
                `
            }
            sendEmail(cadastroRO)
         // <li><strong>data do registro: </strong>${ro.dataRegistro}</li>
        } catch (error) {
            console.log(error)
            return {error: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"}
        }
    },

    atendido: async (id, _id, adm_id) => {
        try {
            const ro = await RO.findById(_id);

            const usuario = await Usuario.findById(id);

            const usuario_adm = await Usuario.findById(adm_id);

            usuario.notificacoes.push({
                idRo: _id,
                mensagem: `Registro de Ocorrência ${ro._id} atendido`,
                visualizar: false
            })

            await usuario.save()

            usuario_adm.notificacoes.push({
                idRo: _id,
                mensagem: `Registro de Ocorrência ${ro._id} atendido`,
                visualizar: false
            })

            await usuario_adm.save()

            if (!usuario) {
                return { error: 'Usuário não encontrado' };
            }
            
            const RoAtendido = {
                from: `Inodevs <${process.env.USER_EMAIL}>`,
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
                from: `Inodevs <${process.env.USER_EMAIL}>`,
                to: usuario_adm.email,
                subject: 'teste de envio de email',
                html:  `
                    <h1>RO ${ro._id}</h1>
                    <p>Olá senhor(a) ${usuario_adm.nome}, esse email foi enviado para lhe informar que o RO ${ro._id} que você atendeu, já foi encaminhado para o relator.</p>
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

    fechado: async (id, _id, adm_id) => {
        try {
            const ro = await RO.findById(_id);

            const usuario = await Usuario.findById(id);

            const usuario_adm = await Usuario.findById(adm_id);

            usuario.notificacoes.push({
                idRo: _id,
                mensagem: `Registro de Ocorrência ${ro._id} fechado`,
                visualizar: false
            })

            await usuario.save()

            usuario_adm.notificacoes.push({
                idRo: _id,
                mensagem: `Registro de Ocorrência ${ro._id} fechado`,
                visualizar: false
            })

            await usuario_adm.save()

            if (!usuario || !usuario_adm) {
                return { error: 'Usuário não encontrado' };
            }

            const RoFechado = {
                from: `Inodevs <${process.env.USER_EMAIL}>`,
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
                from: `Inodevs <${process.env.USER_EMAIL}>`,
                to: usuario_adm.email,
                subject: 'Registro de Ocorrência encerrado',
                html:  `
                <h1>RO ${ro._id}</h1>
                <p>Olá senhor(a) ${usuario_adm.nome}, esse email foi enviado para lhe informar que o RO ${ro._id} que você atendeu, foi fechado, pois atendeu o problema do relator.</p>
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

    mostrarNotificacoes: async function mostrarNumeroNotificacoes(req, res)  {
        const { id } = req.params

        const notificacao = await Usuario.findOne({ _id: id});

        let numeroNotificacoes = 0
        for (let n = 0; n < notificacao.notificacoes.length; n++) {
            if (notificacao.notificacoes[n].visualizar === false){
                numeroNotificacoes++
            }
        }
        res.status(200).json({numeroNotificacoes})
    },
    
    marcarNotificacoes: async function marcarNotificacoesVistas(req, res) {
        const { id } = req.body

        const notificacao = await Usuario.findOne({ _id: id});

        for (let n = 0; n < notificacao.notificacoes.length; n++) {
            if (notificacao.notificacoes[n].visualizar === false){
                notificacao.notificacoes[n].visualizar = true
            }
        }

        notificacao.save()
      
        res.status(200).json({notificacao, msg: "Notificações visualizadas com sucesso."})
    }
}



module.exports = emailNotificacao