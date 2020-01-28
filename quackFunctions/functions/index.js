const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.getAllQuacks = functions.https.onRequest((req, res) =>{
    admin.firestore().collection('quacks').get()
    .then(data => {
        let quacks = [];
        data.forEach(doc => {
            quacks.push(doc.data());
        });
        return res.json(quacks);
    })
    .catch(err => console.error(err)); 
})