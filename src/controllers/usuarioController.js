const { Usuario } = require("../models/Usuario")
const { Crypto } = require("../models/cryptoModel");
const bcrypt = require("bcrypt")
const CryptoJS = require("crypto-js");

const usuarioController = {
  create: async(req, res) => {
    const {nome, email, perfil, empresa, contato_empresa, senha} = req.body

    // validations
    if (!nome) {
      return res.status(422).json({ msg: "Nome é Obrigatorio"})
    }
    if (!email) {
      return res.status(422).json({ msg: "Email é Obrigatorio"})
    }
    if (!empresa) {
      return res.status(422).json({ msg: "Empresa é Obrigatorio"})
    }
    if (!contato_empresa) {
      return res.status(422).json({ msg: "Contato_empresa é Obrigatorio"})
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

    // generete cryptoKey
    const cryptoKey = CryptoJS.lib.WordArray.random(32);

    // create user
    const usuario = new Usuario({
      nome,
      email,
      perfil,
      empresa,
      contato_empresa,
      senha: senhaHash,
    });

    const crypto = new Crypto({
      cryptoKey: cryptoKey.toString(),
      usuario: usuario._id
    });

    try {
      await usuario.save()
      await crypto.save();

      res.status(201).json({msg: `Usuário criado com sucesso `}) // TODO retornar id
    } catch (error) {
      console.log(error)
      res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { nome, email, perfil, empresa, contato_empresa, senha } = req.body;

    try {
        // find user by id
      const usuario = await Usuario.findById(id);

      if (!usuario) {
          return res.status(404).json({ msg: 'Usuário não encontrado' });
      }

      // update user fields
      usuario.nome = nome || usuario.nome;
      usuario.email = email || usuario.email;
      usuario.perfil = perfil || usuario.perfil;
      usuario.empresa = empresa || usuario.empresa;
      usuario.contato_empresa = contato_empresa || usuario.contato_empresa;

      if (senha) {
        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(senha, salt);
        usuario.senha = senhaHash;
      }

      // save updated user
      await usuario.save();
      res.status(200).json({ msg: 'Usuário atualizado com sucesso' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
    }
  },

  show: async (req, res) => {
    const { id } = req.params;

    try {
      const usuario = await Usuario.findById(id);

      if (!usuario) {
          return res.status(404).json({ msg: 'Usuário não encontrado' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
    }
  },

  getAll: async(req, res) => {
    try {
      const usuarios = await Usuario.find()

      res.json(usuarios)
    } catch (error) {
      console.log(error)
      res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    try {
      // find user by id
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
      }

        // find the user's encryption key
      const cryptoKey = await Crypto.findOne({ usuario: id });
      if (!cryptoKey) {
        return res.status(404).json({ msg: 'key de criptografia não encontrada para o usuário.' });
      }

      const userData = {
        nome: usuario.nome,
        email: usuario.email,
        // perfil: usuario.perfil,
        empresa: usuario.empresa,
        contato_empresa: usuario.contato_empresa,
        senha: usuario.senha,
      };
      console.log("--------------", userData)

      // Criptografar cada dado do usuário separadamente
      const encryptedName = encryptUserDataField(userData.nome, cryptoKey);
      const encryptedEmail = encryptUserDataField(userData.email, cryptoKey);
      // const encryptedRole = encryptUserDataField(userData.perfil, cryptoKey);
      const encrypteCompany = encryptUserDataField(userData.empresa, cryptoKey);
      const encrypteCompanyContact = encryptUserDataField(userData.contato_empresa, cryptoKey);
      const encryptePassword = encryptUserDataField(userData.senha, cryptoKey);

      // update user fields
      usuario.nome = encryptedName;
      usuario.email = encryptedEmail;
      // usuario.perfil = encryptedRole;
      usuario.empresa = encrypteCompany;
      usuario.contato_empresa = encrypteCompanyContact;
      usuario.senha = encryptePassword;

      // save updated user
      await usuario.save();
      res.status(200).json({ msg: 'Os dados do usuário foram criptografados' });

      // Excluir a chave de criptografia após criptografar os dados
      deleteCryptographicKey(chaveCriptografia.chave);

      console.log('Dados criptografados:', encryptedData);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
    }
  }
}

  // Função para criptografar os dados do usuário
  function encryptUserDataField(data, cryptoKey) {
    console.log("--------------------------", data, cryptoKey.cryptoKey)
    const encryptedData = CryptoJS.AES.encrypt(data, cryptoKey.cryptoKey).toString();

    return encryptedData;
  }

  // Função para excluir a chave de criptografia
  function deleteCryptographicKey(cryptoKey) {
  // Excluir a chave de criptografia do MongoDB usando o Mongoose
  cryptoKey.findOneAndDelete({ key: cryptoKey }, (err) => {
      if (err) {
        console.error('Erro ao excluir chave de criptografia:', err);
      } else {
        console.log('chave de criptografia excluída com sucesso.');
      }
    });
  }

module.exports = usuarioController
