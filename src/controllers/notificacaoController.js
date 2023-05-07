const nodemailer = require('nodemailer')
const { Usuario } = require("../models/Usuario")
require('dotenv').config()

const transportador = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.SENHA
    }
})

const emailCadastroRo = {
    from: process.env.EMAIL,
    to: 'email.teste@gmail.com',
    subject: 'teste de envio de email',
    text: 'Texto do email'
}

const emailRoAtendido = {
    from: process.env.EMAIL,
    to: 'email.teste@gmail.com',
    subject: 'teste de envio de email',
    text: 'Texto do email'
}

const emailRoFechado = {
    from: process.env.EMAIL,
    to: 'email.teste@gmail.com',
    subject: 'teste de envio de email',
    text: 'Texto do email'
}

transportador.sendMail(emailCadastroRo, emailRoAtendido, emailRoFechado, (err) => {
    if(err) {
        console.log(err)
        return
    }
    console.log('Email enviado com sucesso!')
})