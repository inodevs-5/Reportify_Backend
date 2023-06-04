require('dotenv').config();
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const { GridFsStorage } = require('multer-gridfs-storage')
const crypto = require('crypto');

const url = process.env.DB_URL_MAIN;

const storage = new GridFsStorage({
    url: url,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'anexos'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage })


module.exports = { upload }
