// require('dotenv').config();
const express = require('express');
const router = express.Router({mergeParams : true});
const AsyncErr = require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner,validateListing, validateReview, isReviewAuthor} = require('../middleware.js');
const venueController = require('../controllers/venue.js');
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });

//Search Route:
router.get('/search', AsyncErr(venueController.searchVenue)); 

// Show Route
router.get('/:id',AsyncErr(venueController.showVenue));

// Edit Venue
router.get('/:id/edit',isLoggedIn, isOwner,validateListing, AsyncErr(venueController.editVenueForm));
router.put('/:id/edit',isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, AsyncErr(venueController.editVenue));

// Reviews Route:
router.post('/:id/reviews',isLoggedIn,validateReview, AsyncErr(venueController.reviewVenue));

// Reviews Delete Route:
router.delete('/:id/review/:reviewId',isLoggedIn, isReviewAuthor, AsyncErr(venueController.deleteReview));


// Delete Venue:
router.delete('/:id/delete',isLoggedIn,isOwner, AsyncErr(venueController.deleteVenue));

// ExpErr
router.use((err, req, res, next)=>{
    console.log(err);
    let{status=500, message="Something Went Wrong!"} = err;
    res.render('listingsRoute/error.ejs',{message}); 
});

module.exports = router;