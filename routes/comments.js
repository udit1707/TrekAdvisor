var express = require("express");
var router = express.Router({ mergeParams: true });
var Comment = require("../models/comment");
var Trek = require("../models/trek");
var middleware = require("../middleware/index.js");


router.get("/new"
//, middleware.isLoggedIn
, function(req, res,next) {
    Trek.findAll({where:{id:req.params.id}})
    .then(treks=>{
        res.render("comments/new", { trek: treks[0] }); 
    })
    .catch(err=>{
        console.log(err);
    });

});
router.post("/", 
//middleware.isLoggedIn,
 function(req, res) {
     const trekId=req.params.id;
     const text=req.body.text;
        req.user.createComment({text:text})
        .then(comment=>{
            return Trek.findByPk(trekId)
            .then(trek=>{
                return trek.addComment(comment);
            }).
            catch(err=>{
                console.log(err);
            });
        })
        .then(result=>{
            res.redirect("/treks/" + trekId);
        })
        .catch(err=>{
            console.log(err);
        });



    // Campground.findByd(req.params.id, function(err, campground) {
    //     if (err)
    //         res.redirect("/");
    //     else {
    //         Comment.create(req.body.comment, function(err, comment) {
    //             if (err) req.flash("error", "Something Went Wrong!!");
    //             else {
    //                 comment.author.id = req.user._id;
    //                 comment.author.username = req.user.username;
    //                 comment.save();
    //                 campground.comments.push(comment);
    //                 campground.save();
    //                 req.flash("success", "Successfully added comment!");
    //                 res.redirect("/campgrounds/" + campground._id);
    //             }
    //         });
    //     }
    // });

});

//Edit
router.get("/:commentId/edit",
 //middleware.checkCommentOwnership,
  function(req, res) {
      req.user.getComments({where:{id:req.params.commentId}})
    .then(comments=>{
        res.render("comments/edit", { trekId: req.params.id, comment: comments[0] });

    })
    .catch(err=>{
        console.log(err);
    }); 
   




});
router.put("/:comment_id",
//middleware.checkCommentOwnership, 
function(req, res) {
    var updatedText=req.body.text;

    Comment.findByPk(req.params.comment_id)
    .then(comment=>{
        comment.text=updatedText;
        return comment.save();
    }).
    then(resut=>{
        res.redirect("/treks/" + req.params.id);
    })
    .catch(err=>{
        console.log(err);
    });
});
router.delete("/:comment_id",
 //middleware.checkCommentOwnership, 
 function(req, res) {
    Comment.findByPk(req.params.comment_id)
    .then(comment=>{
        return comment.destroy();
    })
    .then(result=>{
        res.redirect("/treks/" + req.params.id); 
       })
    .catch(err=>{
        console.log(err);
    });
     
  

});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/login");

}


module.exports = router;