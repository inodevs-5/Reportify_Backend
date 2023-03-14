const RO = require("../models/RO")

const roController = {

    getAll: async(req, res) => {
        try {
            const ros = await RO.find()

            res.json(ros)
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Oops! Ocorreu um erro no servidor, tente novamente mais tarde!"})
        }
    },

}

module.exports = roController