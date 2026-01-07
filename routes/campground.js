const express = require('express');
const router = express.Router();
const catchAsync= require('../utils/catchAsync.js');
const Campground = require('../models/campground.js');
const {isLoggedIn} = require('../middleware.js')
const {isAuthor} =require('../middleware.js')
const {validateCampground} = require ('../middleware.js')


 router.get('/' , catchAsync(async (req,res) => {
    const campgrounds= await Campground.find({})
    res.render('campground/index', {campgrounds})
 }));


 router.get('/new',isLoggedIn, (req,res)=>{
   res.render('campground/new')
});

router.post('/', validateCampground, catchAsync( async(req,res, next)=>{
const campground= new Campground(req.body.campground);
campground.author=req.user._id;
await campground.save();
req.flash('success', 'Successfully made a new campground')
res.redirect(`/campgrounds/${campground._id}`)
}));


router.get('/:id', catchAsync(async (req,res)=>{
   const campground = await Campground.findById(req.params.id).populate('reviews').populate('author')
   if(!campground){
      req.flash('error', 'Cannot find that campground')
      return res.redirect('/campgrounds')
  }
   res.render('campground/show', {campground})
}));

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(async (req,res)=>{
   const {id} = req.params;
   const campground=await Campground.findById(id);
 if(!campground){
      req.flash('error', 'Cannot find that campground')
      return res.redirect('/campgrounds')
  };
   res.render('campground/edit', {campground})
}));


router.put('/:id',validateCampground, isAuthor, catchAsync( async (req, res)=>{
   const { id } = req.params;
 const campground= await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true, runValidators: true })
   req.flash('success', 'Successfully updated campground')  
   res.redirect(`/campgrounds/${id}`)
}))


router.delete('/:id', isAuthor,catchAsync(async (req, res)=>{
   const { id }= req.params;
   await Campground.findByIdAndDelete(id);
         req.flash('success', 'Successfully deleted campground')
   res.redirect('/campgrounds')
}))


module.exports = router;