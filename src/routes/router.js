const router = require("express").Router()
const { checkToken } = require("../middlewares/authMiddleware")

const roController = require("../controllers/roController")
router.route("/download/:filename").get((req, res) => roController.download(req, res))

const rosRouter = require("./ros")
router.use("/ro", checkToken, rosRouter)

const usuariosRouter = require("./usuarios")
router.use("/usuario", usuariosRouter)

const loginRouter = require("./login")
router.use("/login", loginRouter)

const mensagemRouter = require("./mensagem")
router.use("/mensagem", checkToken, mensagemRouter)

const notifcacaoRouter = require("./notificacoes")
router.use("/notificacao", checkToken, notifcacaoRouter)

module.exports = router;