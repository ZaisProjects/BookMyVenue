const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type : String,
        required : true,
    },
    bookings: [
        { type: Schema.Types.ObjectId, ref: "Booking" } // link to Booking documents
    ]
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

module.exports = User;
