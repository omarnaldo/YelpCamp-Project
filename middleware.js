const Campground = require('./models/campground')
const ExpressError=require('./utils/ExpressError.js')
const {campgroundSchema,reviewSchema}= require('./schemas.js')


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.returnTo = req.originalUrl
      req.flash('error', 'you must signed in first')
     return res.redirect('/login')
 } next();
} 

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
} 

   // middleware for checking campground validation

 module.exports.validateCampground=(req,res,next)=>{
   const {error} = campgroundSchema.validate(req.body.campground);
   if(error){
      const msg= error.details.map(el=>el.message).join(',')
      throw new ExpressError(msg, 400)
   }else{
      next(); }}

// middleware for checking authorization

module.exports.isAuthor = async (req,res,next)=>{
   const {id} = req.params;
   const campground = await Campground.findById(id);
 if(!campground.author.equals(req.user._id)){
      req.flash('error', 'you dont have permission to edit this')
     return  res.redirect(`/campgrounds/${id}`);
   }
  next();
};

// review vaildtion, i have already put some client side vaildation but this to make sure nobody would sent an empty rev through postman
module.exports.validateReview = (req,res,next)=>{
   const {error} = reviewSchema.validate(req.body.Review);
   if(error){
      const msg = error.details.map(el=>el.message).join(',')
      throw new ExpressError(msg,400)
   }else{next();}}

