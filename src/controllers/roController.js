const RO = require("../models/RO")

const roController = {
    
    getAll: async(req, res) => {
        try {
            const ros = await RO.find()

            res.json(ros)
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },

    create: async (req, res) => {
        try {
            const { 
                contrato,
                orgao, 
                fase, 
                dataRegistro, 
                horaRegistro, 
                numroOcorrencia, 
                nomeRelator, 
                nomeResponsavel, 
                colaboradorIACIT, 
                class_defeito, 
                versaoBaseDados, 
                versaoSoftware, 
                logsAnexado,
                equipamento,
                equipPosicao,
                partNumber,
                serialNumber,
                tituloOcorrencia,
                descricaoOcorrencia,
                procedTecnicos,
            } = req.body

            if (!contrato) {
                return res.status(422).json({msg: 'O número do contrato é obrigatório.'})
            }
            
            if (!orgao) {
                return res.status(422).json({msg: 'O orgão é obrigatório.'})
            }
            
            if (!dataRegistro) {
                return res.status(422).json({msg: 'A data de registro é obrigatório para o campo.'})
            }

            if (!horaRegistro) {
                return res.status(422).json({msg: 'A hora do registro é obrigatório para o campo.'})
            }

            
            if (!numroOcorrencia) {
                return res.status(422).json({msg: 'O número da ocorrência é obrigatório para o campo.'})
            }

            if (!nomeRelator) {
                return res.status(422).json({msg: 'O nome do relator é obrigatório para o campo.'})
            }

            if (!nomeResponsavel) {
                return res.status(422).json({msg: 'O nome do responsavel é obrigatório para o campo.'})
            }

            if (!colaboradorIACIT) {
                return res.status(422).json({msg: 'O nome do colaborador IACIT é obrigatório para o campo.'})
            }

            if (!tituloOcorrencia) {
                return res.status(422).json({msg: 'O titulo da ocorrência é obrigatório para o campo.'})
            }

            if (!descricaoOcorrencia) {
                return res.status(422).json({msg: 'A descrição da ocorrência é obrigatório para o campo.'})
            }

            if (!procedTecnicos) {
                return res.status(422).json({msg: 'Os procedimentos tecnicos são obrigatórios para o campo.'})
            }


            const response = await RO.create({ 
                contrato,
                orgao, 
                fase, 
                dataRegistro, 
                horaRegistro, 
                numroOcorrencia, 
                nomeRelator, 
                nomeResponsavel, 
                colaboradorIACIT, 
                class_defeito, 
                versaoBaseDados, 
                versaoSoftware, 
                logsAnexado,
                equipamento,
                equipPosicao,
                partNumber,
                serialNumber,
                tituloOcorrencia,
                descricaoOcorrencia,
                procedTecnicos,
            })

            res.status(201).json({response, msg: "Registro de Ocorrência criado com sucesso!"})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },
}

module.exports = roController