require('dotenv').config();
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const { GridFsStorage } = require('multer-gridfs-storage')

const url = process.env.BD_URL_MAIN;
console.log("URL de conexão com o banco de dados:", url);


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