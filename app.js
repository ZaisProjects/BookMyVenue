require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override'); 
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');

const app = express();
const port = 8080;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/templates"));

const mongoDB_URL = "mongodb://127.0.0.1:27017/staylist";
const dbUrl = process.env.ATLASDB_URL;



const Listing = require('./models/listing.js'); 
const AsyncErr = require('./utils/wrapAsync.js');
const ExpErr = require('./utils/ExpErr.js');
const listingsRouter = require('./routes/listings.js');
const venueRouter = require('./routes/venue.js');
const User = require('./models/user.js');
const passport = require('passport');
const userRouter = require('./routes/user');



app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(cookieParser());

// Database Connection:
async function main() {
    await mongoose.connect(dbUrl);
};
main().then((res) => {
    console.log('Successfully Connected to MongoDB...');
}).catch((err) => {
    console.log("Err in Connecting MongoDB",err);
});

// Session
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
});

store.on('error', ()=>{
    console.log("Error in mongo session store", err);
})

const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    },
};
app.use(session(sessionOptions));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash('error');
    res.locals.isActive = (path) => req.path === path ? 'text-primary fw-bolder' : '';
    next();
});

// Home Route:
app.get('/',AsyncErr(async(req,res)=>{
    const allListings = await Listing.find({}).populate('reviews');

    let totalRating = 0;
    let totalCount = 0;
    for (let listing of allListings) {
    for (let review of listing.reviews) {
        totalRating += review.rating;
        totalCount += 1;
    }}
    let rating = totalCount === 0 ? 0 : totalRating / totalCount;
    rating = rating.toFixed(2);

    res.render('listingsRoute/home.ejs',{allListings,rating});
}));

app.get('/listings', AsyncErr(async(req,res)=>{
    let lists = await Listing.find();
    res.render('listingsRoute/index.ejs',{lists});
}));

app.use('/listings', listingsRouter);
app.use('/venue', venueRouter);
app.use('/user', userRouter);

// WildCard Route:
app.all('/{*splat}', (req, res, next) => {
  next(new ExpErr(404, 'Page Not Found'));
});

// ExpErr
app.use((err, req, res, next)=>{
    let{status=500, message="Something Went Wrong!"} = err;
    res.render('listingsRoute/error.ejs',{message});
});

// Starting Server:
app.listen(port, ()=>{
    console.log("server is listening on port 8080");
});