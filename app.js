const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const httpError = require('./models/http-error');
const mongoose = require('mongoose');

const app = express()

// Parsing the HTTP request
app.use(bodyParser.json());
const mongodbUrl = 'mongodb+srv://skabhishekgz6:wzBtYsGM8MoCbMou@cluster0.r5jtykb.mongodb.net/?retryWrites=true&w=majority';

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);


app.use((req, res, next) => {
     const error = new httpError("Could not find this route.", 404);
     throw error;
});

app.use((error, req, res, next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occured'});
});



mongoose.
connect(mongodbUrl).
then(() => {
    app.listen(5000);
    console.log("Database connected");
})
.catch(err => {
    console.log(err);
})