const { Usuario } = require("../models/Usuario")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")

const usuarioController = {
    create: async(req, res) => {
        const {nome, email, perfil, empresa, contato_empresa } = req.body

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

        // create user
        const usuario = new Usuario({
            nome,
            email,
            perfil,
            empresa,
            contato_empresa,
        })

        try {
            await usuario.save()

            let transporter = nodemailer.createTransport({
                host: process.env.HOST_EMAIL,
                port: process.env.PORT_EMAIL,
                secure: false,
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.PASS_EMAIL
                }
            })
            
            transporter.sendMail({
                from: `Inodevs <${process.env.USER_EMAIL}>`,
                to: usuario.email,
                subject: "Defina sua senha no Reportify.",
                html: `
                    <h1>Seja bem-vindo ao Reportify!</h1>
                    <p>Você acabou de ser cadastrado no aplicativo Reportify por um administrador do sistema. Após instalar o aplicativo no seu celular, clique <a href="http://reportify-app-inodevs-2023/senha/${usuario._id}">aqui</a> para definir a sua senha e conseguir se autenticar no aplicativo.</p>
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

            res.status(201).json({msg: 'Usuário criado com sucesso'})
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
            res.status(200).json({ msg: 'A senha do usuário foi atualizado com sucesso!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" });
        }
    },

}

module.exports = usuarioController