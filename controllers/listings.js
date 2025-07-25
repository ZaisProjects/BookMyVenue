const Listing = require('../models/listing.js');

module.exports.addNewVenueForm = (req,res)=>{
         res.render('listingsRoute/newListing.ejs');
}
module.exports.addNewVenue = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newVenue = new Listing(req.body.listing);
    newVenue.owner = req.user._id;
    newVenue.image = {url,filename};
    await newVenue.save();
    req.flash('success',"Venue Added Successfully!");
    res.redirect('/listings');
};