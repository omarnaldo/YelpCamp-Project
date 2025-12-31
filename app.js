const express= require('express');
const path= require('path');
const mongoose= require('mongoose');  
const ejsMate = require('ejs-mate');
const methodOverride= require('method-override');
const ExpressError=require('./utils/ExpressError.js')
const campgrounds = require('./routes/campground.js')
const reviews = require('./routes/review.js')


mongoose.connect('mongodb://localhost:27017/yelp-camp',)
const db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', ()=> {
 console.log("Connected to MongoDB!");});

const app = express();


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

 

app.use('/campgrounds/:id/reviews', reviews )

app.use('/campgrounds', campgrounds)


 app.get('/' , (req,res) => {
    res.render ('home')
 });


app.all(/(.*)/, (req, res, next) => {
next( new ExpressError('page not found', 404))})


app.use((err,req,res,next)=>{
   const{message ='something is wrong' ,statusCode=500}= err;
   if(!err.message) err.message= 'Something went wrong'
   res.status(statusCode).render('partials/error', {err})
})

 app.listen(3000,()=>{
    console.log('Serving on port 3000! ')
 });  