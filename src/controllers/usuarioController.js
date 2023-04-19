const { Usuario } = require("../models/Usuario")
const bcrypt = require("bcrypt")

const usuarioController = {
    create: async(req, res) => {
        const {nome, email, perfil, senha} = req.body
    
        // validations
        if (!nome) {
            return res.status(422).json({ msg: "Nome é Obrigatorio"})
        }
        if (!email) {
            return res.status(422).json({ msg: "Email é Obrigatorio"})
        }
        if(!senha){
            return res.status(422).json({ msg: "Senha é Obrigatoria"})
        }
    
        // check if user exist
        const usuarioExists = await Usuario.findOne({ email: email})
    
        if (usuarioExists) {
            return res.status(422).json({ msg: 'Por Favor, utilize outro e-mail'})
        }
    
        // create passwor
        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(senha, salt)
    
        // create user
        const usuario = new Usuario({
            nome, 
            email,
            perfil,
            senha: senhaHash,
        })
    
        try {
            await usuario.save()
    
            res.status(201).json({msg: 'Usuário criado com sucesso'})
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})     
        }
    }
}

module.exports = usuarioController