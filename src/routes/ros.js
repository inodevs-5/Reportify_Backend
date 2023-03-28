const router = require("express").Router()

const roController = require("../controllers/roController")

router.route("/").post((req, res) => roController.create(req, res))

module.exports = router