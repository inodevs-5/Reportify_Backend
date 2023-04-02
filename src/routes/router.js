const router = require("express").Router()
const { checkToken } = require("../middlewares/authMiddleware")

const rosRouter = require("./ros")
router.use("/ro", rosRouter)

const usuariosRouter = require("./usuarios")
router.use("/usuario", checkToken, usuariosRouter)

const loginRouter = require("./login")
router.use("/login", loginRouter)

module.exports = router;