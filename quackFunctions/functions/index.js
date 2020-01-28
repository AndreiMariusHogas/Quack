const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

//Express init
const express = require('express');
const app = express();


app.get('/quacks',(req, res) =>{
    admin
    .firestore()
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

app.post('/quacks/create',(req,res) => {
    const newQuack = {
        body: req.body.body,
        userNN: req.body.userNN,
        created: new Date().toISOString()
    };
    admin.firestore()
    .collection('quacks')
    .add(newQuack)
    .then(doc => {
        res.json({message: `document ${doc.id} created succesfully`})
    })
    .catch(err => {
        res.status(500).json({error: 'Something went wrong!'});
        console.error(err);
    });
})



exports.api = functions.https.onRequest(app);