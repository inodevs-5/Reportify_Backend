const router = require("express").Router()

const mensagemController = require("../controllers/mensagemController")

router.route("/").post((req, res) => mensagemController.create(req, res))

router.route("/:usuario1/:usuario2").get((req, res) => mensagemController.get(req, res))

module.exports = router