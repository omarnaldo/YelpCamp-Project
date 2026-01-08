const User = require('../models/user')


//rendering registration  form

module.exports.renderRegisterForm = (req,res)=>{
res.render('usersAuth/register')
}

//registering a user
module.exports.createUser =async(req,res,next)=>{
    try{
    const {username,email,password} = req.body;
    const user = new User({username,email})
    const registeredUser = await User.register(user,password)
    req.login(registeredUser, err=>{
        if(err)return next(err);    
  req.flash('success', 'Welcome to YelpCamp!')
    res.redirect ('/campgrounds')  
 })}catch(e){
        req.flash('error',e.message)
        res.redirect('register')
    }}

    //rendering login form
module.exports.renderLoginForm = (req,res)=>{
    res.render('usersAuth/login')
}

// login

module.exports.login = (req,res)=>{
req.flash('success', 'Welcome back to YelpCamp!')
const redirectUrl = res.locals.returnTo || '/campgrounds'; 
delete req.session.returnTo
    res.redirect (redirectUrl)
}

//logout
module.exports.logout = (req,res,next)=>{
    req.logout(function (err){
        if(err){return next(err)}
    req.flash('success', 'Goodbye')
    res.redirect('/campgrounds')
});
} 