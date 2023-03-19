const router = require("express").Router()

const rosRouter = require("./ros")
router.use("/ro", rosRouter)

const usuariosRouter = require("./usuarios")
router.use("/usuario", usuariosRouter)

module.exports = router;