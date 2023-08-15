const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://p4parvathy214:Lekhaatlas@cluster0.ndcrk8y.mongodb.net/chatapp?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log('successfully connected to MongoDB')
})
.catch((err)=>{
    console.log('Error connecting to MongoDB', err)
})

module.exports = mongoose