
const express=require('express');
const userRouter=express.Router();

const home=require('../controller/store-controller');

userRouter.get('/',home.getHome)
userRouter.get('/homeList',home.homeList)
userRouter.get('/bookings',home.getBooking)
userRouter.get('/favourite',home.getFavourite)
userRouter.get("/home/:homeId",home.getDetails)
userRouter.post("/favourites",home.postFavourite)
userRouter.post("/delete-favourite/:homeId",home.postDeleteFavourite)
module.exports=userRouter;