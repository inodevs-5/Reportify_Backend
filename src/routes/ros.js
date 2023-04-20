const router = require("express").Router()
const { upload } = require("../config/gridFsConfig")
const { checkAdmin } = require("../middlewares/authMiddleware")

const roController = require("../controllers/roController")

router.route("/").get((req, res) => roController.getAll(req, res))

router.route("/relator/:id").get((req, res) => roController.getByRelator(req, res))

router.route("/atribuido/:id").get(checkAdmin, (req, res) => roController.getByAtribuido(req, res))

router.route("/").post(upload.array('anexo'), (req, res) => roController.create(req, res))

router.route("/:search").get((req, res) => roController.search(req, res))

router.route("/download/:id").get((req, res) => roController.download(req, res))

module.exports = router