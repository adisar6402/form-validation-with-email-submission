const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const testConnection = async () => {
    try {
        // Remove deprecated options
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    }
};

testConnection();
