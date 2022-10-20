const Place = require('../models/place');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    // Getting the place as per the given place id(pid)
    try{
        place = await Place.findById(placeId);
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not find the Place.', 500);
        return next(error);
    }

    if(!place){
        const error = new HttpError('Could not find the place with the provided id.', 404);
        return next(error);
    }

    res.json({place: place.toObject({getters: true})});
}

const getPlaceByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let places;
    // Getting the place as per the given place id(pid)
    try{
        places = await Place.find({creator: userId});
    }
    catch(err){
        const error = new HttpError('Fetching places failed, please try again later.', 500);
        return next(error);
    }

    if(!places || places.length===0){
        const error = new HttpError('Could not find the places with the provided user id.', 404);
        return next(error);
    }

    res.json({places: places.map(place => place.toObject({getters: true}))});
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new HttpError("Invalid input passed, please check your data", 422);
        return next(error);
    }
    const { title, description, location, address, creator} = req.body;
    
    const createdPlace = new Place({
        title,
        address,
        description,
        image: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Ftechcrunch.com%2Fwp-content%2Fuploads%2F2016%2F06%2F2016-06-27_1940.png&imgrefurl=https%3A%2F%2Ftechcrunch.com%2F2016%2F06%2F28%2Fmongodb-launches-atlas-its-new-database-as-a-service-offering%2F&tbnid=dEZBwBhNrgSCzM&vet=12ahUKEwjPo9TvpuT6AhWg73MBHbeFBywQMygAegUIARDAAQ..i&docid=jnnEgFTwaAZ3DM&w=1255&h=664&q=mongo%20db%20atlas&ved=2ahUKEwjPo9TvpuT6AhWg73MBHbeFBywQMygAegUIARDAAQ',
        location:location,
        creator
    });

    let user;

    try{
        user = await User.findById(creator);
    }
    catch(err){
        const error = new HttpError('Created place failed, please try again', 500);
        return next(error);
    }

    if(!user){
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        await sess.commitTransaction();
    }
    catch(err){
        console.log(err);
        const error = new HttpError('Created place failed, please try again', 500);
        return next(error);
    }
    res.status(201).json({place: createdPlace})
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new HttpError("Invalid input passed, please check your data", 422);
        return next(error);
    }
    const { title, description} = req.body;
    const placeId = req.params.pid;
    let place;
    // Getting the place as per the given place id(pid)
    try{
        place = await Place.findById(placeId);
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not update Place.', 500);
        return next(error);
    }

    if(!place){
        const error = new HttpError('Could not find the place with the provided id.', 404);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try{
        await place.save();
    }
    catch(err){
        const error = new HttpError("Something went wrong, could not update place", 500);
        return next(error);
    }

    res.status(200).json({place: place.toObject({getters:true})});
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    // Getting the place as per the given place id(pid)
    try{
        place = await Place.findById(placeId).populate('creator');
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not delete Place.', 500);
        return next(error);
    }

    if(!place){
        const error = new HttpError('Could not find the place with the provided id.', 404);
        return next(error);
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session:sess});
        place.creator.places.pull(place);
        await place.creator.save({session:sess});
        await sess.commitTransaction();
    }
    catch(err){
        const error = new HttpError('Something went wrong, could not delete Place.', 500);
        return next(error);
    }

    return res.status(200).json({message: "Deleted the place"});
}





// Exporting the controller functions
exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;