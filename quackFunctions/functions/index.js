const functions = require("firebase-functions");
//Express init
const express = require("express");
const app = express();
//Database
const { db } = require("./utility/admin");
//Import Handlers
//Quacks
const { getAllQuacks } = require("./handlers/quacks");
const { postOneQuack } = require("./handlers/quacks");
const { getQuack } = require("./handlers/quacks");
const { commentOnQuack } = require("./handlers/quacks");
const { likeQuack } = require("./handlers/quacks");
const { unlikeQuack } = require("./handlers/quacks");
const { deleteQuack } = require("./handlers/quacks");
//Users
const { signup } = require("./handlers/users");
const { login } = require("./handlers/users");
const { uploadImage } = require("./handlers/users");
const { addUserDetails } = require("./handlers/users");
const { getAuthenticatedUser } = require("./handlers/users");
const { getUserDetails } = require("./handlers/users");
const { checkNotificationsRead } = require("./handlers/users");
//Functions
const isLoggedIn = require("./utility/isLoggedIn");
//Routes
//Quacks
//Get all Quacks Route
app.get("/quacks", getAllQuacks);
//Create new quack route
app.post("/quack", isLoggedIn, postOneQuack);
//Get One Quack
app.get("/quack/:quackId", getQuack);
//Comment on Quack
app.post("/quack/:quackId/comment", isLoggedIn, commentOnQuack);
//Like Quack
app.get("/quack/:quackId/like", isLoggedIn, likeQuack);
//Unlike Quack
app.post("/quack/:quackId/unlike", isLoggedIn, unlikeQuack);
//Delete Quack
app.delete("/quack/:quackId", isLoggedIn, deleteQuack);

//Users
//Signup Route
app.post("/signup", signup);
//Login Route
app.post("/login", login);
//Image Upload
app.post("/user/image", isLoggedIn, uploadImage);
//Edit User Profile
app.post("/user", isLoggedIn, addUserDetails);
//Get User Profile
app.get("/user", isLoggedIn, getAuthenticatedUser);
//Unauthenticated User Profile Route
app.get("/user/:nickname", getUserDetails);
//User Notifications Route
app.post("/notifications", isLoggedIn, checkNotificationsRead);

exports.api = functions.region("europe-west1").https.onRequest(app);

//Firebase Triggers
//On Create Like
exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate(like => {
    db.doc(`/quacks/${like.data().quackId}`)
      .get()
      .then(doc => {
        if (doc.exists && doc.data().userNN !== like.data().userNN) {
          return db
            .doc(`/notifications/${like.id}`)
            .set({
              created: new Date().toISOString(),
              recipient: doc.data().userNN,
              sender: like.data().userNN,
              type: "like",
              read: false,
              quackId: doc.id
            })
            .catch(err => {
              console.error(err);
            });
        }
      });
  });
//On Delete Like
exports.deleteNotificationOnUnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete(like => {
    return db
      .doc(`/notifications/${like.id}`)
      .delete()
      .catch(err => {
        console.error(err);
        return;
      });
  });

//On Create Comment
exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(comment => {
    db.doc(`/quacks/${comment.data().quackId}`)
      .get()
      .then(doc => {
        if (doc.exists && doc.data().userNN !== comment.data().userNN) {
          return db
            .doc(`/notifications/${comment.id}`)
            .set({
              created: new Date().toISOString(),
              recipient: doc.data().userNN,
              sender: comment.data().userNN,
              type: "comment",
              read: false,
              quackId: doc.id
            })
            .catch(err => {
              console.error(err);
              return;
            });
        }
      });
  });

//On User Image Change
exports.onUserImageChange = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate(change => {
    if (change.before.data() !== change.after.data()) {
      const batch = db.batch();
      return db
        .collection("quacks")
        .where("userNN", "==", change.before.data().nickname)
        .get()
        .then(data => {
          data.forEach(doc => {
            const quack = db.doc(`/quacks/${doc.id}`);
            batch.update(quack, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

//On Quack Delete
exports.onQuackDelete = functions
  .region("europe-west1")
  .firestore.document("/quacks/{quackId}")
  .onDelete((snapshot, context) => {
    const quackId = context.params.quackId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("quackId", "==", quackId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/$doc.id`));
        });
        return db
          .collection("likes")
          .where("quackId", "==", quackId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("quackId", "==", quackId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => {
        console.error(err);
      });
  });
