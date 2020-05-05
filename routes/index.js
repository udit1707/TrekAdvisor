var express = require("express");
const{check,body} =require('express-validator');
const {validationResult}=require('express-validator/check');
const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const router = express.Router();
const User = require("../models/user");

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
      api_key:'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'/*enter the api key*/
    }
  }));


router.get("/", function(req, res) {
    res.render("landing",{
        currentUser: req.user });
});

router.get("/register", function(req, res) {
   
    
    res.render("register",{
        currentUser: req.user,path:'/register'});
});
router.post("/register",[
    check('email')
     .isEmail()
     .withMessage('Please enter a valid Email.')
     .custom((value,{req})=>{
    // if(value==='test@test.com')
    // throw new Error('This email address is forbidden');
    // return true;
     return User.findOne({where:{email:value}}).then(userDoc=>{
      if(userDoc) {
          
          return Promise.reject('Email already exists, please pick a a different one');
        };
        });
    })  
    .normalizeEmail()  
,body('password','Please enter a password with only numbers and text and at least 5 character.')
.isLength({min:5})
.isAlphanumeric()
.trim()
], function(req, res) {
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('register', {
            currentUser:req.user,
         path: '/register',
         errorMessage:errors.array()[0].msg,
         });
      }
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
         return User.create({ email:email, username: username , password:hashedPassword });})
    .then(result=>{
          console.log(result);
         res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from:'uditsingh294@gmail.com',
            subject:'Signup Success',
            html:'<h1>Sign Up Successfull!!</h1>'
          });       
         })
         .catch(err=>{
             console.log(err);
             
            
         });
});


router.get("/login", function(req, res) {
   
    res.render("login",{
        currentUser: req.user,path:'/login' });
});


router.post("/login",[check('email').
isEmail()
.withMessage('Please enter a valid email')
.normalizeEmail()
,body('password','Please enter a valid password that is alphanumeric and atleast 5 characters').
isLength({min:5})
.isAlphanumeric()
.trim()] ,(req,res,next)=>{
let foundUser;
const email=req.body.email;
const password=req.body.password;
const errors=validationResult(req);

 if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).render('login', {
        currentUser:req.user,
     path: '/login',
     errorMessage:errors.array()[0].msg  
    });
  }
 User.findOne({where:{email:email}})
 .then(users=>{
     const user=users;
     
     if(!user)
     {
         console.log("################Error in credentials###############");
         return res.redirect('/login');
     }
     foundUser=user;
     bcrypt.compare(password,user.password)    
     .then(doMatch=>{
         if(doMatch){
            req.session.isLoggedIn=true;
            req.session.user=foundUser;
            return req.session.save(err=>{
               console.log(err);
                res.redirect('/treks');
               });
             
         }else{
            console.log('PassWord Incorrect');
           res.redirect('/login');}        
  

 }).catch(err=>{return res.redirect('/login');})
 
 ;})
 .catch(err=>{
     console.log(err);     
 });
 
});

router.get('/logout', function(req,res){
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/login');
   
      })
});


module.exports = router;