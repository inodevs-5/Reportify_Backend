const router = require("express").Router()
const { checkToken } = require("../middlewares/authMiddleware")

const rosRouter = require("./ros")
router.use("/ro", checkToken, rosRouter)

const usuariosRouter = require("./usuarios")
router.use("/usuario", usuariosRouter)

const loginRouter = require("./login")
router.use("/login", loginRouter)

const mensagemRouter = require("./mensagem")
router.use("/mensagem", checkToken, mensagemRouter)

const dashboardRouter = require("./dashboard")
router.use("/dashboard", checkToken, dashboardRouter)

const termoRouter = require("./termo")
router.use("/termo", termoRouter)

const notifcacaoRouter = require("./notificacoes")
router.use("/notificacao", checkToken, notifcacaoRouter)

const backup = require("../middlewares/backup")
router.post("/forceBackup", backup.dbBackup);

const restore = require("../middlewares/restore")
router.post("/forceRestore", restore.dbRestore);

module.exports = router;