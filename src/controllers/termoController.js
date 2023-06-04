const { Termo } = require("../models/Termo")
const { TermoLog } = require("../models/TermoLog")
const { Usuario } = require("../models/Usuario")

const termoController = {

    create: async(req, res) => {
        const { versao, url, lancadoEm } = req.body

        try {
            const termo = new Termo({_id: versao, url, lancadoEm})

            await termo.save()
    
            res.status(201).json({msg: 'Nova versão do termo lançada.', termo})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },

    accept: async(req, res) => {
        const { usuario, versaoTermo } = req.body

        try {
            const usuarioExists = await Usuario.findOne({ _id: usuario})
            if (!usuarioExists) {
                return res.status(422).json({ msg: 'Usuário não encontrado!'})
            }

            const termoExists = await Termo.findOne({ _id: versaoTermo})
            if (!termoExists) {
                return res.status(422).json({ msg: 'Termo não encontrado'})
            }

            const termoLog = new TermoLog({usuario, versaoTermo})

            await termoLog.save()
    
            res.status(201).json({msg: 'Termo aceito.', termoLog})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },

    getLastest: async(req, res) => {
        try {
            const termo = await Termo.findOne().sort({lancadoEm: -1})

            res.status(200).json(termo)
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },

    statusAccept: async(req, res) => {
        const { id } = req.params

        try {
            const latestTermo = await Termo.findOne().sort({lancadoEm: -1})

            const termoAceito = await TermoLog.findOne({usuario: id, versaoTermo: latestTermo._id})

            if (termoAceito) {
                return res.status(200).json({status: true, msg: "Termo já aceito."})
            }

            res.status(200).json({status: false, msg: "Termo ainda não aceito.", termo: latestTermo})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    }
}

module.exports = termoController