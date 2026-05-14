const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  FirstName:{
    type:String,
    required:true
  },
  LastName: String,

  email:{
    type:String,
    required: [true,'Email is required'],
    unique: true
  },

  password:{
    type:String,
    required:[true,'Password is required']
  },

  userType:{
    type:String,
    enum:['guest','Host'],
    default:'guest'
  },

  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home'
  }]
  
});

module.exports= mongoose.model('User',userSchema)