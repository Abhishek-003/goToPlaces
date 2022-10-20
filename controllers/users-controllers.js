const httpError = require('../models/http-error');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {validationResult} = require('express-validator');

const getUsers = async (req, res, next) => {
    let users;

    try{
        users = await User.find({},'-password');
    }
    catch(err){
        const error = new httpError("Fetching users failed, please try again later", 500);
        return next(error);
    }

    res.status(200).json({users: users.map(user => user.toObject({getters:true}))});
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new httpError("Invalid input passed, please check your data", 422);
        return next(error);
    }
    const {name, email, password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email:email});
    }
    catch(err){
        const error = new httpError('Signing up failed, please try again later', 500);
        return next(error);
    }

    if(existingUser){
        const error = new httpError('User exist already, please login', 422);
        return next(error);
    }

    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    }
    catch(err){
        const error = new httpError("Could not signup, please try again.", 500);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Ftechcrunch.com%2Fwp-content%2Fuploads%2F2016%2F06%2F2016-06-27_1940.png&imgrefurl=https%3A%2F%2Ftechcrunch.com%2F2016%2F06%2F28%2Fmongodb-launches-atlas-its-new-database-as-a-service-offering%2F&tbnid=dEZBwBhNrgSCzM&vet=12ahUKEwjPo9TvpuT6AhWg73MBHbeFBywQMygAegUIARDAAQ..i&docid=jnnEgFTwaAZ3DM&w=1255&h=664&q=mongo%20db%20atlas&ved=2ahUKEwjPo9TvpuT6AhWg73MBHbeFBywQMygAegUIARDAAQ',
        places: []
    });

    try{
        await createdUser.save();
    }
    catch(err){
        const error = new httpError("Could not signup, please try again.", 500);
        return next(error);
    }

    res.status(201).json({createdUser: createdUser.toObject({getters:true})});
}

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new httpError("Invalid input passed, please check your data", 422);
        return next(error);
    }
    const {email, password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email:email});
    }
    catch(err){
        const error = new httpError('Login failed, please try again later', 500);
        return next(error);
    }

    if(!existingUser){
        const error = new httpError('Invalid credentials, could not log you in', 401);
        return next(error);
    }

    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    }
    catch(err){
        const error = new httpError('Login failed, please try again later', 500);
        return next(error);
    }

    if(!isValidPassword){
        const error = new httpError('Invalid credentials, could not log you in', 401);
        return next(error);
    }

    res.status(200).json({message: 'Logged in sucessfully'});

}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;