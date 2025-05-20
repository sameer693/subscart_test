require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const app = require('./app');
const connectDB = require('./config/database');
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        console.log('Connecting to the database...');
        console.log('DB_URI:', config.DB_URI);
        connectDB();
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};

startServer();