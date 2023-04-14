const router = require("express").Router()
const { checkAdmin } = require("../middlewares/authMiddleware")

const usuarioController = require("../controllers/usuarioController")

router.route("/").post(checkAdmin, (req, res) => usuarioController.create(req, res))

module.exports = router