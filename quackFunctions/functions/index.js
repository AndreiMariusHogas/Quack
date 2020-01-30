const functions = require('firebase-functions');
const admin = require('firebase-admin');


admin.initializeApp();

//Express init
const express = require('express');
const app = express();

//Firebase init
const firebaseConfig = {
    apiKey: "AIzaSyDXCyhqlGAulAgvn3be1u-0paWK1SD3QHk",
    authDomain: "quack-1d8e3.firebaseapp.com",
    databaseURL: "https://quack-1d8e3.firebaseio.com",
    projectId: "quack-1d8e3",
    storageBucket: "quack-1d8e3.appspot.com",
    messagingSenderId: "172044958007",
    appId: "1:172044958007:web:eab3ad688b212e990cc2b2",
    measurementId: "G-B3H9FLCL9Z"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);
const db = admin.firestore();


//Get all Quacks Route
app.get('/quacks',(req, res) =>{
    db
    .collection('quacks')
    .orderBy('created','desc')
    .get()
    .then(data => {
        let quacks = [];
        data.forEach(doc => {
            quacks.push({
                quackId: doc.id,
                body: doc.body,
                userNN: doc.data().userNN,
                created: doc.data().created
            });
        });
        return res.json(quacks);
    })
    .catch(err => console.error(err)); 
})

//Create new quack route
app.post('/quack/new',(req,res) => {
    const newQuack = {
        body: req.body.body,
        userNN: req.body.userNN,
        created: new Date().toISOString()
    };
    db
    .collection('quacks')
    .add(newQuack)
    .then(doc => {
        res.json({message: `document ${doc.id} created succesfully`})
    })
    .catch(err => {
        res.status(500).json({error: 'Something went wrong!'});
        console.error(err);
    });
});

//Validation Helper Functions
const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

//Signup Route
app.post('/signup', (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        nickname: req.body.nickname
    }
    let errors = {};

    //Validation
    if(isEmpty(newUser.email)){
        errors.email = 'Email must not be emtpy';
    } else if (!isEmail(newUser.email)) {
        errors.email = 'You must fill in a valid email address';
    }
    if(isEmpty(newUser.password)){
        errors.password = "You must fill in your password";
    }
    if(newUser.password !== newUser.confirmPassword){
        errors.confirmPassword = "Passwords did not match";
    }
    if(isEmpty(newUser.nickname)){
        errors.nickname = "You must choose a nickname";
    }
    if(Object.keys(errors).length > 0){
        return res.status(400).json({errors});
    }
    
    //Add to db and return access token
    let token,userId;
    db.doc(`/users/${newUser.nickname}`)
    .get()
    .then(doc => {
        if(doc.exists){
            return res.status(400).json({ nickname: 'this nickname is already taken'})
        } else {
            return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(userToken => {
        token = userToken;
        const userCredentials = {
            nickname: newUser.nickname,
            email: newUser.email,
            created: new Date().toISOString(),
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
        return res.status(201).json({ token });
    })
    .catch(err => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
            return res.status(400).json({email: "Email is already in use"});
        } else {
            return res.status(500).json({ error: err.code});
        }
    })
});

app.post('/login', (req,res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    //Validation
    let errors = {}
    if(isEmpty(user.email)) {
        errors.email = "Fill in your email";
    }
    if(isEmpty(user.password)) {
        errors.password = "Fill in your password";
    }
    if(Object.keys(errors).length > 0){
        return res.status(400).json({errors});
    }
    //Authentication
    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(data => {
        return data.user.getIdToken();
    })
    .then(token => {
        return res.json({token});
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/wrong-password'){
            return res.status(403).json({general: 'Login failed, wrong credentials. Please try again'});
        }
        return res.status(500).json({error: err.code});
    })
})



exports.api = functions.region('europe-west1').https.onRequest(app);