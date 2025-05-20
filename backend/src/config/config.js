require('dotenv').config();
module.exports = {
    PORT: process.env.PORT || 3000,
    DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/subscription-delivery',
    API_KEY: process.env.API_KEY || 'your_api_key_here',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_here',
    NODE_ENV: process.env.NODE_ENV || 'development',
};