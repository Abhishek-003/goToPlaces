const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// Defining the schema
const userSchema = new Schema({
    name: {type: String, required: true},
    email : {type: String, required: true, unique:true},
    password: {type: String, required: true, minlength:6},
    image : {type: String, required: true},
    places : [{type: mongoose.Types.ObjectId, required: true, ref: 'Place'}]
})

// For validating the uniqueness of the given email
userSchema.plugin(uniqueValidator);

// Exporting the Users Model
module.exports = mongoose.model('User', userSchema);