const getPlaceById = (req, res, next) => {

}

const getPlaceByUserId = (req, res, next) => {

}

const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator} = req.body;
}

const updatePlace = (req, res, next) => {
    const { title, description} = req.body;
    const placeId = req.params.pid; 
}

const deletePlace = (req, res, next) => {

}





exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;