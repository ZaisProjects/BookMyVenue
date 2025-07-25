const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync');
const userController = require('../controllers/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const User = require('../models/user.js');

// SIGNUP 
router.get('/signup',(req,res)=>{
    res.render("users/signup.ejs");
});
router.post('/signup', wrapAsync(async(req,res)=>{
        let{username, email, password} = req.body;
        let newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(err) =>{
            if(err){
                next(err);
            }
            req.flash("success",`WelCome ${username}`);
            res.redirect('/');
        });
}));

// LOGIN
router.get('/login', (req,res)=>{
     res.render("users/login.ejs");
});
router.post('/login', 
    saveRedirectUrl,
    passport.authenticate('local',{
        failureRedirect: '/user/login', 
        failureFlash : true,}),
        userController.userLogin
    );

// LOG OUT
router.get('/logout',userController.userLogout);

module.exports = router; 
