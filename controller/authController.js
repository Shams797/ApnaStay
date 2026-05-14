const {check,validationResult}=require('express-validator');
const User=require('../models/user')
const bcrypt=require('bcryptjs')

exports.getLogin=(req,res,next)=>{
  res.render('auth/login',
    {pageTitle:'Login',
      currentPage:'login',
      isLoggedIn:false,
      errors:[],
      oldInput:{email:''},
      user:{}
    })
}

exports.getSignup=(req,res,next)=>{
  res.render('auth/signup',{
    pageTitle:'signup',
    currentPage:'signup',
    isLoggedIn:false,
    errors:[],
    oldInput:{FirstName:'',LastName:'',email:'',password:'',userType:''},
    user:{}
  })
}

exports.postSignup=[

  check('FirstName')
    .notEmpty()
    .withMessage('First Name is required')
    .trim()
    .isLength({min:3})
    .withMessage('First Name must be at least 3 characters long')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('First Name must contain only letters'),

  check('LastName')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Last Name must contain only letters'),
     
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  check('password')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('password must contain at least one number')
    .matches(/[@$!%*?&]/)
    .withMessage('password must contain at least one special character')
    .trim(),

  check('confirmPassword')
    .trim()
    .custom((value,{req})=>{
      if(value!==req.body.password){
        throw new Error('confirm password does not match password')
      }
      return true;
    }),
  
  check('userType')
    .notEmpty()
    .withMessage('User type is required')
    .isIn(['guest','Host'])
    .withMessage('Invalid user type'),

  check('term')
    .notEmpty()
    .withMessage('You must accept the terms and conditions')
    .custom((value,{req}) =>{
      if(value !== 'on'){
        throw new Error('You must accept the terms and conditions')
      }
      return true;
    }),
  
  (req,res,next)=>{
    const {FirstName,LastName,email,password,userType}=req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).render('auth/signup',{
        pageTitle:'Signup',
        currentPage:'singup',
        isLoggedIn:false,
        errors: errors.array().map(err=>err.msg),
        oldInput:{FirstName,LastName,email,password,userType},
        user:{}
      })
    }

    bcrypt.hash(password, 12).then(hashedpassword=>{
      const user = new User({FirstName,LastName,email,password:hashedpassword,userType})
      return user.save()
    }).then(()=>{
      return res.redirect('/login')
    }).catch(err=>{
      return res.status(422).render('auth/signup',{
      pageTitle:'Signup',
      currentPage:'singup',
      isLoggedIn:false,
      errors: [err.message],
      oldInput:{FirstName,LastName,email,password,userType},
      user:{}
      })

    })
    
    // use with out hash password means with out incript password
    // const user=new User({FirstName, LastName, email, password, userType})
    // user.save().then(()=>{
    //   res.redirect('/login')
    // }).catch(err=>{
    //   return res.status(422).render('auth/signup',{
    //   pageTitle:'Signup',
    //   currentPage:'singup',
    //   isLoggedIn:false,
    //   errors: [err.message],
    //   oldInput:{FirstName,LastName,email,password,userType}
    //   })
    // })
    
  }
]

// post Login
exports.postLogin= async (req,res,next)=>{
  const {email,password}=req.body;
  const user= await User.findOne({email});
  if(!user){
    return res.status(422).render('auth/login',
    {pageTitle:"Login",
      currentPage:"login",
      isLoggedIn:false,
      errors:["user does not found"],
      oldInput:{email},
      user:{}
    });
  }

  const itMatch = await bcrypt.compare(password,user.password);
  if(!itMatch){
    return res.status(422).render('auth/login',
      {pageTitle:"Login",
        currentPage:"login",
        isLoggedIn:false,
        errors:["Invalid Password"],
        oldInput:{email},
        user:{}
      }
    );
  }

  req.session.isLoggedIn=true;
  req.session.user = user;
  // console.log("hellll. ",req.session.user);
  await req.session.save();
  // console.log("Session after login", req.session.user);
  res.redirect('/');
}

// post logout
exports.postLogout=(req,res,next)=>{
  req.session.destroy(()=>{
    res.redirect('/login')
  })
  // res.cookie("isLoggedIn",false)
  
}