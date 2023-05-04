const router = require("express").Router()
const { checkToken, checkAdmin } = require("../middlewares/authMiddleware")

const usuarioController = require("../controllers/usuarioController")

router.route("/").post(checkToken, checkAdmin, (req, res) => usuarioController.create(req, res))

router.route("/").get(checkToken, (req, res) => usuarioController.getAll(req, res))

router.route("/:id").put(checkToken, (req, res) => usuarioController.update(req, res))

router.route("/:id").get(checkToken, (req, res) => usuarioController.show(req, res))

router.route("/password/:id").patch((req, res) => usuarioController.updatePassword(req, res))

module.exports = router