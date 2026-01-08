const express = require('express');
const router = express.Router();
const catchAsync= require('../utils/catchAsync.js');
const Campground = require('../models/campground.js');
const {isLoggedIn} = require('../middleware.js')
const {isAuthor} =require('../middleware.js')
const {validateCampground} = require ('../middleware.js');
const { campgroundSchema } = require('../schemas.js');
const campgrounds = require('../controllers/campgrounds.js');
const campground = require('../models/campground.js');


 router.get('/' , catchAsync(campgrounds.index));


 router.get('/new',isLoggedIn, campgrounds.renderNewForm );

router.post('/', validateCampground, catchAsync(campgrounds.createCampground));


router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


router.put('/:id',validateCampground, isAuthor, catchAsync(campgrounds.editCampground))


router.delete('/:id', isAuthor,catchAsync(campgrounds.deleteCampground))


module.exports = router;