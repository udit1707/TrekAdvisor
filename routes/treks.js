var express = require("express");
var router = express.Router();
var Trek = require("../models/trek");
var moment = require('moment');
// var methodOverride = require("method-override");
var middleware = require("../middleware/index.js");

router.use(methodOverride("_method"));

router.get("/", function(req, res) {
   
    Trek.findAll().then(treks=>{
          console.log('treks fetched'); 
          res.render("treks/index", { trek: treks,
             currentUser: req.user
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
    
    req.user.createTrek({
        name:name,
        price:req.body.price,
        image:image,
        description:desc,
        creator:req.user.username
    }).
    then(result=>{
            console.log(result);
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
// New Campground
router.get("/new",
 middleware.isLoggedIn,
  function(req, res) {
    res.render("treks/new",{
        currentUser: req.user });
});
 router.get("/:id", function(req, res) {
//     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
//         if (err) { console.log(err); } else { res.render("campgrounds/show", { campground: foundCampground }); }
//     });
let trek;
const trekId=req.params.id;
   Trek.findByPk(trekId)
   .then(trekk=>{
    trek=trekk;
    if(!trek)
    {
        res.redirect('/treks');
    }
    trek.getComments()
    .then(comments=>{
        res.render("treks/show", { trek: trek, comments:comments ,currentUser:req.user,moment:moment  });
    }).catch(err=>{console.log(err);});
})
 .catch(err=>{
       console.log(err);
   });
  

  

 });
//EDIT ROUTE
 router.get("/:id/edit",
  middleware.checkTrekOwnership,
  function(req, res) {
      const trekId=req.params.id;
  req.user.getTreks({where:{id:trekId}})
  .then(treks=>{
      const trek=treks[0];
      console.log(trek);
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
const trekId=req.params.id;
       Trek.findByPk(trekId)
       .then(trek=>{
           trek.name=req.body.name;
           trek.price=req.body.price;
           trek.image=req.body.image;
           trek.description=req.body.description;
           return trek.save();
       }) 
       .then(result=>{
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