const Review = require('../models/review.js'); 
const Listing = require('../models/listing.js');

module.exports.showVenue = async (req,res,next)=>{
    let {id} = req.params;
    let venue = await Listing.findById(id).populate({path: 'reviews', populate : ({path : 'author'})}).populate('owner');
    if(!venue){
        req.flash('error',"No such Venue!");
        res.redirect('/listings');
    }else{
        const listing = await Listing.findById(req.params.id).populate('reviews');

        let total = 0;
        for (let review of listing.reviews) {
            total += review.rating;
        }
        const averageRating = listing.reviews.length === 0 ? 0 : (total / listing.reviews.length).toFixed(2);
        res.render('listingsRoute/show.ejs',{venue, averageRating});
    }
}; 

module.exports.editVenueForm = async (req,res)=>{
    let {id} = req.params;
    let venue = await Listing.findById(id);
    res.render('listingsRoute/editVenue.ejs',{venue});
};

module.exports.editVenue =async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});  //Decontructing in single values
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename}
        await listing.save();
    }
    
    req.flash('success',"Venue Edited Successfully!");
    res.redirect(`/venue/${id}`);
};

module.exports.reviewVenue = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash('success',"Review Added Successfully!");
    res.redirect(`/venue/${req.params.id}`);
};

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : `${reviewId}`}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',"Review Deleted Successfully!");
    res.redirect(`/venue/${id}`);
};

module.exports.searchVenue = async(req, res,next) => {
    req.flash('error', 'Not Working');
    return res.redirect('/listings');

    // let { q } = req.query;
    // // console.log(q);
    // let venues = await Listing.find({ title: q }).populate({path: 'reviews', populate : ({path : 'author'})}).populate('owner');
    // console.log("Search result:",venues);
    // if(venues.length === 0){
    //     req.flash('error', 'No Such Venue is Listed');
    //     return res.redirect('/');
    // }
    // let venue = venues[0];
    // //venue = venue.populate('reviews').populate('owner');
    // res.render('listingsRoute/show.ejs',{venue});
}

module.exports.deleteVenue = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success',"Venue Deleted Successfully!");
    res.redirect('/listings');
};

