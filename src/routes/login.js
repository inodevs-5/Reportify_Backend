const router = require("express").Router()
const { checkToken } = require("../middlewares/authMiddleware")

const loginController = require("../controllers/loginController")

router.route("/").post((req, res) => loginController.login(req, res))

router.route("/", checkToken).get((req, res) => loginController.private(req, res))

module.exports = router