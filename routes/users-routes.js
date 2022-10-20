const express = require('express');
const HttpError = require('../models/http-error');
const {check} = require('express-validator');

//Importing the users controllers
const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get('/', usersControllers.getUsers);
router.post('/signup', [check('name').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({min: 6})], usersControllers.signup);
router.post('/login', check('email').normalizeEmail().isEmail(), usersControllers.login);


module.exports = router;