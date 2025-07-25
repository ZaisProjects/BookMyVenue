const Listing = require('./models/listing.js');
const Review = require('./models/review.js')
const ExpErr = require('./utils/ExpErr.js');
const {listingSchema , reviewSchema} = require('./schema.js');

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error',"Login Required");
        return res.redirect('/user/login');   
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let venue = await Listing.findById(id);
    if(!(res.locals.currentUser && venue.owner._id.equals(res.locals.currentUser._id))){
        req.flash('error', "Permission Deined, Authorization failed ! ");
        return res.redirect(`/venue/${id}`);
    }
    next();
}
// Validation of Listings
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    console.log(error)
    if(error){
        throw new ExpErr(400,error);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    console.log(error)
    if(error){
        throw new ExpErr(400,error); 
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!(res.locals.currentUser && review.author._id.equals(res.locals.currentUser._id))){
        req.flash('error', "Permission Deined, Authorization failed ! ");
        return res.redirect(`/venue/${id}`);
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}; 