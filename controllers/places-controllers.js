const Place = require('../models/place');
const HttpError = require('../models/http-error');

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
    const { title, description, coordinates, address, creator} = req.body;
    
    const createdPlace = new Place({
        title,
        address,
        description,
        image: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Ftechcrunch.com%2Fwp-content%2Fuploads%2F2016%2F06%2F2016-06-27_1940.png&imgrefurl=https%3A%2F%2Ftechcrunch.com%2F2016%2F06%2F28%2Fmongodb-launches-atlas-its-new-database-as-a-service-offering%2F&tbnid=dEZBwBhNrgSCzM&vet=12ahUKEwjPo9TvpuT6AhWg73MBHbeFBywQMygAegUIARDAAQ..i&docid=jnnEgFTwaAZ3DM&w=1255&h=664&q=mongo%20db%20atlas&ved=2ahUKEwjPo9TvpuT6AhWg73MBHbeFBywQMygAegUIARDAAQ',
        location:coordinates,
        creator
    });

    try{
        await createdPlace.save();
    }
    catch(err){
        const error = new HttpError('Created place failed, please try again', 500);
        return next(error);
    }
    res.status(201).json({place: createdPlace})
}

/*const updatePlace = (req, res, next) => {
    const { title, description} = req.body;
    const placeId = req.params.pid; 
}

const deletePlace = (req, res, next) => {

}*/





exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
// exports.updatePlace = updatePlace;
// exports.deletePlace = deletePlace;