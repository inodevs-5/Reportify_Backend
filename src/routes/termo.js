const router = require("express").Router()
const { checkToken, checkAdmin } = require("../middlewares/authMiddleware")

const termoController = require("../controllers/termoController")

router.route("/").get((req, res) => termoController.getLastest(req, res))

router.route("/:id").get((req, res) => termoController.statusAccept(req, res))

router.route("/create").post(checkToken, checkAdmin, (req, res) => termoController.create(req, res))

router.route("/accept").post((req, res) => termoController.accept(req, res))

module.exports = router