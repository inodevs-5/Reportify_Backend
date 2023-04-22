const router = require("express").Router()
const { checkAdmin } = require("../middlewares/authMiddleware")

const usuarioController = require("../controllers/usuarioController")

router.route("/").post(checkAdmin, (req, res) => usuarioController.create(req, res))

router.route("/:id").put((req, res) => usuarioController.update(req, res))

router.route("/:id").get((req, res) => usuarioController.show(req, res))

module.exports = router