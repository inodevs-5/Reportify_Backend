const RO = require("../models/RO")
const { Usuario } = require("../models/Usuario")

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const dashboardController = {

    getData: async(req, res) => {
        try {
            const { date, user } = req.params

            const [mesFiltro, anoFiltro] = date.split(' de ')

            let ros = []
            if (user === 'geral') {
                ros = await RO.find().sort({dataRegistro: -1})
            } else {
                const usuario = await Usuario.findOne({_id: user})

                if (usuario.perfil === 'cliente') {
                    ros = await RO.find({'relator.id': user}).sort({dataRegistro: -1})
                } else {
                    ros = await RO.find({'suporte.colaboradorIACIT.id': user}).sort({dataRegistro: -1})
                }   
            }

            let total = 0
            let aberto = 0
            let andamento = 0
            let fechado = 0

            for (let i = 0; i < ros.length; i++) {
                const ro = ros[i]
                const mes = ro.dataRegistro.getMonth()
                const ano = String(ro.dataRegistro.getFullYear())

                if (date) {
                    if (meses[mes] === mesFiltro && ano === anoFiltro) {
                        if (!ro.suporte || ro.suporte.fase === 'pendente') {
                            aberto++
                        } else if (ro.suporte.fase === 'andamento' || ro.suporte.fase === 'validacao') {
                            andamento++
                        } else if (ro.suporte.fase === 'concluido') {
                            fechado++
                        }
                        total++
                    }
                }
            }

            res.status(200).json({total, aberto, andamento, fechado})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },

    getDataChartLine: async(req, res) => {
        try {
            const { date, user } = req.params

            const [mesFiltro, anoFiltro] = date.split(' de ')

            let ros = []
            if (user === 'geral') {
                ros = await RO.find().sort({dataRegistro: -1})
            } else {
                const usuario = await Usuario.findOne({_id: user})

                if (usuario.perfil === 'cliente') {
                    ros = await RO.find({'relator.id': user}).sort({dataRegistro: -1})
                } else {
                    ros = await RO.find({'suporte.colaboradorIACIT.id': user}).sort({dataRegistro: -1})
                }   
            }

            const diasDoMes = new Date(anoFiltro, meses.indexOf(mesFiltro) + 1, 0).getDate();
            let fechado = []
            let total = []
            for (let i = 1; i <= diasDoMes; i++) {
                fechado.push({ label: i, value: 0})
                total.push({ label: i, value: 0})
            }

            for (let i = 0; i < ros.length; i++) {
                const ro = ros[i]
                const dia = ro.dataRegistro.getDate()
                const mes = ro.dataRegistro.getMonth()
                const ano = String(ro.dataRegistro.getFullYear())

                if (date) {
                    if (meses[mes] === mesFiltro && ano === anoFiltro) {
                        if (ro.suporte && ro.suporte.fase === 'concluido') {
                            fechado[dia-1].value++
                        }
                        total[dia-1].value++
                    }
                }
            }

            res.status(200).json({total, fechado})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },

    getDates: async(req, res) => {
        try {
            const ros = await RO.find().sort({dataRegistro: -1})

            const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

            const dates = []
            for (let i = 0; i < ros.length; i++) {
                const ro = ros[i]
                const mes = ro.dataRegistro.getMonth()
                const ano = ro.dataRegistro.getFullYear()

                if (dates.indexOf(`${meses[mes]} de ${ano}`) === -1) {
                    dates.push(`${meses[mes]} de ${ano}`)
                }
            }

            res.status(200).json(dates)
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },
}

module.exports = dashboardController