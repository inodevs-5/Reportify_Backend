const jwt = require('jsonwebtoken')
const { Usuario } = require('../models/Usuario')

const checkToken = async(req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({msg: "Acesso negado!"})
    }
    
    try {
        const usuarioId = jwt.verify(token, process.env.SECRET)
        const dataUsuario = await Usuario.findById(usuarioId.id) 

        res.locals = {id: dataUsuario._id, perfil: dataUsuario.perfil}
        next()
    } catch (error) {
        res.status(400).json({msg: "Token inválido"})
    }
}

const checkAdmin = (req, res, next) => {
    const { perfil } = res.locals

    if (perfil !== "admin") {
        return res.status(401).json({msg: "Acesso negado!"})
    }

    next()
}

module.exports = {checkToken, checkAdmin}