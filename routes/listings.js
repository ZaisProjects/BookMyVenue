// require('dotenv').config();
const express = require('express');
const router = express.Router({mergeParams : true});
const AsyncErr = require('../utils/wrapAsync.js');
const {isLoggedIn, validateListing} = require('../middleware.js');
const listingsController = require('../controllers/listings.js')
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });

// NEW ROUTE
router.get('/AddNew',isLoggedIn, listingsController.addNewVenueForm);
router.post('/AddNew',isLoggedIn,upload.single('listing[image]'),validateListing, AsyncErr(listingsController.addNewVenue));
router.get('/search', (req, res)=>{
    req.flash('error', `😔 SORRY! Search Feature is Coming Soon! Stay Tuned...`);
    res.redirect('/');
})

// ExpErr
router.use((err, req, res, next)=>{
    let{status=500, message="Something Went Wrong!"} = err;
    res.render('listingsRoute/error.ejs',{message});
});



module.exports = router;
