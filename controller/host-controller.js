
const Home=require('../models/home'); 
const fs=require('fs');




exports.addHome=(req,res,next)=>{
  res.render('host/addHome',{pageTitle:'Add home',
    currentPage:'add-home',
    editing:false,
    isLoggedIn:req.session.isLoggedIn,
    user:req.session.user
  })
}


exports.getHostHome=(req,res,next)=>{
  Home.find().then((registerHome)=>{
    res.render('host/host-homeList',{
      registerHome:registerHome,
      pageTitle:'hostHome',
      currentPage:'hostHome',
      isLoggedIn:req.session.isLoggedIn,
      user:req.session.user
    })
  })
}


exports.responce=(req,res,next)=>{
  const { housename,price,rating,location,review,description} = req.body;
  console.log(housename,price,rating,location,review,description)
  console.log(req.file);
  if(!req.file){
    return res.status(400).send('No file uploaded');
  }

  const photo=req.file.path;

  const home=new Home({housename,price,rating,location,photo,review,description});
  home.save().then(()=>{
    console.log("home added successfully");
  })
  res.render('host/response',{
    pageTitle:'Response',
    currentPage:'response',
    isLoggedIn:req.session.isLoggedIn,
    user:req.session.user
  })
}

// Edit home
exports.getEditHome=(req,res,next)=>{
  const homeId=req.params.homeId;
  const editing=req.query.editing ==='true';
  Home.findById(homeId).then((home)=>{
    // console.log(homeId,editing,home)
    if(!home){
      console.log("home not found for editing")
      return res.redirect('/host/host-homeList')
    }
    res.render('host/addHome',{home:home,pageTitle:'edit-home',currentPage:'hostHome',editing:editing,
      isLoggedIn:req.session.isLoggedIn,
      user:req.session.user
    })
  })
  
}

exports.postEditHome=(req,res,next)=>{
  const {housename,price,rating,location,review,description,id}=req.body;
  Home.findById(id).then(home=>{
    home.housename=housename,
    home.price=price;
    home.rating=rating;
    home.location=location;
    if( req.file){
      fs.unlink(home.photo,(err)=>{
        if(err){
          console.log("error while deleting old photo ",err)
        }
      });
      home.photo=req.file.path;
    }
    home.review=review;
    home.description=description;
    home.save().then((result)=>{
      console.log("home updated successfully",result);
    }).catch(err=>{
      console.log("error while updating home",err)
    })

  }).catch(err =>{
    console.log("error while finding home id for editing",err)
  })
  res.redirect("/host/host-home")
  
}

exports.postDeleteHome= (req,res,next)=>{
  
  const homeId = req.params.homeId;
  Home.findById(homeId).then(home=>{
    fs.unlink(home.photo,(err)=>{
      if(err){
        console.log("error while deleting photo ",err)
      }
      else{
        console.log("photo deleted successfully")
      }
    })
  })
  console.log("Came to delete ", homeId)
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home");
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
    });
  
}