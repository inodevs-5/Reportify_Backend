const router = require("express").Router()

const usuarioController = require("../controllers/usuarioController")

router.route("/").post((req, res) => usuarioController.create(req, res))

router.route("/:id").put((req, res) => usuarioController.update(req, res))

router.route("/:id").get((req, res) => usuarioController.show(req, res))

module.exports = router