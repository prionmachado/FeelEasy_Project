const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
const { object } = require('joi');

// Connect to MongoDB
const mongoURL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

async function main(){
    await mongoose.connect(mongoURL); 
}

const initDB = async () => {
    try {
        // Clear existing listings
        await Listing.deleteMany({});
        console.log("Cleared existing listings.");
        initData.data = initData.data.map((obj) => ({...obj, owner: '69cb9ae26329651048232ef9'}));  
        // Insert new listings from data.js
        await Listing.insertMany(initData.data);
        console.log("Database initialized with data.");
    } catch (err) {
        console.error("Error initializing database:", err);
    } finally {
        mongoose.connection.close();
    }
};

initDB();