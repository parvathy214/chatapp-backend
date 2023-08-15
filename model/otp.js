const mongoose = require('mongoose');


const Schema = mongoose.Schema;

var NewUserSchema = new Schema({
    email: String,
    otp:Number
   }, {
    versionKey: false
   })

var user = mongoose.model('userotp', NewUserSchema);
module.exports = user;