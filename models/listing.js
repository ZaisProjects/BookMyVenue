const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required : true
    },
    description: {
        type : String
    },
    image: {
        url: {
            type : String,
            default : "https://shishir.dev/img/travelly.jpg",
            set: (v) => v === "" ?"https://shishir.dev/img/travelly.jpg": v,
        },
        filename : String,
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews : [
        {

            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});
listingSchema.post("findOneAndDelete",async(venue)=>{
    if(venue){
        await Review.deleteMany({_id: {$in: venue.reviews}});
    }
});
const Listing = mongoose.model('Listing',listingSchema);
module.exports = Listing;

