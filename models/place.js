const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Defining the schema
const placeSchema = new Schema({
    title : {type: String, required: true},
    description : {type: String, required: true},
    image: {type: String, required: true},
    address : {type: String, required: true},
    location: {
        lat: {type: Number, required: true},
        long: {type: Number, required: true},
    },
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
})

// Exporting the Places Model
module.exports = mongoose.model('Place', placeSchema);
