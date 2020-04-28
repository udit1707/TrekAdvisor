var Comment = require("../models/comment");
var Trek = require("../models/trek");
var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req, res, next) {

    if (req.isAuthenticated()) {

        Trek.findById(req.params.id, function(err, trek) {
            if (err) {
                req.flash("error", "Trek not found!");
                res.redirect("back");
            } else {
                if (trek.author.id.equals(req.user._id))
                    next();
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }


        });


    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {

        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) res.redirect("back");
            else {
                if (comment.author.id.equals(req.user._id))
                    next();
                else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }

            }


        });


    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.flash("error", "You need to be logged in to do that !!");
    res.redirect("/login");
}

module.exports = middlewareObj;