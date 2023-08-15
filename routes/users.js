const express = require('express');
const SignupData = require('../model/signup')
var router = express.Router();
const bcrypt = require('bcryptjs');

    // to display profileuser details 
    router.get('/api/uniquelogin/:userid',async(req,res)=>{
        console.log("data reached unique user backend")
      try {
        let id = req.params.userid
      let userlogin = await SignupData.findById(id)
      if (!userlogin) {
        return res.status(404).json({ message: 'User not found' });
      }
      // console.log(userlogin)
  
      res.json({data:userlogin});
      } catch (error) {
        res.json({message:error}).status(400)
  
      }
    })

    // chatbox details
    router.get('/api/chatroom/:userid/:fid',async(req,res)=>{
  
      console.log('reached friend details backend')
      try {
        let userid = req.params.userid; 
        let fid = req.params.fid
        console.log(fid);
        let profileuser = await SignupData.findById(userid);
        // console.log(profileuser)
        const chatfriend = profileuser.friends.find(friend => friend._id.toString() === fid);
        console.log(chatfriend.username)
        let friendetails = await SignupData.findOne({username:chatfriend.username})
        const dp = friendetails.pic.data;  
        res.json({data:friendetails,image:dp});
      } catch (error) {
        res.json({message:error}).status(400)
  
      }
    })
  

    //online users and profile picture of users
    router.get('/api/active/:username',async(req,res)=>{
      console.log('reached online status backend')
  
      try {
         let friend = req.params.username;
         console.log(friend);
         let name = friend.username
         findinuser = await SignupData.findOne({username:friend});
        //  console.log(findinuser)
         let activestatus =  findinuser.status
         const dp = findinuser.pic.data;  
         res.json({data:activestatus,image:dp});
      } catch (error) {
        console.log(error);
      }
    })
  
  
  
  
    //logout
    router.get('/api/logout/:userid',async(req,res)=>{
      console.log('reached logout backend')
  
      try {
         let userid = req.params.userid;
         updatedstatus = await SignupData.updateOne({ _id : userid },{ $set: { status: "offline" } })
         updateduser = await SignupData.findOne({ _id : userid })
         res.json({data:updateduser.status});
  
  
      } catch (error) {
        console.log(error);
  
      }
    })
  

  // block user
  router.post('/api/block',async (req,res)=>{
    try {
      let profileuser = req.body.data.sender;
      let blockuser = req.body.data.recipient
      senderblocked = await SignupData.updateOne({username:profileuser},{$addToSet:{blockedUsers:blockuser}});
      if(senderblocked.acknowledged == true   ){
          res.json({"status":"success"})
      }else{
          res.json({"status":"failed"})
      }
    } catch (error) {
      console.log(error);
    }
  })


  router.post('/api/unblock',async (req,res)=>{
    try {
      let profileuser = req.body.data.sender;
      let blockuser = req.body.data.recipient
      senderblocked = await SignupData.updateOne({username:profileuser},{$pull:{blockedUsers:blockuser}});
  
      if(senderblocked.acknowledged == true   ){
          res.json({"status":"success"})
  
      }else{
          res.json({"status":"failed"})
      }
    } catch (error) {
      console.log(error);
    }
  })
  

  // for muting a user
  router.post('/api/mute_users', async(req, res)=>{
    try {
        console.log("from frontend ", req.body);
        let name = req.body.data.sender
        let mutedUser = req.body.data.recipient
        muted = await SignupData.updateOne({username : name},{$push: {mutedUsers : mutedUser}})
        // console.log(muted);
        if(muted.acknowledged == true){
            res.json({"status":"success"})
        }else{
            res.json({"status":"failed"})
        }
    } catch (error) {
        console.log(error);  
    }
  })
  

  // for unmuting a user
  router.post('/api/unmute_users', async(req, res)=>{
    try {
        console.log("from frontend ", req.body);
        let name = req.body.data.sender
        let mutedUser = req.body.data.recipient
        unMuted = await SignupData.updateOne({username : name},{$pull : {mutedUsers : mutedUser}})
        // console.log(unMuted);
        if(unMuted.acknowledged == true){
            res.json({"status":"success"})
        }else{
            res.json({"status":"failed"})
        }
    } catch (error) {
        console.log(error);
    }
  })
  
  
  
  //upload photo
  
  const multer = require('multer');
  const bodyparser = require('body-parser');
  const fs = require('fs'); // Import the 'fs' module
  
  var path = require('path')
  router.use(bodyparser.urlencoded({extended:true}))
  
 
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage }).single('file');
  
  router.post('/api/file/:userid', async (req, res) => {
    try {
      const userId = req.params.userid;
  
      // Handle the image upload using multer
      upload(req, res, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'Error uploading file' });
        }
  
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }
  
        console.log('id for upload is ', userId);
  
        console.log('image data length:', req.file.buffer.length);
  
        const chat = await SignupData.findById(userId);
  
        if (!chat) {
          return res.status(404).json({ message: 'Chat not found' });
        }
  
        const image = {
          data: req.file.buffer, // Use the image data from multer's buffer
          contentType: req.file.mimetype,
        };
  
        // Update the chat document with the image data
        chat.pic = image;
        await chat.save();
  
        res.status(200).json({ message: 'File uploaded and saved successfully' });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  });
  
  router.get('/api/displaypic/:userid', async (req, res) => {
    console.log('Reached backend for dp');
    try {
      const id = req.params.userid;
      const userlogin = await SignupData.findById(id);
      if (!userlogin) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
      const dp = userlogin.pic.data;  
      res.status(200).json({ message: 'Image URL created successfully', imageBinaryData: dp });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'An error occurred', error: error.message });
    }
  });
  
  
  module.exports = router