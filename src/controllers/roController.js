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

    getByRelator : async(req, res) => {
        try {
            const { id } = req.params
            const ros = await RO.find({"relator.id": id})

            res.json(ros)
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },

    getByResponsavel : async(req, res) => {
        try {
            const { id } = req.params
            const ros = await RO.find({"responsavel.id": id})

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
                nomeRelator,
                idRelator, 
                nomeResponsavel, 
                idResponsavel,
                classDefeito, 
                versaoBaseDados, 
                versaoSoftware, 
                equipamento,
                equipPosicao,
                partNumber,
                serialNumber,
                tituloOcorrencia,
                descricaoOcorrencia,
                posGradRelator,
                posGradResponsavel
            } = req.body
            
            if (!contrato) {
                return res.status(422).json({msg: 'O número do contrato é obrigatório.'})
            }
            
            if (!orgao) {
                return res.status(422).json({msg: 'O orgão é obrigatório.'})
            }

            if (!nomeRelator) {
                return res.status(422).json({msg: 'O nome do relator é obrigatório.'})
            }

            if (!nomeResponsavel) {
                return res.status(422).json({msg: 'O nome do responsavel é obrigatório.'})
            }

            if (!tituloOcorrencia) {
                return res.status(422).json({msg: 'O titulo da ocorrência é obrigatório.'})
            }

            if (!posGradRelator) {
                return res.status(422).json({msg: 'O POS./DRAD do relator é obrigatório.'})
            }

            if (!posGradResponsavel) {
                return res.status(422).json({msg: 'O POS./DRAD do responsável é obrigatório.'})
            }

            if (!classDefeito) {
                return res.status(422).json({msg: 'A classe do defeito é obrigatório.'})
            }

            
            if (classDefeito == 'hardware') {
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

            if (classDefeito == 'software') {
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

            const roAnterior = await RO.findOne().sort({_id: -1});

            let id = 1
            if (roAnterior && roAnterior._id) {
                id = roAnterior._id + 1;
            }

            const response = await RO.create({ 
                contrato,
                orgao, 
                _id: id, 
                relator: {
                    id: mongoose.Types.ObjectId(idRelator),
                    nome: nomeRelator,
                    posGrad: posGradRelator
                },
                responsavel: {
                    id:  mongoose.Types.ObjectId(idResponsavel),
                    nome: nomeResponsavel,
                    posGrad: posGradResponsavel
                },
                classDefeito,
                opcoesHardware: {
                    equipamento,
                    equipPosicao,
                    partNumber,
                    serialNumber,
                },
                opcoesSoftware: {
                    versaoBaseDados, 
                    versaoSoftware,
                    logsAnexado
                },
                tituloOcorrencia,
                descricaoOcorrencia,
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

            try {
                const ros = await RO.find({$or: [{tituloOcorrencia: RegExp(search, 'i')}, {_id: search}]})  
                res.json(ros)   
            } catch {
                const ros = await RO.find({tituloOcorrencia: RegExp(search, 'i')})  
                res.json(ros) 
            }

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