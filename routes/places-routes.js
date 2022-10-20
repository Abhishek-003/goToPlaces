const express = require('express');
const HttpError = require('../models/http-error');
const { check } = require('express-validator');

// Importing the places controllers
const placesControllers = require("../controllers/places-controllers");

const router = express.Router();


router.get('/:pid', placesControllers.getPlaceById);
router.get('/user/:uid/', placesControllers.getPlaceByUserId);
router.post('/', [check('title').not().isEmpty(), check('description').isLength({min: 5}), check('address').not().isEmpty()], placesControllers.createPlace);
router.patch('/:pid', [check('title').not().isEmpty(), check('description').isLength({min: 5})], placesControllers.updatePlace);
router.delete('/:pid', placesControllers.deletePlace);

module.exports=router;