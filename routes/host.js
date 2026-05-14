const express=require('express');
const hostRouter=express.Router();
const home=require('../controller/host-controller');
// const { homeList } = require('../controller/store-controller');

hostRouter.get('/contact-us',home.addHome);
hostRouter.post('/contact-us',home.responce);
hostRouter.get('/host-home',home.getHostHome)
hostRouter.get('/edit-home/:homeId',home.getEditHome)
hostRouter.post('/edit-home',home.postEditHome)
hostRouter.post('/host-homedelete/:homeId',home.postDeleteHome)
module.exports=hostRouter;