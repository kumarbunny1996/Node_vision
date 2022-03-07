var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");
require("dotenv").config();

router.post('/classify', async function (req, res, next) {
  let fileObj = req.files.file;
  let labels;
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const awsClient = new AWS.Rekognition();
  const params = {
    Image: {
     Bytes: fileObj.data 
    },
    MaxLabels: 10,
    // MinConfidence: 80,
  };

  awsClient.detectLabels(params, (err, response) => {
    if (err) return res.json({ "err": err });
    labels = response.Labels.map((Label) => Label.Name);
    res.json({
      "labels": labels
    });
  });
});

module.exports = router;
