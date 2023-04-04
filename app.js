const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");

const app = express();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const IMAGES_FOLDER = "images/";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

app.get("/images", (req, res) => {
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: IMAGES_FOLDER,
  };

  s3.listObjects(params, (error, data) => {
    if (error) {
      console.error(error);
      res.status(error.statusCode).end();
    } else {
      const images = data.Contents.filter(
        (obect) =>
          obect.Key.startsWith(IMAGES_FOLDER) && obect.Key !== IMAGES_FOLDER
      ).map((object) => object.Key.substr(IMAGES_FOLDER.length));

      res.send(images);
    }
  });
});

app.get("/images/:filename", (req, res) => {
  const filename = IMAGES_FOLDER + req.params.filename;
  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
  };

  s3.getObject(params, (error, data) => {
    if (error) {
      console.error(error);
      res.status(error.statusCode).end();
    } else {
      res.writeHead(200, {
        "Content-Type": data.ContentType,
        "Content-Length": data.ContentLength,
      });
      res.end(data.Body);
    }
  });
});

app.post("/images", upload.single("image"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).end();
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: IMAGES_FOLDER + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  s3.upload(params, (error) => {
    if (error) {
      console.error(error);
      res.status(error.statusCode).end();
    } else {
      res.end();
    }
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
