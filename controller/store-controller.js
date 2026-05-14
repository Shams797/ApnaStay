
const { response } = require('express');
const Home=require('../models/home'); 
const User=require('../models/user');


exports.getHome=(req,res,next)=>{
  Home.find().then(registerHome=>{
    res.render('store/index',{registerHome:registerHome,
      pageTitle:'ApnaStay', 
      currentPage:'ApnaStay',
      isLoggedIn:req.session.isLoggedIn,
      user:req.session.user
    })
  })
}

exports.homeList=(req,res,next)=>{
  Home.find().then(registerHome=>{
    res.render('store/homeList',{registerHome:registerHome,
      pageTitle:'Home List',
      currentPage:'homeList',
      isLoggedIn:req.session.isLoggedIn,
      user:req.session.user
    })
  })
}

exports.getBooking=(req,res,next)=>{
  if(req.session.isLoggedIn){
    res.render('store/bookings',{pageTitle:'Booking',currentPage:'bookings',
    isLoggedIn:req.session.isLoggedIn,
    user:req.session.user
  })
  }
  else{
    res.redirect('/login');
  }


  
}


// get favourite page
exports.getFavourite= async (req,res,next)=>{

  const userId=req.session.user._id;
  const user= await User.findById(userId).populate('favourites')
  res.render("store/favourite-list", {
      favouriteHome: user.favourites,
      pageTitle: "favourite",
      currentPage: "favourite",
      isLoggedIn:req.session.isLoggedIn,
      user:req.session.user
    });
  
     
}

// post favourite
exports.postFavourite= async (req,res,next)=>{
  const homeId = req.body.id;
  const userId=req.session.user._id;
  const user= await User.findById(userId);
  if(!user.favourites.includes(homeId)){
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourite");
 
}


exports.getDetails=(req,res,next)=>{
  if(req.session.isLoggedIn){
    const homeId=req.params.homeId;
  // console.log("At home details page",req.homeId);
    Home.findById(homeId).then(home =>{

    // console.log(home);
      if(!home){
        console.log("home not found")
        res.redirect('/')
      }
      else{
        res.render('store/home-details',{home:home,pageTitle:'home',currentPage:'details',
          isLoggedIn:req.session.isLoggedIn,
          user:req.session.user
        })
      }
    })
  }
  else{
    res.redirect('/login');
  }
  
}

exports.postDeleteFavourite= async (req,res,next)=>{
  const homeId=req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if(user.favourites.includes(homeId)){
    user.favourites=user.favourites.filter(fav => fav !=homeId);
    await user.save();
  }
  res.redirect("/favourite");

} 