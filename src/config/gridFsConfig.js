const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const path = require('path')
const mongoose = require('mongoose')
const url = process.env.DB_URL

const storage = new GridFsStorage({
    url: url,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const nomeAnexo = file.originalname;
            const infoAnexo = {
                filename: nomeAnexo,
                bucketName: 'anexos'
            };
            resolve(infoAnexo);
        });
    }
});

const upload = multer({ storage })


module.exports = { upload }