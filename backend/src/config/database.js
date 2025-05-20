const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('MONGO_URI:', config.DB_URI);
        await mongoose.connect(config.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;