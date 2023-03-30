const router = require("express").Router()

const roController = require("../controllers/roController")

router.route("/").get((req, res) => roController.getAll(req, res))

router.route("/").post((req, res) => roController.create(req, res))

router.route("/:search").get((req, res) => roController.search(req, res))

module.exports = router