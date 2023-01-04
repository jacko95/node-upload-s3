// require('dotenv/config')
require('dotenv').config();
const express = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')
// const uuid = require('uuid/v4')
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 4500;

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({
    storage
}).single('image')

app.post(
    '/upload',
    upload,
    (req, res) => {
        console.log(req.file)
        console.log(req.body)
        console.log(req.body.user_id)

        let myFile = req.file.originalname.split(".")
        const fileType = myFile[myFile.length - 1]

        // res.send({
        //     message: "Hello World!"
        // })

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            // Key: `${uuid()}.${fileType}`,
            Key: `images/prestazione/${uuidv4()}.${fileType}`,
            Body: req.file.buffer
        }

        s3.upload(
            params,
            (error, data) => {
                if(error){
                    console.log(error)
                    res.status(500).send(error)
                }
                console.log(data);
                res.status(200).send(data)
            }
        )
    }
)

app.listen(
    port,
    () => {
        console.log(`Server is up at port ${port}`)
    }
)

