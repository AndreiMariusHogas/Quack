const { db } = require('../utility/admin');
const { admin } = require('../utility/admin');
const firebaseConfig = require('../utility/config');
const firebase  = require('firebase');

firebase.initializeApp(firebaseConfig);

const { validateSignupData } = require('../utility/validators');
const { validateLoginData } = require('../utility/validators');
const { reduceUserDetails } = require('../utility/validators');
//Sign Up
exports.signup = (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        nickname: req.body.nickname
    }
    //Validate

    const {valid, errors } = validateSignupData(newUser);
    if(!valid) return res.status(400).json(errors);
    
    const defImg = 'default-img.png'

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
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${defImg}?alt=media`,
            userId
        };
        return db.doc(`/users/${newUser.nickname}`).set(userCredentials);
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
}
//Login
exports.login = (req,res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    //Validation
    const {valid, errors } = validateLoginData(user);
    if(!valid) return res.status(400).json(errors);

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
}
//Add Avatar
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
  
    const busboy = new BusBoy({ headers: req.headers });
  
    let imageToBeUploaded = {};
    let imageFileName;
  
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
        return res.status(400).json({ error: 'Wrong file type submitted' });
      }
      
      const imageExtension = filename.split('.')[filename.split('.').length - 1];
      
      imageFileName = `${Math.round(
        Math.random() * 1000000000000
      ).toString()}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
      admin
        .storage()
        .bucket()
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimetype
            }
          }
        })
        .then(() => {
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
            firebaseConfig.storageBucket
          }/o/${imageFileName}?alt=media`;
          return db.doc(`/users/${req.user.nickname}`).update({ imageUrl });
        })
        .then(() => {
          return res.json({ message: 'image uploaded successfully' });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({ error: 'something went wrong' });
        });
    });
    busboy.end(req.rawBody);
  };
//Add profile details
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);
  
    db.doc(`/users/${req.user.nickname}`)
      .update(userDetails)
      .then(() => {
        return res.json({ message: 'Details added successfully' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
};

//Get Signed In User Details
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.nickname}`)
    .get()
    .then((doc) => {
        if (doc.exists) {
            userData.credentials = doc.data();
            return db.collection('likes').where('userNN', '==', req.user.nickname).get();
        }
    })
    .then(data => {
        userData.likes = [];
        data.forEach(doc => {
            userData.likes.push(doc.data());
        })
        return res.json(userData);
    })
    .catch((err)=>{
        console.error(err);
        return res.status(500).json({error:err.code});
    })
}