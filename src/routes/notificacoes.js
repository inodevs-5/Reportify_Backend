const router = require("express").Router()

const notificacaoController = require("../controllers/notificacaoController")

router.route("/:id").get((req, res) => notificacaoController.mostrarNotificacoes(req, res))

router.route("/").post((req, res) => notificacaoController.marcarNotificacoes(req, res))

module.exports = router