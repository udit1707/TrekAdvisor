var express = require("express");
var moment=require('moment');
var router = express.Router({ mergeParams: true });
var Trek = require("../models/trek");
const Rating=require('../models/rating');
const axios = require('axios').default;
const TrekRating=require('../models/trek-rating');
var middleware = require("../middleware/index.js");
const User = require("../models/user");
const { compareSync } = require("bcryptjs");

router.post('/',middleware.isLoggedIn,async(req,res,next)=>{
    const trek_id=req.params.id;
    const value=req.body.rating;let sum=0,mean=0,count=0;
    try{
        const foundTrek=await TrekRating.findOne({where:{trekId:trek_id,userId:req.user.id}});
        if(foundTrek)
        {
            const rating=await Rating.findByPk(foundTrek.ratingId);
            rating.value=value;
            await rating.save();
            const trek=await Trek.findByPk(trek_id);
            const trek_ratings=await trek.getRatings();
            if(trek_ratings.length!=0)
            {for(let i=0;i<trek_ratings.length;i++)
            sum+=trek_ratings[i].value;
            mean=sum/trek_ratings.length;
            trek.mean_rating=mean;
            await trek.save();}            
        }
        else
        {
            const trek=await Trek.findByPk(trek_id);
            const rating=await Rating.create({value:value});
            const trekRat=await trek.addRating(rating);
            const user=await User.findByPk(req.user.id);
            await user.addTrekRating(trekRat);
            const trek_ratings=await trek.getRatings();
            if(trek_ratings.length!=0)
            {for(let i=0;i<trek_ratings.length;i++)
            sum+=trek_ratings[i].value;
            mean=sum/trek_ratings.length;
            trek.mean_rating=mean;
            trek.count_ratings=trek_ratings.length;
            await trek.save();}
        }
       res.redirect("/treks/" + trek_id);
    }
    catch(err)
    {
        console.log(err);
        res.redirect("/");
    }
});

module.exports=router;