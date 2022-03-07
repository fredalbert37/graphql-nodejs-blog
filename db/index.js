const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb://localhost/test')
    console.log('MongoDB connected');
};

module.exports = {connectDB}

//freddy123