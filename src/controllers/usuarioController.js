const transporter = require("../config/emailConfig")
const { Usuario } = require("../models/Usuario")
const { Crypto } = require("../models/cryptoModel");
const bcrypt = require("bcrypt")
const CryptoJS = require("crypto-js");

const usuarioController = {

  create: async(req, res) => {
    const {nome, email, perfil, empresa, contato_empresa} = req.body

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

    // check if user exist
    const usuarioExists = await Usuario.findOne({ email: email})

    if (usuarioExists) {
      return res.status(422).json({ msg: 'Por Favor, utilize outro e-mail'})
    }

    // generete cryptoKey
    const cryptoKey = CryptoJS.lib.WordArray.random(32);

    // create user
    const usuario = new Usuario({
      nome,
      email,
      perfil,
      empresa,
      contato_empresa,
    });

    const crypto = new Crypto({
      cryptoKey: cryptoKey.toString(),
      usuario: usuario._id
    });

    try {
      const userCreated = await usuario.save();

      crypto.save().then((crypto) => {
        userCreated.nome = encryptUserDataField(userCreated.nome, crypto);
        userCreated.email = encryptUserDataField(userCreated.email, crypto);
        userCreated.empresa = encryptUserDataField(userCreated.empresa, crypto);
        userCreated.contato_empresa = encryptUserDataField(userCreated.contato_empresa, crypto);
        userCreated.save();
      });

      // Enviando e-mail para o usuário redefinir a senha
      transporter.sendMail({
          from: `Inodevs <${process.env.USER_EMAIL}>`,
          to: usuario.email,
          subject: "Defina sua senha no Reportify.",
          html: `
              <h2>Seja bem-vindo ao Reportify!</h2>
              <p>Você acabou de ser cadastrado no aplicativo Reportify por um administrador do sistema. Após instalar o aplicativo no seu celular, clique <a href="http://reportify-app-inodevs-2023/senha/${usuario._id}/${true}">aqui</a> para definir a sua senha e conseguir se autenticar no aplicativo.</p>
              <p>Além disso, confira abaixo as suas informações que foram salvas no nosso banco de dados:</p>
              <ul>
                  <li><strong>Nome: </strong>${usuario.nome}</li>
                  <li><strong>E-mail: </strong>${usuario.email}</li>
                  <li><strong>Empresa: </strong>${usuario.empresa}</li>
                  <li><strong>Contato da Empresa: </strong>${usuario.contato_empresa}</li>
              </ul>
              <p>Estes são seus dados no sistema. Em relação a sua senha que ainda será definida por você, ela será completamente criptografada antes de ser armazenada. Caso queira alterar qualquer informação que está no nosso banco de dados, você pode enviar um e-mail de solicitação para esse mesmo endereço.</p>
          `
      }).then(message => {
          console.log(message)
      }).catch(error => {
          console.log(error)
          return res.status(422).json({msg: 'Erro ao enviar o email'})
      })

      res.status(201).json({user_id: userCreated.id, msg: `Usuário criado com sucesso `}) // TODO retornar id
    } catch (error) {
      console.log(error)
      res.status(500).json({msg: "Aconteceu um erro no servidor, tente novamente mais tarde"})
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { nome, email, perfil, empresa, contato_empresa } = req.body;

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
      // find user by id
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
      }

      // find the user's encryption key
      const crypto = await Crypto.findOne({ usuario: id });
      if (!crypto) {
        return res.status(404).json({ msg: 'Anonimizado pela LGPD.' });
      }

      const decryptedUser = await decryptUserDataField(usuario);
      const user_id = decryptedUser.user_id;
      const nomeUsuario = decryptedUser.nome;
      const emailUsuario = decryptedUser.email;
      const empresaUsuario = decryptedUser.empresa;
      const contato_empresaUsuario = decryptedUser.contato_empresa;

      const decryptedUserData = {
        user_id,
        nomeUsuario,
        emailUsuario,
        empresaUsuario,
        contato_empresaUsuario,
      }

      res.status(200).json(decryptedUserData);
    } catch (error) {
      console.log(error);
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({user_id: usuario._id, msg: 'Usuário não encontrado' });
      }
      res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
    }
  },

  getAll: async (req, res) => {
    try {
      const usuarios = await Usuario.find();
      const keys = await Crypto.find();

      const decryptedUsers = [];

      for (let u = 0; u < usuarios.length; u++) {
        const usuario = usuarios[u];
        const key = keys.find(k => String(usuario._id) === String(k.usuario));

        if (key) {
          const decryptedUser = await decryptUserDataField(usuario, key);
          decryptedUsers.push({
            user_id: decryptedUser.user_id,
            nome: decryptedUser.nome,
            email: decryptedUser.email,
            empresa: decryptedUser.empresa,
            contato_empresa: decryptedUser.contato_empresa
          });
        }
      }
      // TODO monstrar id do usuario também
      res.json(decryptedUsers);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
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
      const crypto = await Crypto.findOne({ usuario: id });
      if (!crypto) {
        return res.status(404).json({ msg: 'key de criptografia não encontrada para o usuário.' });
      }

      const userData = {
        nome: usuario.nome,
        email: usuario.email,
        empresa: usuario.empresa,
        contato_empresa: usuario.contato_empresa,
        senha: usuario.senha,
      };

      // Criptografar cada dado do usuário separadamente
      const encryptedName = encryptUserDataField(userData.nome, crypto);
      const encryptedEmail = encryptUserDataField(userData.email, crypto);
      const encrypteCompany = encryptUserDataField(userData.empresa, crypto);
      const encrypteCompanyContact = encryptUserDataField(userData.contato_empresa, crypto);
      const encryptePassword = encryptUserDataField(userData.senha, crypto);

      // update user fields
      usuario.nome = encryptedName;
      usuario.email = encryptedEmail;
      usuario.empresa = encrypteCompany;
      usuario.contato_empresa = encrypteCompanyContact;
      usuario.senha = encryptePassword;

      // save updated user
      await usuario.save();

      res.status(200).json({ msg: 'Os dados do usuário foram criptografados' });

      // Excluir a chave de criptografia após criptografar os dados
      deleteCryptographicKey(crypto);

      console.log('Dados criptografados');
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
    }
  },

  updatePassword: async(req, res) => {
      const { id } = req.params;
      const { senha, confirmarSenha } = req.body;

      try {
          const usuario = await Usuario.findById(id);

          if (!usuario) {
              return res.status(404).json({ msg: 'Usuário não encontrado' });
          }

          if (senha !== confirmarSenha) {
              return res.status(422).json({ msg: 'As senhas não conferem!' });
          }
          if (senha.length < 8) {
              return res.status(422).json({ msg: 'A senha deve conter pelo menos 8 caracteres!' });
          }
          if (!senha.match(/[a-z]+/)) {
              return res.status(422).json({ msg: 'A senha precisa possuir pelo menos uma letra minúscula!' });
          }
          if (!senha.match(/[A-Z]+/)) {
              return res.status(422).json({ msg: 'A senha precisa possuir pelo menos uma letra maiúscula!' });
          }
          if (!senha.match(/[0-9]+/)) {
              return res.status(422).json({ msg: 'A senha precisa possuir pelo menos um número!' });
          }
          if (!senha.match(/[@#$%&*><+\-_=.,;/()[\]{}?'"|\\]/)) {
              return res.status(422).json({ msg: 'A senha precisa possuir pelo menos um caracter especial!' });
          }

          const salt = await bcrypt.genSalt(12);
          const senhaHash = await bcrypt.hash(senha, salt);
          usuario.senha = senhaHash;

          await usuario.save();
          res.status(200).json({ msg: 'Sua senha foi atualizada com sucesso!' });
      } catch (error) {
          console.log(error);
          res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
      }
  },

  emailRedefinicao: async(req, res) => {
      const { email } = req.body;

      try {

          if (!email) {
              return res.status(422).json({ msg: 'O email é obrigatório!' });
          }

          const usuario = await Usuario.findOne({email});

          if (!usuario) {
              return res.status(404).json({ msg: 'Email não encontrado.' });
          }

          transporter.sendMail({
              from: `Inodevs <${process.env.USER_EMAIL}>`,
              to: email,
              subject: "Email de Redefinição de Senha do Reportify.",
              html: `
                  <h2>Redefinição de Senha</h2>
                  <p>Foi solicitado a redefinição de senha no aplicativo. Com o aplicativo instalado no seu celular, clique <a href="http://reportify-app-inodevs-2023/senha/${usuario._id}/${false}">aqui</a> para redefinir sua senha.
              `
          }).then(message => {
              console.log(message)
          }).catch(error => {
              console.log(error)
              return res.status(422).json({msg: 'Erro ao enviar o email'})
          })

          res.status(200).json({ msg: 'Solicitação de redefinição de senha enviada para ' + email + '!' });
      } catch (error) {
          console.log(error);
          res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
      }
  },

  search: async(req, res) => {
    const { nome } = req.params;

    try {
        const usuarios = await Usuario.find({nome: RegExp(nome, 'i')})

        res.json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
    }
  },
}

  // Função para criptografar os dados do usuário
  function encryptUserDataField(data, crypto) {
    const encryptedData = CryptoJS.AES.encrypt(data, crypto.cryptoKey).toString();
    return encryptedData;
  }

  // Função para descriptografar os dados do usuário
  async function decryptUserDataField(user) {
    const crypto = await Crypto.findOne({ usuario: user._id });

    if (!crypto) {
      throw new Error('Usuário não encontrado');
    }

    const user_id = user._id;
    const nome = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(user.nome, crypto.cryptoKey));
    const email = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(user.email, crypto.cryptoKey));
    const empresa = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(user.empresa, crypto.cryptoKey));
    const contato_empresa = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(user.contato_empresa, crypto.cryptoKey));

    const decryptedUser = { ...user, user_id, nome, email, empresa, contato_empresa};

    return decryptedUser;
  }

  // Função para excluir a chave de criptografia
  async function deleteCryptographicKey(crypto) {
    await Crypto.findByIdAndDelete(crypto._id);
  }

module.exports = usuarioController
