const router = require("express").Router()

const loginController = require("../controllers/loginController")

router.route("/").post((req, res) => loginController.login(req, res))

module.exports = router