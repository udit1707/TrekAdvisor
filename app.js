var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    sequelize=require('./util/database'),
    Trek=require('./models/trek'),
    User=require('./models/user'),
    Comment=require('./models/comment'),
    TrekComm=require('./models/trek-comm');
   
    // flash = require("connect-flash");
     methodOverride = require("method-override");

var commentRoutes = require("./routes/comments"),
    trekRoutes = require("./routes/treks");
    //authRoutes = require("./routes/index");
// app.use(require("express-session")({
//     secret: "Batshit crazy turbocharged-twat",
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(flash());
 app.use(methodOverride("_method"));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', 'views');
app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>{console.log(err);});
});

// app.use(function(req, res, next) {
//     res.locals.currentUser = req.user;
//     res.locals.error = req.flash("error");
//     res.locals.success = req.flash("success");
//     next();
// });
//app.use("/", authRoutes);
app.use("/treks", trekRoutes);
app.use("/treks/:id/comments",
     commentRoutes);

Trek.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Trek);
Trek.belongsToMany(Comment,{through:TrekComm});
User.hasMany(Comment);



sequelize.
 //sync({force:true}).
 sync().
 then(result=>{
     return User.findByPk(1);  })
 .then(user=>{
     if(!user){
        return User.create({username:'Udit',password:'abcdef'});
     }
     return user;//returning a value in 'then' block is automatically wrapped into a new promise.
 })
 .then(user=>{
     console.log(user);
     app.listen(2900);
 })
.catch(err=>{console.log(err);});

