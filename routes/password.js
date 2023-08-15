const express = require('express');
const path=require('path');
const user = require('../model/otp');
const nodemailer = require('nodemailer');
var router = express.Router();
const signupdata = require('../model/signup')


// forgot password otp

router.post('/api/email', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Method:GET,POST,PUT,DELETE");
  const randomPin = Math.floor(1000 + Math.random() * 9000);
  var data = {
    email: req.body.email,
    otp: randomPin
  };
  var authdb = new user(data);
  authdb.save().then(async (data) => {

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fsddemo543@gmail.com',
        pass: 'nrlgpphjputzrwys'
      }
    });

    var existingUser = await signupdata.findOne({ email: data.email });
    if (!existingUser) {
      res.json({ status: 404 });
    } else {
      var mailOptions = {
        from: 'fsddemo543@gmail.com',
        to: data.email,
        subject: 'OTP',
        text: `OTP is ${data.otp}`
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('email send:' + info.response);
        }
      });

      console.log(data);
      res.json({ data, status: 200 });
    }
  });

});

router.post('/api/otp', (req, res) => {
  var data = {
    email: req.body.email,
    otp: req.body.otp
  }
  user.findOne({ email: data.email, otp: data.otp }).then((data) => {
    if (data != null) {
      console.log("otp verify", data);
      res.send(data);
    } else {
      res.send(null);
    }

  });
});



 module.exports = router;