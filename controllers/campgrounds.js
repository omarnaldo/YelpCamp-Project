const Campground = require('../models/campground.js');

// rendering all camps
module.exports.index = async (req,res) => {
    const campgrounds= await Campground.find({})
    res.render('campground/index', {campgrounds})
 }

//  render for for creating new camp
 module.exports.renderNewForm =  (req,res)=>{
   res.render('campground/new')
}

// add a camp

module.exports.createCampground =  async(req,res, next)=>{
const campground= new Campground(req.body.campground);
campground.images =req.files.map(f=>({url:f.path, filename: f.filename})) // mapping over the pics to display them later
campground.author=req.user._id;
await campground.save();
console.log(campground)
console.log(req.files)
req.flash('success', 'Successfully made a new campground')
res.redirect(`/campgrounds/${campground._id}`)
}

// render the show page of camps

module.exports.showCampground = async (req,res)=>{
   const campground = await Campground.findById(req.params.id).populate({
      path:'reviews',
      populate:{
         path:'author'
      }
      }).populate('author')
   if(!campground){
      req.flash('error', 'Cannot find that campground')
      return res.redirect('/campgrounds')
  }
   res.render('campground/show', {campground})
}

//render edit form camp

module.exports.renderEditForm = async (req,res)=>{
   const {id} = req.params;
   const campground=await Campground.findById(id);
 if(!campground){
      req.flash('error', 'Cannot find that campground')
      return res.redirect('/campgrounds')
  };
   res.render('campground/edit', {campground})
}

//edit camp


module.exports.editCampground =  async (req, res)=>{
   const { id } = req.params;
 const campground= await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true, runValidators: true })
   req.flash('success', 'Successfully updated campground')  
   res.redirect(`/campgrounds/${id}`)
}

//delete camp

module.exports.deleteCampground = async (req, res)=>{
   const { id }= req.params;
   await Campground.findByIdAndDelete(id);
         req.flash('success', 'Successfully deleted campground')
   res.redirect('/campgrounds')
}