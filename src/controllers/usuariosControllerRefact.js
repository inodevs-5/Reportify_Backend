const transporter = require("../config/emailConfig"); // Importa o módulo de configuração do transporte de e-mail
const { Usuario } = require("../models/Usuario"); // Importa o modelo de dados do Usuário
const { Crypto } = require("../models/cryptoModel"); // Importa o modelo de dados do Crypto
const bcrypt = require("bcrypt"); // Importa o módulo de criptografia bcrypt
const CryptoJS = require("crypto-js"); // Importa o módulo de criptografia CryptoJS

const usuarioController = {
  create: async (req, res) => { // Função para criar um novo usuário
    const { nome, email, perfil, empresa, contato_empresa } = req.body; // Extrai os dados do corpo da solicitação

    try {
      validateFields(nome, email, empresa, contato_empresa); // Valida se os campos obrigatórios foram preenchidos

      const usuarioExists = await checkIfUsuarioExists(email); // Verifica se o usuário já existe no banco de dados
      if (usuarioExists) {
        return res.status(422).json({ msg: "Por Favor, utilize outro e-mail" }); // Retorna uma mensagem de erro se o usuário já existe
      }

      const cryptoKey = generateCryptoKey(); // Gera uma chave de criptografia aleatória

      const usuario = createUsuario(nome, email, perfil, empresa, contato_empresa); // Cria uma instância do modelo de Usuário
      const crypto = createCrypto(cryptoKey, usuario._id); // Cria uma instância do modelo de Crypto

      await saveUsuario(usuario); // Salva o Usuário no banco de dados
      await saveCrypto(crypto); // Salva o Crypto no banco de dados

      sendEmail(usuario.email, usuario._id); // Envia um e-mail de confirmação para o usuário

      res.status(201).json({ msg: "Usuário criado com sucesso" }); // Retorna uma mensagem de sucesso
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" }); // Retorna uma mensagem de erro caso ocorra uma exceção
    }
  },

  update: async (req, res) => { // Função para atualizar um usuário existente
    const { id } = req.params; // Obtém o ID do usuário a ser atualizado
    const { nome, email, perfil, empresa, contato_empresa } = req.body; // Extrai os dados do corpo da solicitação

    try {
      const usuario = await findUsuarioById(id); // Busca o Usuário pelo ID no banco de dados
      if (!usuario) {
        return res.status(404).json({ msg: "Usuário não encontrado" }); // Retorna uma mensagem de erro se o Usuário não existe
      }

      updateUsuarioFields(usuario, nome, email, perfil, empresa, contato_empresa); // Atualiza os campos do Usuário com os novos valores

      await saveUsuario(usuario); // Salva as alterações no banco de dados
      res.status(200).json({ msg: "Usuário atualizado com sucesso" }); // Retorna uma mensagem de sucesso
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" }); // Retorna uma mensagem de erro caso ocorra uma exceção
    }
  },

  show: async (req, res) => { // Função para exibir um usuário específico
    const { id } = req.params; // Obtém o ID do usuário a ser exibido

    try {
      const usuario = await findUsuarioById(id); // Busca o Usuário pelo ID no banco de dados
      if (!usuario) {
        return res.status(404).json({ msg: "Usuário não encontrado" }); // Retorna uma mensagem de erro se o Usuário não existe
      }

      res.status(200).json(usuario); // Retorna o Usuário encontrado
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" }); // Retorna uma mensagem de erro caso ocorra uma exceção
    }
  },

  getAll: async (req, res) => { // Função para obter todos os usuários
    try {
      const usuarios = await findAllUsuarios(); // Busca todos os Usuários no banco de dados
      const response = await getResponseWithCryptos(usuarios); // Obter uma resposta com dados de criptografia para cada usuário

      res.json(response); // Retorna a lista de usuários com informações de criptografia
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!" }); // Retorna uma mensagem de erro caso ocorra uma exceção
    }
  },

  delete: async (req, res) => { // Função para excluir um usuário
    const { id } = req.params; // Obtém o ID do usuário a ser excluído

    try {
      const usuario = await findUsuarioById(id); // Busca o Usuário pelo ID no banco de dados
      if (!usuario) {
        return res.status(404).json({ msg: "Usuário não encontrado" }); // Retorna uma mensagem de erro se o Usuário não existe
      }

      const crypto = await findCryptoByUsuarioId(id); // Busca o Crypto relacionado ao usuário
      if (!crypto) {
        return res
          .status(404)
          .json({ msg: "key de criptografia não encontrada para o usuário." }); // Retorna uma mensagem de erro se o Crypto não existe
      }

      await deleteCrypto(crypto); // Exclui o Crypto do banco de dados
      await deleteUsuario(usuario); // Exclui o Usuário do banco de dados

      res.status(200).json({ msg: "Usuário excluído com sucesso" }); // Retorna uma mensagem de sucesso
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" }); // Retorna uma mensagem de erro caso ocorra uma exceção
    }
  },

  validateFields: (nome, email, empresa, contato_empresa) => { // Função para validar os campos obrigatórios
    if (!nome || !email || !empresa || !contato_empresa) {
      throw new Error("Por favor, preencha todos os campos obrigatórios"); // Lança um erro se algum dos campos obrigatórios não estiver preenchido
    }
  },

  checkIfUsuarioExists: async (email) => { // Função para verificar se um Usuário já existe no banco de dados
    const usuario = await Usuario.findOne({ email }); // Busca um Usuário pelo email no banco de dados
    return usuario !== null; // Retorna true se o Usuário existe, caso contrário, retorna false
  },

  generateCryptoKey: () => { // Função para gerar uma chave de criptografia aleatória
    return CryptoJS.lib.WordArray.random(16).toString(); // Gera uma sequência aleatória de 16 bytes e a converte para uma string
  },

  createUsuario: (nome, email, perfil, empresa, contato_empresa) => { // Função para criar uma instância do modelo de Usuário
    const usuario = new Usuario({
      nome,
      email,
      perfil,
      empresa,
      contato_empresa,
    });
    return usuario; // Retorna a instância criada do Usuário
  },

  createCrypto: (cryptoKey, usuarioId) => { // Função para criar uma instância do modelo de Crypto
    const crypto = new Crypto({
      key: cryptoKey,
      usuario: usuarioId,
    });
    return crypto; // Retorna a instância criada do Crypto
  },

  saveUsuario: async (usuario) => { // Função para salvar o Usuário no banco de dados
    await usuario.save(); // Salva o Usuário
  },

  saveCrypto: async (crypto) => { // Função para salvar o Crypto no banco de dados
    await crypto.save(); // Salva o Crypto
  },

  sendEmail: async (email, usuarioId) => { // Função para enviar um e-mail de confirmação para o usuário
    const mailOptions = {
      from: "seuemail@gmail.com",
      to: email,
      subject: "Confirmação de cadastro",
      html: `Seu usuário foi criado com sucesso! Seu ID de usuário é: ${usuarioId}`,
    };

    await transporter.sendMail(mailOptions); // Envia o e-mail utilizando o transporte configurado
  },

  findUsuarioById: async (id) => { // Função para buscar um Usuário pelo ID no banco de dados
    const usuario = await Usuario.findById(id); // Busca um Usuário pelo ID
    return usuario; // Retorna o Usuário encontrado
  },

  updateUsuarioFields: (usuario, nome, email, perfil, empresa, contato_empresa) => { // Função para atualizar os campos de um Usuário
    usuario.nome = nome;
    usuario.email = email;
    usuario.perfil = perfil;
    usuario.empresa = empresa;
    usuario.contato_empresa = contato_empresa;
  },

  findAllUsuarios: async () => { // Função para buscar todos os Usuários no banco de dados
    const usuarios = await Usuario.find(); // Busca todos os Usuários
    return usuarios; // Retorna a lista de Usuários encontrados
  },

  getResponseWithCryptos: async (usuarios) => { // Função para obter uma resposta com dados de criptografia para cada usuário
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
    
        return response; // Retorna a resposta contendo informações de criptografia para cada usuário
      },

  findCryptoByUsuarioId: async (usuarioId) => { // Função para buscar um Crypto pelo ID do Usuário no banco de dados
    const crypto = await Crypto.findOne({ usuario: usuarioId }); // Busca um Crypto pelo ID do Usuário
    return crypto; // Retorna o Crypto encontrado
  },

  deleteCrypto: async (crypto) => { // Função para excluir um Crypto do banco de dados
    await crypto.remove(); // Remove o Crypto
  },

  deleteUsuario: async (usuario) => { // Função para excluir um Usuário do banco de dados
    await usuario.remove(); // Remove o Usuário
  },
};

module.exports = usuarioController; // Exporta o objeto contendo as funções do controlador de Usuário