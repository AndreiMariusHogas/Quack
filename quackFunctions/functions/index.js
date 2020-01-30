const functions = require('firebase-functions');
//Express init
const express = require('express');
const app = express();

//Import Handlers
//Quacks
const { getAllQuacks } = require('./handlers/quacks');
const { postOneQuack } = require('./handlers/quacks');
const { getQuack } = require('./handlers/quacks');
const { commentOnQuack } = require('./handlers/quacks');
//Users
const { signup } = require('./handlers/users');
const { login } = require('./handlers/users');
const { uploadImage } = require('./handlers/users');
const { addUserDetails } = require('./handlers/users');
const { getAuthenticatedUser }= require('./handlers/users');
//Functions 
const isLoggedIn = require('./utility/isLoggedIn');
//Routes
//Quacks
//Get all Quacks Route
app.get('/quacks', getAllQuacks);
//Create new quack route
app.post('/quack', isLoggedIn , postOneQuack);
//Get One Quack
app.get('/quack/:quackId', getQuack);
//Comment on Quack
app.post('/quack/:quackId/comment', isLoggedIn, commentOnQuack)

//User
//Signup Route
app.post('/signup', signup);
//Login Route
app.post('/login', login);
//Image Upload
app.post('/user/image', isLoggedIn, uploadImage);
//Edit User Profile
app.post('/user', isLoggedIn, addUserDetails);
//Get User Profile
app.get('/user', isLoggedIn, getAuthenticatedUser);



exports.api = functions.region('europe-west1').https.onRequest(app);