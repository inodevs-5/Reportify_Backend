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

            const mensagem = new Mensagem({destinatario, remetente, conteudo})

            await mensagem.save()
    
            res.status(201).json({msg: 'Mensagem enviada com sucesso.', mensagem})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },

    get: async(req, res) => {
        const { usuario1, usuario2 } = req.params
    
        try {
            // validations
            if (!usuario1 || !usuario2) {
                return res.status(422).json({ msg: "É obrigatório ter dois usuários."})
            }
        
            // check if user exist
            const usuario1Exists = await Usuario.findOne({ _id: usuario1})
            
            const usuario2Exists = await Usuario.findOne({ _id: usuario2})
        
            if (!usuario1Exists || !usuario2Exists) {
                return res.status(422).json({ msg: 'Algum usuário não foi encontrdo.'})
            }

            const mensagens = Mensagem.find()

            res.status(201).json(mensagens)
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },
}





module.exports = mensagemController