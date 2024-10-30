const mongoose = require('mongoose');
require('dotenv').config();

// Load the MongoDB URI from the environment variable
const uri = process.env.MONGODB_URI;

const testConnection = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    }
};

// Run the connection test
testConnection();
