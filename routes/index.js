var express = require("express");
const{check,body} =require('express-validator');
const bcrypt=require('bcryptjs');
const router = express.Router();
const User = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/register", function(req, res) {
    res.render("register");
});
router.post("/register", function(req, res) {
    const username=req.body.username;
    const password=req.body.password;
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
         return User.create({ username: username , password:hashedPassword });})
    .then(result=>{
          console.log(result);
          return res.redirect('/login');
         })
         .catch(err=>{
             console.log(err);
         });
});


router.get("/login", function(req, res) {
    res.render("login");
});


router.post("/login", function(req,res){
    let foundUser;
 const username=req.body.username;
 const password=req.body.password;
 User.findAll({where:{username:username}})
 .then(users=>{
     const user=users[0];
     if(!user)
     {
         console.log('Error in credentials. user not found!');
         return res.redirect('/login');
     }
     foundUser=user;
     return bcrypt.compare(password,user.password);
    })
     .then(doMatch=>{
         if(!doMatch){
             console.log('PassWord Incorrect');
             return res.redirect('/login');
         }
         req.session.isLoggedIn=true;
         req.session.user=foundUser;
         return req.session.save(err=>{
            console.log(err);
             res.redirect('/treks');
            });        
  

 })
 .catch(err=>{
     console.log(err);
     return res.redirect('/login');
 });
 
});

router.get('/logout', function(req,res){
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/login');
   
      })
});


module.exports = router;