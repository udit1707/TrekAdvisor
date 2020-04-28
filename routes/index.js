var express = require("express");
const bcrypt=require('bcryptjs');
var router = express.Router(),
     User = require("../models/user");
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
         User.create({ username: username , password:hashedPassword })
         .then(result=>{
             console.log(result);
             res.redirect('/login');
         })
         .catch(err=>{
             console.log(err);
         });
});
router.get("/login", function(req, res) {
    res.render("login");
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/treks",
    failureRedirect: "/login"
}), function(req, res) {});
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!!");
    res.redirect("/");
});


module.exports = router;