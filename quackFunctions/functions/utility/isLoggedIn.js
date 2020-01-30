const { admin } = require('./admin');
const { db } = require('./admin');

module.exports = (req, res, next) => {
    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
      console.error('No token found');
      return res.status(403).json({ error: 'Unauthorized' });
    }
    //Validate Token
    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        req.user = decodedToken;
        return db
          .collection('users')
          .where('userId', '==', req.user.uid)
          .limit(1)
          .get();
      })
      //Add usernickname to request
      .then((data) => {
        req.user.nickname = data.docs[0].data().nickname;
        return next();
      })
      .catch((err) => {
        console.error('Error while verifying token ', err);
        return res.status(403).json(err);
      });
  };