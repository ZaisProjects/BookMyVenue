const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js'); 

const mongoDB_URL = "mongodb://127.0.0.1:27017/staylist";

async function main() {
    await mongoose.connect(mongoDB_URL);
};
main().then((res) => {
    console.log('Successfully Connected to MongoDB');
}).catch((err) => {
    console.log("Err in Connecting MongoDB",err);
});

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj, owner : "687e6d8edb91c15954edf890"}))
    await Listing.insertMany(initData.data);
    console.log("Data Initialized");
};

initDB();