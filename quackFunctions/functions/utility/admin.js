
var admin = require("firebase-admin");

var serviceAccount = require("c:/Users/Keeper/Downloads/quack-1d8e3-firebase-adminsdk-ws3gr-b5168be689.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quack-1d8e3.firebaseio.com"
});

const db = admin.firestore();

module.exports = { admin, db};