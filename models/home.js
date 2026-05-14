const mongoose=require('mongoose');
const User=require('./user');

const homeSchema=new mongoose.Schema({
  housename:{
    type:String,
    required:true
  },
  price:{
    type:String,
    required:true
  },
  rating:{
    type:String,
    required:true
  },
  location:{
    type:String,
    reduced:true
  },
  photo:{
    type:String,
  
  },
  review:{
    type:String

  },
  description:{
    type:String

  }

})

homeSchema.pre('findOneAndDelete', async function(next) {
  console.log('Came to pre hook while deleting a home');
  const homeId = this.getQuery()._id;
  // await User.deleteMany({homeId: homeId});
  await User.updateMany(
    { favourites: homeId },
    { $pull: { favourites: homeId } }
  );
});

module.exports=mongoose.model('Home',homeSchema);