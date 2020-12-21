var express = require("express");
var router = express.Router();
var Trek = require("../models/trek");
var moment = require('moment');
// var methodOverride = require("method-override");
const axios = require('axios').default;
var middleware = require("../middleware/index.js");
const TrekRating = require("../models/trek-rating");
const Rating = require("../models/rating");
const { response } = require("express");
const { Op } = require('sequelize')
const ITEMS_PER_PAGE=6;
router.use(methodOverride("_method"));

router.get("/recommen",middleware.isLoggedIn,async (req,res,next)=>{
    try
    {
        // let response = await axios.post('http://127.0.0.1:5000/fetchTop5', {   
        let response = await axios.post('https://trekflask-api.herokuapp.com/fetchTop5', { 
        headers: {
            "content-type": "application/json"
        }
    });
    const limit=3;
    const top=await Trek.findAll({limit,order:[['mean_rating','DESC']],attributes:['id','image','name'],where:{mean_rating:{[Op.gt]:0}}});
    treks=response.data.data_result;
    // console.log(treks);
    
    treks=JSON.parse(treks);
    //console.log(top.length);
    res.render("treks/recommendation",{currentUser:req.user,treks:treks,top:top});
    }
    catch(err)
    {
        // console.log(err);
        res.redirect("/treks");
    }
});

//Endpoint to create csv dataset from the sql data
// router.get("/trekToCSV",async(req,res,next)=>{
//     try{
//         //console.log("dashkdaskjkasdjkdsajkasdjlasdjlas");
//         const treks=await Trek.findAll({attributes:['id','name','image','mean_rating','count_ratings']});
//         //console.log(treks);
//         const jsonData=JSON.parse(JSON.stringify(treks));
//         //console.log(jsonData);
//         // const path="../trekFlask/model.csv";
//         // let ws;
//         //     if (fs.existsSync(path)) {
//         //         ws = fs.createWriteStream(path,{flag:'w'});
//         //     }
//         //     else
//         //     ws = fs.createWriteStream(path);     
          
//         // fastcsv.write(jsonData, { headers: true }) .pipe(ws).on("finish", function() { console.log("Write to model.csv successfully!");});
//         res.status(200).json({message:"Call Success",treks:jsonData});    
//     }
//     catch(err){
//         // console.log(err);
//         res.status(404).json({mes:err});
//     }
// });

router.get("/", function(req, res) {
    const page=+req.query.page||1;
    let totalItems;
    const limit= ITEMS_PER_PAGE;
    const offset = (page-1)*ITEMS_PER_PAGE;
    Trek.findAll({limit,offset,order:[['createdAt','DESC']]}).then(treks=>{
        Trek.count()
        .then(count=>{
        totalItems=count;
        //   console.log('treks fetched');
        //   console.log(totalItems); 
        //   console.log(Math.ceil(totalItems/ITEMS_PER_PAGE));
          res.render("treks/index", { trek: treks,
             currentUser: req.user,
             currentPage:page,
             hasNextPage:ITEMS_PER_PAGE*page<totalItems,
             hasPreviousPage:page>1,
             total:totalItems>0,
             nextPage:page+1,
             previousPage:page-1,
             lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE)
            });         
         });
        })
         .catch(err=>{console.log(err);});

    // Campground.find({}, function(err, Allcampgrounds) {
    //     if (err) { console.log(err); } else { res.render("campgrounds/index", { camp: Allcampgrounds, currentUser: req.user }); }
    

    // });
});



router.post("/",
 middleware.isLoggedIn,
 function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    console.log(desc);
    
    req.user.createTrek({
        name:name,
        price:req.body.price,
        location:req.body.location,
        image:image,
        description:desc,
        creator:req.user.username
    }).
    then(result=>{
            // console.log(result);
            res.redirect('/treks');
        })
    .catch(err=>{console.log(err);})
 });

//     Campground.create({ name: name, image: image, description: desc }, function(err, newcampgnd) {
//         if (err) { console.log(err); } else {
//             newcampgnd.author.id = req.user._id;
//             newcampgnd.author.username = req.user.username;
//             newcampgnd.save(function(err, camp) {
//                 if (err) console.log(err);
//                 else console.log(camp);

//             });
//             res.redirect("/campgrounds");


//         }

//     });


// });
router.get("/new",
 middleware.isLoggedIn,
  function(req, res) {
    res.render("treks/new",{
        currentUser: req.user });
});
 router.get("/:id", async(req, res)=>{
     const trekId=req.params.id;
     let rating=0;
     try{
         const trek=await Trek.findByPk(trekId);
         if(!trek)
         {
             throw error;
         }
         console.log(trek);
         const comments=await trek.getComments();
         if(req.user)
         {
             const trekRat=await TrekRating.findOne({where:{trekId:trekId,userId:req.user.id}});
             if(trekRat)
             {
                const foundRating=await Rating.findByPk(trekRat.ratingId); 
                if(foundRating)
                rating=foundRating.value;               
             }
         }
         res.render("treks/show", { trek: trek, comments:comments ,currentUser:req.user,moment:moment,rating:rating});
     }
     catch(err)
    {
        console.log(err);
        res.redirect("/");
    }
});
 
//EDIT ROUTE
 router.get("/:id/edit",
  middleware.checkTrekOwnership,
  function(req, res) {
      const trekId=req.params.id;
  req.user.getTreks({where:{id:trekId}})
  .then(treks=>{
      const trek=treks[0];
    //   console.log(trek);
    res.render("treks/edit", { trek: trek,
        currentUser: req.user  });

  })
  .catch(err=>{
      console.log(err);
  });});


//     Campground.findById(req.params.id, function(err, campground) {
//         if (err) { req.flash("error", "Campground not Found!"); }
//         res.render("campgrounds/edit", { campground: campground });

//     });


// });



router.put("/:id", 
middleware.checkTrekOwnership,
 function(req, res) {
//     Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedcamp) {
//         if (err) { res.redirect("/campgrounds"); } else
//             res.redirect("/campgrounds/" + req.params.id);
//     });
console.log(req.body.description);
console.log("HIt Enpoint");
const trekId=req.params.id;
       Trek.findByPk(trekId)
       .then(trek=>{
           trek.name=req.body.name;
           trek.price=req.body.price;
           trek.location=req.body.location;
           trek.image=req.body.image;
           trek.description=req.body.description;
           return trek.save();
       }) 
       .then(result=>{
        console.log(req.body.description);
        console.log("HIt Enpoint");
           console.log("Updated Trek");
           res.redirect('/treks/'+trekId);
       })
       .catch(err=>{
           console.log(err);
       });


 });
 router.delete("/:id", 
 //middleware.checkCampgroundOwnership, 
 function(req, res) {
//     Campground.findByIdAndRemove(req.params.id, function(err, camprem) {
//         if (err) {
//             return res.redirect("/campgrounds");
//         }
//         Comment.deleteMany({ _id: { $in: camprem.comments } }, function(err) {
//             if (err) console.log(err);
//             else
//                 res.redirect("/campgrounds");

//         });


//     });
    Trek.findByPk(req.params.id)
    .then(trek=>{
        return trek.destroy();
    })
    .then(result=>{
        console.log("Trek Deleted");
        res.redirect('/treks');
    })
    .catch(err=>{
        console.log(err);
        res.redirect('/treks');
    });
        
          


 });



module.exports = router;