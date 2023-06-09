require('dotenv').config();
const RO = require("../models/RO")
const mongoose = require('mongoose')
const notificacao = require("./notificacaoController")

let gfs
const connect = mongoose.createConnection(process.env.DB_URL_MAIN, { useNewUrlParser: true, useUnifiedTopology: true });
connect.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "anexos"
    });
});

const roController = {
    
    getAll: async(req, res) => {
        try {
            const ros = await RO.find().populate(['relator.id', 'suporte.colaboradorIACIT.id'])

            res.json(ros)
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },

    getByRelator : async(req, res) => {
        try {
            const { id } = req.params
            const ros = await RO.find({"relator.id": id}).populate(['relator.id', 'suporte.colaboradorIACIT.id']);

            res.json(ros)
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },

    getByAtribuido : async(req, res) => {
        try {
            const { id } = req.params
            const ros = await RO.find({"suporte.colaboradorIACIT.id": id}).populate(['relator.id', 'suporte.colaboradorIACIT.id'])

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
                idRelator, 
                nomeResponsavel, 
                nomeRelator,
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
                posGradResponsavel,
                dataRegistro
            } = req.body
            
            if (!contrato) {
                return res.status(422).json({msg: 'O número do contrato é obrigatório.'})
            }
            
            if (!orgao) {
                return res.status(422).json({msg: 'O orgão é obrigatório.'})
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
                    id: new mongoose.Types.ObjectId(idRelator),
                    posGrad: posGradRelator
                },
                responsavel: {
                    id: new mongoose.Types.ObjectId(idResponsavel),
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
                dataRegistro,
                opcoesSoftware: {
                    versaoBaseDados, 
                    versaoSoftware,
                    logsAnexado
                },
                tituloOcorrencia,
                descricaoOcorrencia,
                // suporte: {
                //     fase: 'pendente'
                // }
            })

            notificacao.criado(idRelator, id, classDefeito, nomeRelator, tituloOcorrencia, descricaoOcorrencia)

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
                const ros = await RO.find({$or: [{tituloOcorrencia: RegExp(search, 'i')}, {_id: search}]}).populate(['relator.id', 'suporte.colaboradorIACIT.id'])  
                res.json(ros)   
            } catch {
                const ros = await RO.find({tituloOcorrencia: RegExp(search, 'i')}).populate(['relator.id', 'suporte.colaboradorIACIT.id'])
                res.json(ros) 
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },

    download: async(req, res) => {
        try {
            const { filename } = req.params
            
            gfs.find({ filename }).toArray((err, files) => {
                if (!files[0] || files.length === 0) {
                    return res.status(200).json({msg: "Arquivo não encontrado!"});
                }

                gfs.openDownloadStreamByName(filename).pipe(res);
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },

    updateCliente: async (req, res) => {
        const id = req.params.id;
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

        const ro = { 
            contrato,
            orgao, 
            _id: id, 
            relator: {
                id: new mongoose.Types.ObjectId(idRelator),
                nome: nomeRelator,
                posGrad: posGradRelator
            },
            responsavel: {
                id: new mongoose.Types.ObjectId(idResponsavel),
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
                //logsAnexado
            },
            tituloOcorrencia,
            descricaoOcorrencia,
        }

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

        const updatedRo = await RO.findByIdAndUpdate(id, ro);

        if(!updatedRo) {
            res.status(404).json({ msg:"Registro de ocorrência não encontrado." });
            return;
        }

        res
        .status(200) 
        .json({ ro, msg: "Registro de ocorrência atualizado com sucesso" });
    },

    get: async (req, res) => {   
        const id = req.params.id;
        try {
          const ro = await RO.findById(id).populate(['relator.id', 'suporte.colaboradorIACIT.id']);
          if (!ro){
            res.status(404).json({ msg:"Registro de ocorrência não encontrado." });
            return;
          }
  
            res.json(ro);
          } catch (error) {
            console.log(error);
          }
        },

    updateSuporte: async (req, res) => {
        const id = req.params.id;
        const ros = await RO.findById(id);

        if (!ros) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }
  
        const {
            fase,  idcolaboradorIACIT, nome, classificacao, defeito, melhoria, outros, justificativaReclassificacao, categoria
        } = req.body

        if (ros.suporte) {
            ros.suporte.fase = fase || ros.suporte.fase;
            ros.suporte.colaboradorIACIT.id = idcolaboradorIACIT || ros.suporte.colaboradorIACIT.id;
            ros.suporte.defeito = defeito || ros.suporte.defeito
            ros.suporte.classificacao = classificacao || ros.suporte.classificacao;
            ros.suporte.melhoria = melhoria || ros.suporte.melhoria;
            ros.suporte.outros = outros || ros.suporte.outros;
            ros.suporte.justificativaReclassificacao = justificativaReclassificacao || ros.suporte.justificativaReclassificacao
            ros.suporte.categoria = categoria || ros.suporte.categoria 
            ros.justificativaReclassificacao = 'Aberto'

            await ros.save()

            res
            .status(200) 
            .json({ ros, msg: "Registro de ocorrência atualizado com sucesso" });
        } else { 
            const ro = {
                suporte: {fase,  colaboradorIACIT:{id: new mongoose.Types.ObjectId(idcolaboradorIACIT)}, classificacao, justificativaReclassificacao, categoria} 
            };

            if (classificacao === 'defeito') {
                ro.suporte.defeito = defeito
            }
            if (classificacao === 'melhoria') {
                ro.suporte.melhoria = melhoria
            }
            if (classificacao === 'outros') {
                ro.suporte.outros = outros
            }

            const updatedRo = await RO.findByIdAndUpdate(id, ro);

            if(!updatedRo) {
                res.status(404).json({ msg:"Registro de ocorrência não encontrado." });
                return;
            }

            res
            .status(200) 
            .json({ updatedRo, msg: "Registro de ocorrência atualizado com sucesso" });
        }
        
        notificacao.atendido(ros.relator.id, id, idcolaboradorIACIT)
    },

    close: async (req, res) => {
        const id = req.params.id;
        const ro = await RO.findById(id);
        const {
            validacaoFechamentoRo, justificativaFechamento
        } = req.body

        if (!validacaoFechamentoRo) {
            return res.status(422).json({msg: 'O status do fechamento é obrigatória.'})
        }

        if(!ro) {
            res.status(404).json({ msg:"Registro de ocorrência não encontrado." });
            return;
        }

        ro.validacaoFechamentoRo = validacaoFechamentoRo
        
        if (validacaoFechamentoRo === 'Recusado') {
            if (justificativaFechamento) {
                ro.justificativaFechamento = justificativaFechamento
                ro.suporte.fase = "andamento"
            } else {
                return res.status(422).json({msg: "Justifique o motivo da rejeição do RO"})
            }
        }

        if (validacaoFechamentoRo === 'Encerrado') {
            ro.suporte.fase = 'concluido'
        }

        ro.save()

        notificacao.fechado(ro.relator.id, id, ro.suporte.colaboradorIACIT.id, validacaoFechamentoRo)

        res
        .status(200) 
        .json({ ro, msg: "Registro de ocorrência atualizado com sucesso" });
    },

    searchRelator: async(req, res) => {
        try {
            const { search, id } = req.params

            try {
                const ros = await RO.find({"relator.id": id, $or: [{tituloOcorrencia: RegExp(search, 'i')}, {_id: search}]}).populate(['relator.id', 'suporte.colaboradorIACIT.id'])
                res.json(ros)   
            } catch {
                const ros = await RO.find({"relator.id": id, tituloOcorrencia: RegExp(search, 'i')}).populate(['relator.id', 'suporte.colaboradorIACIT.id'])
                res.json(ros) 
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },

    searchAtribuido: async(req, res) => {
        try {
            const { search, id } = req.params

            try {
                const ros = await RO.find({"suporte.colaboradorIACIT.id": id, $or: [{tituloOcorrencia: RegExp(search, 'i')}, {_id: search}]}).populate(['relator.id', 'suporte.colaboradorIACIT.id'])  
                res.json(ros)   
            } catch {
                const ros = await RO.find({"suporte.colaboradorIACIT.id": id, tituloOcorrencia: RegExp(search, 'i')}).populate(['relator.id', 'suporte.colaboradorIACIT.id'])
                res.json(ros) 
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },
    
    getImage: (req, res) => {
        gfs.find({ filename: req.params.filename }).toArray((err, files) => {
            if (!files[0] || files.length === 0) {
                return res.status(404).json({
                    msg: 'Arquivo não encontrado',
                });
            }

            res.status(200).json(files[0]);
        });
    }

}

module.exports = roController