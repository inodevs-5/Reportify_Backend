const { Usuario } = require("../models/Usuario")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

// Login user
const loginController = {
    login: async(req, res) => {
        const { email, senha } = req.body

        //validations
        if (!email) {
            return res.status(422).json({ msg: "O Email é obrigatório!"})
        }
        if (!senha) {
            return res.status(422).json({ msg: "A senha é obrigatório!"})
        }

        //check if user exists
        const usuario = await Usuario.findOne({ email: email})

        if (!usuario || !usuario.senha) {
            return res.status(404).json({ msg: "Usuário não encontrado!"})
        }
        
        //check if password match
        const checkSenha = await bcrypt.compare(senha, usuario.senha)

        if(!checkSenha){
            return res.status(422).json({ msg: "Senha inválida!"})
        }

        try {
            const secret = process.env.SECRET

            const token = jwt.sign(
                {
                id: usuario._id
                },
                secret,
            )

            delete usuario._doc.password

            res.status(200).json({msg: 'Autenticação realizada com sucesso!', usuario, token})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    },
}

module.exports = loginController