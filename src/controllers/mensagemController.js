const { Mensagem } = require("../models/Mensagem")
const { Usuario } = require("../models/Usuario")


const mensagemController = {
    create: async(req, res) => {
        const {conteudo, destinatario, remetente} = req.body
    
        try {
            // validations
            if (!conteudo) {
                return res.status(422).json({ msg: "Conteudo é Obrigatorio"})
            }
            if (!destinatario) {
                return res.status(422).json({ msg: "Destinatário é Obrigatorio"})
            }
            if(!remetente){
                return res.status(422).json({ msg: "Remetente é Obrigatoria"})
            }
        
            // check if user exist
            const remetenteExists = await Usuario.findOne({ _id: remetente})
        
            if (!remetenteExists) {
                return res.status(422).json({ msg: 'Remetente não encontrado'})
            }

            const destinatarioExists = await Usuario.findOne({ _id: destinatario})
            if (!destinatarioExists) {
                return res.status(422).json({ msg: 'Destinatario não encontrado'})
            }

            const mensagem = new Mensagem({destinatario, remetente, conteudo, mensagem:false})
            

            await mensagem.save()
    
            res.status(201).json({msg: 'Mensagem enviada com sucesso.', mensagem})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },

    get: async(req, res) => {
        const { remetente, destinatario } = req.params
    
        try {
            if (!remetente) {
                return res.status(422).json({ msg: "O remetente é obrigatório!"})
            }
            if(!destinatario) {
                return res.status(422).json({ msg: "O destinatário é obrigatório!"})
            }
        
            const remetenteExists = await Usuario.findOne({ _id: remetente})
            
            const destinatarioExists = await Usuario.findOne({ _id: destinatario})
        
            if (!remetenteExists) {
                return res.status(422).json({ msg: 'O remetente não existe.'})
            }
            if (!destinatarioExists) {
                return res.status(422).json({ msg: 'O destinatário não existe.'})
            }

            const mensagens = await Mensagem.find({$or: [{remetente, destinatario}, {destinatario: remetente, remetente: destinatario}]}).populate(['destinatario', 'remetente']).sort({_id: -1})

            res.status(201).json(mensagens)
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },

    mostrarNotificacoesChat: async function mostrarNumeroNotificacoesChat(req, res)  {
        try {
            const { id } = req.params

            const notificacaoChat = await Mensagem.find({ destinatario: id});

            let numeroNotificacoeschat = 0
            for (let n = 0; n < notificacaoChat.length; n++) {
                if (notificacaoChat[n].mensagem === false){
                    numeroNotificacoeschat++
                }
            }
            res.status(200).json({numeroNotificacoeschat})
        } catch (error) {
            console.log(error)
        }
    },
    
    marcarNotificacoesChat: async function marcarNotificacoesVistasChat(req, res) {
        const { id } = req.body

        const notificacaoChat = await Mensagem.find({ destinatario: id});

        for (let n = 0; n < notificacaoChat.length; n++) {
            if (notificacaoChat[n].mensagem === false){
                notificacaoChat[n].mensagem = true
            }
            notificacaoChat[n].save()
        }
      
        res.status(200).json({notificacaoChat, msg: "Notificações visualizadas com sucesso."})
    }

}





module.exports = mensagemController