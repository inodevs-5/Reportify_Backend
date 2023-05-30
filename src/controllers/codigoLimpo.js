const transporter = require("../config/emailConfig");
const { Usuario } = require("../models/Usuario");
const { Crypto } = require("../models/cryptoModel");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");

const usuarioController = {
  create: async (req, res) => {
    const { nome, email, perfil, empresa, contato_empresa } = req.body;

    try {
      validateFields(nome, email, empresa, contato_empresa);

      const usuarioExists = await checkIfUsuarioExists(email);
      if (usuarioExists) {
        return res.status(422).json({ msg: "Por Favor, utilize outro e-mail" });
      }

      const cryptoKey = generateCryptoKey();

      const usuario = createUsuario(nome, email, perfil, empresa, contato_empresa);
      const crypto = createCrypto(cryptoKey, usuario._id);

      await saveUsuario(usuario);
      await saveCrypto(crypto);

      sendEmail(usuario.email, usuario._id);

      res.status(201).json({ msg: "Usuário criado com sucesso" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { nome, email, perfil, empresa, contato_empresa } = req.body;

    try {
      const usuario = await findUsuarioById(id);
      if (!usuario) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      updateUsuarioFields(usuario, nome, email, perfil, empresa, contato_empresa);

      await saveUsuario(usuario);
      res.status(200).json({ msg: "Usuário atualizado com sucesso" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
    }
  },

  show: async (req, res) => {
    const { id } = req.params;

    try {
      const usuario = await findUsuarioById(id);
      if (!usuario) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
    }
  },

  getAll: async (req, res) => {
    try {
      const usuarios = await findAllUsuarios();
      const response = await getResponseWithCryptos(usuarios);

      res.json(response);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!" });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    try {
      const usuario = await findUsuarioById(id);
      if (!usuario) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      const crypto = await findCryptoByUsuarioId(id);
      if (!crypto) {
        return res
          .status(404)
          .json({ msg: "key de criptografia não encontrada para o usuário." });
      }

      await deleteCrypto(crypto);
      await deleteUsuario(usuario);

      res.status(200).json({ msg: "Usuário excluído com sucesso" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
    }
  },

  validateFields: (nome, email, empresa, contato_empresa) => {
    if (!nome || !email || !empresa || !contato_empresa) {
      throw new Error("Por favor, preencha todos os campos obrigatórios");
    }
  },

  checkIfUsuarioExists: async (email) => {
    const usuario = await Usuario.findOne({ email });
    return usuario !== null;
  },

  generateCryptoKey: () => {
    return CryptoJS.lib.WordArray.random(16).toString();
  },

  createUsuario: (nome, email, perfil, empresa, contato_empresa) => {
    const usuario = new Usuario({
      nome,
      email,
      perfil,
      empresa,
      contato_empresa,
    });
    return usuario;
  },

  createCrypto: (cryptoKey, usuarioId) => {
    const crypto = new Crypto({
      key: cryptoKey,
      usuario: usuarioId,
    });
    return crypto;
  },

  saveUsuario: async (usuario) => {
    await usuario.save();
  },

  saveCrypto: async (crypto) => {
    await crypto.save();
  },

  sendEmail: async (email, usuarioId) => {
    const mailOptions = {
      from: "seuemail@gmail.com",
      to: email,
      subject: "Confirmação de cadastro",
      html: `Seu usuário foi criado com sucesso! Seu ID de usuário é: ${usuarioId}`,
    };

    await transporter.sendMail(mailOptions);
  },

  findUsuarioById: async (id) => {
    const usuario = await Usuario.findById(id);
    return usuario;
  },

  updateUsuarioFields: (usuario, nome, email, perfil, empresa, contato_empresa) => {
    usuario.nome = nome;
    usuario.email = email;
    usuario.perfil = perfil;
    usuario.empresa = empresa;
    usuario.contato_empresa = contato_empresa;
  },

  findAllUsuarios: async () => {
    const usuarios = await Usuario.find();
    return usuarios;
  },

  getResponseWithCryptos: async (usuarios) => {
    const response = [];

    for (const usuario of usuarios) {
      const crypto = await findCryptoByUsuarioId(usuario._id);
      const usuarioWithCrypto = {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        empresa: usuario.empresa,
        contato_empresa: usuario.contato_empresa,
        key: crypto ? crypto.key : null,
      };
      response.push(usuarioWithCrypto);
    }

    return response;
  },

  findCryptoByUsuarioId: async (usuarioId) => {
    const crypto = await Crypto.findOne({ usuario: usuarioId });
    return crypto;
  },

  deleteCrypto: async (crypto) => {
    await crypto.remove();
  },

  deleteUsuario: async (usuario) => {
    await usuario.remove();
  },
};

module.exports = usuarioController;
