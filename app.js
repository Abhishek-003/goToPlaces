const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('routes/places-routes');
const usersRoutes = require('routes/users-routes');
const httpError = require('models/http-error');

const app = express()

// Parsing the HTTP request
app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

// Handling errors for unsupported routes
app.use((req, res, next) => {
    const error = new httpError("Could not find this route.", 404);
    throw error;
});


app.use('/api/places/', pl)