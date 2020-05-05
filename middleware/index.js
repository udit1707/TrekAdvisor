var Comment = require("../models/comment");
var Trek = require("../models/trek");
var middlewareObj = {};
middlewareObj.checkTrekOwnership = function(req, res, next) {

    if (req.session.isLoggedIn) {

        Trek.findByPk(req.params.id)
        .then(trek=>{
            if(trek.userId!==req.user.id)
            {
                   return res.redirect("back");
            }
           next();
        })
        .catch(err=>{
            if (err) {
                return res.redirect("back");
            }
        });
    }
     else {
        return res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.session.isLoggedIn) {

        Comment.findByPk(req.params.commentId)
        .then(comment=>{
            if(comment.userId!==req.user.id)
            {
                   return res.redirect("back");
            }
            return next();
            
        })
        .catch(err=>{
            if (err) return res.redirect("back");
        }); 

    } else {
        return res.redirect("/login");
    }
}
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.session.isLoggedIn)
        {  console.log("Logged In");
            return next();}
    return res.redirect("/login");
}

module.exports = middlewareObj;