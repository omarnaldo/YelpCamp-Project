if(process.env.NODE_ENV !=='production'){
   require('dotenv').config({silent: true});
}


const express= require('express');
const path= require('path');
const mongoose= require('mongoose');  
const ejsMate = require('ejs-mate');
const methodOverride= require('method-override');
const ExpressError=require('./utils/ExpressError.js')
const flash= require('connect-flash')
const session = require('express-session')
const passport= require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user.js')
const helmet = require('helmet');
const { MongoStore } = require('connect-mongo');

const dbUrl = 'mongodb://localhost:27017/yelp-camp'


// routes
const campgroundRoutes = require('./routes/campground.js')
const reviewsRoutes = require('./routes/review.js')
const usersRoutes = require('./routes/users.js')


mongoose.connect(dbUrl
,  )
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
app.use(express.static(path.join(__dirname, 'public')))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

const sessionConfig = {
    name: 'session',
   secret: 'this should be a better secret',
   resave :false,
   saveUninitialized :true,
   cookie: {
    httpOnly: true,
   // secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
}
}
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "https://api.maptiler.com/",
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzbciez6r/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);





app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
   console.log(req.query)
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error')
   next();
})




app.use('/', usersRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes )

app.use('/campgrounds', campgroundRoutes)


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