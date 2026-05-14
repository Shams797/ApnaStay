// Core module
const path=require('path');

// External module
const express=require('express');
const session=require('express-session');
const DB_PATH=("mongodb+srv://root:root@shams.vlh0pqm.mongodb.net/airbnb?appName=Shams")

// they are using connect-mongo instead of connect-mongodb-session
const {default: MongoDBStore} = require('connect-mongo');
// import mongoose
const { default: mongoose }=require('mongoose')
const multer= require('multer');


// Local module
const rootDir=require('./utils/pathutils')
const homeList=require('./routes/store');
const addHome=require('./routes/host');
const homeController=require('./controller/errors')
const authRouter=require('./routes/auth');

const app=express();

// ejs ss
app.set('view engine','ejs');
app.set('views','views');

store = MongoDBStore.create({
  mongoUrl: DB_PATH,
  collection: 'sessions'
});


app.use(session({
  secret:"shams works hard",
  resave:false,
  saveUninitialized:false,
  store: store
}))

// create random string for file name to avoid name collision
const randomString=(length)=>{
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i=0;i<length;i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads/')
  },
  filename:(req,file,cb)=>{
    cb(null,randomString(10)+"-"+file.originalname)
  }
});
 
const fileFilter=(req,file,cb)=>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
    cb(null,true)
  }
  else{
    cb(null,false)
  }
}
// they used to store data and create uplloads folder
const multerOptions={
  storage,fileFilter
}
//body parser
app.use(express.urlencoded())
app.use(multer(multerOptions).single('photo'))


// use to import CSS
app.use(express.static(path.join(rootDir,'public')))
app.use('/uploads',express.static(path.join(rootDir,'uploads')))
app.use("/host/uploads",express.static(path.join(rootDir,'uploads')))
app.use("/home/uploads",express.static(path.join(rootDir,'uploads')))


app.use(authRouter);

app.use(homeList);

app.use("/host",(req,res,next)=>{
  if(req.session.isLoggedIn){
    next();
  }
  else{
    res.redirect('/login');
  }
})
app.use('/host',addHome)

app.use(homeController.error) 

const port=3000;
mongoose.connect(DB_PATH).then(()=>{
  console.log("connected to database mongoose successfully");
  app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
  })
}).catch(err=>{
    console.log("error in connecting to database",err);
  })
