const router = require("express").Router()

const mensagemController = require("../controllers/mensagemController")

router.route("/").post((req, res) => mensagemController.create(req, res))

router.route("/:remetente/:destinatario").get((req, res) => mensagemController.get(req, res))

router.route("/:id").get((req, res) => mensagemController.mostrarNotificacoesChat(req, res))

router.route("/marcar").post((req, res) => mensagemController.marcarNotificacoesChat(req, res))

module.exports = router