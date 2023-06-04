const nodemailer = require('nodemailer')
const { Usuario } = require("../models/Usuario")
const RO = require("../models/RO")
const { EmailLog } = require("../models/EmailLog")
const mongoose = require('mongoose')
require('dotenv').config()

function sendEmail (email) {
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

            usuario.notificacoes.push({
                idRo: _id,
                mensagem: `Registro de Ocorrência ${ro._id} cadastrado`,
                visualizar: false
            })

            await usuario.save()

            if (!usuario) {
                return { error: 'Usuário não encontrado' };
            }

            if(usuario.email_notificacao === true){
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
            }

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

            if (ro.suporte.fase === 'validacao') {

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

                if (!usuario || !usuario_adm) {
                    return { error: 'Usuário não encontrado' };
                }

                if (Usuario.email_notificacao === true){
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
                } 

            }
        } catch (error) {
            console.log(error)
            return {error: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"}
        }
    },

    fechado: async (id, _id, adm_id, validacaoFechamentoRo) => {
        try {
            const ro = await RO.findById(_id);

            const usuario = await Usuario.findById(id);

            const usuario_adm = await Usuario.findById(adm_id);

            let RoFechado = {
                from: `Inodevs <${process.env.USER_EMAIL}>`,
                to: usuario.email,
                subject: 'Registro de Ocorrência encerrado',
                html: ``
            }

            let RoFechadoAdm = {
                from: `Inodevs <${process.env.USER_EMAIL}>`,
                to: usuario_adm.email,
                subject: 'Registro de Ocorrência encerrado',
                html:  ``
            if (validacaoFechamentoRo === "Encerrado") {

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
              
                if (Usuario.email_notificacao === true){
                    RoFechado.html = `
                        <h1>RO ${ro._id}</h1>
                        <p>Olá senhor(a) ${usuario.nome}, esse email foi enviado para lhe informar que o RO ${ro._id} foi concluído.
                            Qualquer erro entre em contato com algum colaborador via chat.</p>
                            <p><strong>Status atual: </strong>Concluído</p>
                    `

                    RoFechadoAdm.html = `
                        <h1>RO ${ro._id}</h1>
                        <p>Olá senhor(a) ${usuario_adm.nome}, esse email foi enviado para lhe informar que o RO ${ro._id} que você atendeu foi fechado, pois atendeu o problema do relator.</p>
                            <p><strong>Status atual: </strong>Concluído</p>
                    `  
                  
                    sendEmail(RoFechado)
                    sendEmail(RoFechadoAdm)
                }

            } else if (validacaoFechamentoRo === "Recusado") {
              
                usuario.notificacoes.push({
                    idRo: _id,
                    mensagem: `Registro de Ocorrência ${ro._id} fechado`,
                    visualizar: false
                })
    
                await usuario.save()
              
                usuario_adm.notificacoes.push({
                    idRo: _id,
                    mensagem: `Registro de Ocorrência ${ro._id} recusado`,
                    visualizar: false
                })

                await usuario_adm.save()
              
                if (Usuario.email_notificacao === true){
              
                    RoFechado.html = `
                        <h1>RO ${ro._id}</h1>
                        <p>Olá senhor(a) ${usuario.nome}, esse email foi enviado para lhe informar que você recusou o RO ${ro._id} e ele foi enviado novamente para um colaborador fazer a revisão.
                            Qualquer erro entre em contato com algum colaborador via chat.</p>
                            <p><strong>Status atual: </strong>Em andamento</p>
                    `

                    RoFechadoAdm.html = `
                        <h1>RO ${ro._id}</h1>
                        <p>Olá senhor(a) ${usuario_adm.nome}, esse email foi enviado para lhe informar que o RO ${ro._id} que você atendeu, foi recusado pelo relator, pois o problema não foi solucionado.</p>
                        <p>Entre no aplicativo, analise a justificativa do relator, revise o registro de ocorrência e reenvie uma resposta ou, caso necessário, entre em contato com o relator via chat do aplicativo.</p>
                        <p><strong>Status atual: </strong>Em andamento</p>
                    `

                    sendEmail(RoFechado)
                    sendEmail(RoFechadoAdm)
               }
           }

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
    },

    notificacaoEmail: async function notificacaoEmailEnvio(req, res) {
        const { id } = req.body

        const notificacao_email = await Usuario.findOne({ _id: id});

        notificacao_email.email_notificacao = !notificacao_email.email_notificacao

        notificacao_email.save()
        
        res.status(200).json({notificacao_email, msg: "Status do Envio de notificações atualizado com sucesso."})
    },

    accept: async function envioEmail(req, res) {
        try {
            const { id } = req.body

            const notificacao_email = await Usuario.findOne({ _id: id});

            const emailNotif  = notificacao_email.email_notificacao

            const usuario = new mongoose.Types.ObjectId(id)

            const emailLog = new EmailLog({usuario, emailNotif})

            emailLog.save()

            res.status(201).json({msg: 'Status', emailLog})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },
}



module.exports = emailNotificacao