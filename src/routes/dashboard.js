const router = require("express").Router()

const dashboardController = require("../controllers/dashboardController")

router.route("/data/:date/:user").get((req, res) => dashboardController.getData(req, res))

router.route("/dates").get((req, res) => dashboardController.getDates(req, res))

module.exports = router