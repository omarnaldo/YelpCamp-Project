const express = require('express');
const router = express.Router();
const catchAsync= require('../utils/catchAsync.js');
const {isLoggedIn} = require('../middleware.js')
const {isAuthor} =require('../middleware.js')
const {validateCampground} = require ('../middleware.js');
const campgrounds = require('../controllers/campgrounds.js');

router.route('/')
 .get(catchAsync(campgrounds.index))
 .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new',isLoggedIn, campgrounds.renderNewForm );

router.route ('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(validateCampground, isAuthor, catchAsync(campgrounds.editCampground))
.delete( isAuthor,catchAsync(campgrounds.deleteCampground))




router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));



module.exports = router;