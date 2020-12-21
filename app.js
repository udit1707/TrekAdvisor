var express = require("express"),
    app = express(),
    fs=require('fs'),
    path=require('path'),
    bodyParser = require("body-parser"),
    sequelize=require('./util/database'),
    Trek=require('./models/trek'),
    User=require('./models/user'),
    Comment=require('./models/comment'),
    Rating=require('./models/rating'),
    TrekRating=require('./models/trek-rating');
    moment=require('moment');
    flash = require("connect-flash");    
    TrekComm=require('./models/trek-comm');
    const session=require('express-session');
    var SequelizeStore = require('connect-session-sequelize')(session.Store);    // flash = require("connect-flash");
     methodOverride = require("method-override");
     const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');

var commentRoutes = require("./routes/comments"),
    trekRoutes = require("./routes/treks"),
    ratingRoutes=require('./routes/ratings'),
    authRoutes = require("./routes/index");
const UserRating = require("./models/trek-rating");
// app.use(require("express-session")({
//     secret: "Batshit crazy turbocharged-twat",
//     resave: false,
//     saveUninitialized: false
// }));
const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));



app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', 'views');


app.use(session({secret:'my secret'
,resave:false
,saveUninitialized:false
,store:new SequelizeStore({
    db: sequelize
  })
}));

app.use(methodOverride("_method"));

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    next();
});
app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findByPk(req.session.user.id)
    .then(user=>{
        // console.log('USer Found');
        // console.log(user);
        //mongodb  req.user=new User(user.name,user.email,user.cart,user._id);
        /*mongoose*/ 
        if(!user){
            return next();
        }
        req.user=user;
             
        next();
    })
    .catch(err=>{
         //throw new Error(err);this won't jumpo to error handling middleware inside an async function
         next(new Error(err));
        // console.log(err);
    });
   
});




// app.use((req,res,next)=>{
//     User.findByPk(1)
//     .then(user=>{
//         req.user=user;
//         next();
//     })
//     .catch(err=>{console.log(err);});
// });

// app.use(function(req, res, next) {
//     res.locals.currentUser = req.user;
//     res.locals.error = req.flash("error");
//     res.locals.success = req.flash("success");
//     next();
// });
app.use("/", authRoutes);
app.use("/treks", trekRoutes);
app.use("/treks/:id/comments",
     commentRoutes);
app.use("/treks/:id/ratings",
     ratingRoutes);


Trek.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Trek);
Trek.belongsToMany(Comment,{through:TrekComm});
User.hasMany(Comment);
Trek.belongsToMany(Rating,{through:TrekRating});
User.hasMany(TrekRating);



sequelize.
//sync({force:true}).
sync().
 then(result=>{
     console.log(result);
     app.listen(process.env.PORT || 3000);
 })
.catch(err=>{console.log(err);});

