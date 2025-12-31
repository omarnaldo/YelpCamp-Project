const express = require('express');
const router = express.Router();
const catchAsync= require('../utils/catchAsync.js');
const ExpressError=require('../utils/ExpressError.js')
const Campground = require('../models/campground.js');
const {campgroundSchema}= require('../schemas.js')


 const validateCampground=(req,res,next)=>{
   const {error} = campgroundSchema.validate(req.body.campground);
   if(error){
      const msg= error.details.map(el=>el.message).join(',')
      throw new ExpressError(msg, 400)
   }else{
      next(); }}



 router.get('/' , catchAsync(async (req,res) => {
    const campgrounds= await Campground.find({})
    res.render('campground/index', {campgrounds})
 }));


 router.get('/new', (req,res)=>{
   res.render('campground/new')
});

router.post('/', validateCampground, catchAsync( async(req,res, next)=>{
// if(!req.body.campground) throw new ExpressError('invalid Campground data', 400);
const campground= new Campground(req.body.campground);
await campground.save();
res.redirect(`/campgrounds/${campground._id}`)
}));


router.get('/:id', catchAsync(async (req,res)=>{
   const campground = await Campground.findById(req.params.id).populate('reviews')
   res.render('campground/show', {campground})
}));

router.get('/:id/edit', catchAsync(async (req,res)=>{
 const campground=await Campground.findById(req.params.id)
   res.render('campground/edit', {campground})
}));


router.put('/:id',validateCampground, catchAsync( async (req, res)=>{
   const { id } = req.params;
   const campground= await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true, runValidators: true })
   res.redirect(`/campgrounds/${campground._id}`)
}))


router.delete('/:id', catchAsync(async (req, res)=>{
   const { id }= req.params;
   await Campground.findByIdAndDelete(id);
   res.redirect('/campgrounds')
}))


module.exports = router;