if (process.env.NODE_ENV != 'production') {
    require('dotenv').config({ path: "../.env" });
};

const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const dbUrl = process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB");
}

const initDB = async () => { 
    try {
        await Listing.deleteMany({});
        console.log("Cleared existing listings.");

        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: '69d0f1d23fb0dc30e663c0ac'
        }));

        await Listing.insertMany(initData.data);
        console.log("Database initialized with data.");
    } catch (err) {
        console.error("Error initializing database:", err);
    } finally {
        mongoose.connection.close();
    }
};

main().then(initDB);