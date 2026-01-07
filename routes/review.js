const express = require('express')
const router = express.Router({mergeParams : true});
const catchAsync= require('../utils/catchAsync.js');
const ExpressError=require('../utils/ExpressError.js')
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const {validateReview} = require('../middleware.js')





router.post('/',validateReview, catchAsync(async(req,res)=>{
   const campground = await Campground.findById(req.params.id);
   const review = new Review(req.body.review);
   campground.reviews.push(review);
   await campground.save();
   await review.save();
   req.flash('success', 'Created new Review!');
   res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async(req,res)=>{
   const {id, reviewId} = req.params;
   Campground.findByIdAndUpdate(id,{$pull:{reviews :reviewId}})
   await Review.findByIdAndDelete(reviewId);
   req.flash('success', 'Successfully deleted review')

   res.redirect(`/campgrounds/${id}`)
}))



module.exports = router;