const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await mongoose.connect(config.databaseUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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