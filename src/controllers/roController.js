const RO = require("../models/RO")
const mongoose = require('mongoose')

let gfs
const connect = mongoose.createConnection(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
connect.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "anexos"
    });
});

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
                nomeRelator, 
                nomeResponsavel, 
                colaboradorIACIT, 
                class_defeito, 
                versaoBaseDados, 
                versaoSoftware, 
                equipamento,
                equipPosicao,
                partNumber,
                serialNumber,
                tituloOcorrencia,
                descricaoOcorrencia,
                procedTecnicos,
                posGradRelator,
                posGradResponsavel
            } = req.body
            
            if (!contrato) {
                return res.status(422).json({msg: 'O número do contrato é obrigatório.'})
            }
            
            if (!orgao) {
                return res.status(422).json({msg: 'O orgão é obrigatório.'})
            }
            
            // if (!dataRegistro) {
            //     return res.status(422).json({msg: 'A data de registro é obrigatório para o campo.'})
            // }

            // if (!horaRegistro) {
            //     return res.status(422).json({msg: 'A hora do registro é obrigatório para o campo.'})
            // }
            // if (!numroOcorrencia) {
            //     return res.status(422).json({msg: 'O número da ocorrência é obrigatório para o campo.'})
            // }

            if (!nomeRelator) {
                return res.status(422).json({msg: 'O nome do relator é obrigatório.'})
            }

            if (!nomeResponsavel) {
                return res.status(422).json({msg: 'O nome do responsavel é obrigatório.'})
            }

            // if (!colaboradorIACIT) {
            //     return res.status(422).json({msg: 'O nome do colaborador IACIT é obrigatório.'})
            // }

            if (!tituloOcorrencia) {
                return res.status(422).json({msg: 'O titulo da ocorrência é obrigatório.'})
            }

            // if (!descricaoOcorrencia) {
            //     return res.status(422).json({msg: 'A descrição da ocorrência é obrigatório.'})
            // }

            if (!posGradRelator) {
                return res.status(422).json({msg: 'O POS./DRAD do relator é obrigatório.'})
            }

            if (!posGradResponsavel) {
                return res.status(422).json({msg: 'O POS./DRAD do responsável é obrigatório.'})
            }

            // if (!procedTecnicos) {
            //     return res.status(422).json({msg: 'Os procedimentos tecnicos são obrigatórios.'})
            // }

            if (!class_defeito) {
                return res.status(422).json({msg: 'A classe do defeito é obrigatório.'})
            }

            
            if (class_defeito == 'hardware') {
                if (!equipamento) {
                    return res.status(422).json({msg: 'O equipamento equipamento é obrigatório.'})
                }
    
                if (!equipPosicao) {
                    return res.status(422).json({msg: 'A posição do equipamento da ocorrência é obrigatório.'})
                }
    
                if (!partNumber) {
                    return res.status(422).json({msg: 'O Part Number é obrigatório.'})
                }
    
                if (!serialNumber) {
                    return res.status(422).json({msg: 'O Serial Number é obrigatório.'})
                }
            }

            if (class_defeito == 'software') {
                if (!versaoBaseDados) {
                    return res.status(422).json({msg: 'A versão da base de dados é obrigatória.'})
                }
    
                if (!versaoSoftware) {
                    return res.status(422).json({msg: 'A versão do software é obrigatória.'})
                }
            }

            logsAnexado = []
            if (req.files) {
                req.files.forEach(async e => {
                    let anexo = {
                        nomeAnexo: e.filename,
                        idAnexo: e.id,
                    };
                    logsAnexado.push(anexo)
                });
            }

            const date = new Date()

            const dataRegistro = date.getDate() + '/' + (date.getMonth() + 1) + '/'+ date.getFullYear()
            const horaRegistro = (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes() + ':' + date.getSeconds()

            const roAnterior = await RO.findOne().sort({numroOcorrencia: -1});

            let numroOcorrencia = 1
            if (roAnterior && roAnterior.numroOcorrencia) {
                numroOcorrencia = roAnterior.numroOcorrencia + 1;
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
                equipamento,
                equipPosicao,
                partNumber,
                serialNumber,
                tituloOcorrencia,
                descricaoOcorrencia,
                procedTecnicos,
                logsAnexado,
                posGradRelator,
                posGradResponsavel
            })

            res.status(201).json({response, msg: "Registro de Ocorrência criado com sucesso!"})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },

    search: async(req, res) => {
        try {
            const { search } = req.params

            const ros = await RO.find({tituloOcorrencia: RegExp(search, 'i')})

            res.json(ros)
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },

    download: async(req, res) => {
        try {
            const { id } = req.params
            
            gfs.find({ _id: new mongoose.Types.ObjectId(id) }).toArray((err, files) => {
                if (!files[0] || files.length === 0) {
                    return res.status(200).json({msg: "Arquivo não encontrado!"});
                }

                gfs.openDownloadStream(new mongoose.Types.ObjectId(id)).pipe(res);
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },
}

module.exports = roController