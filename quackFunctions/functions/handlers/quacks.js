const { db } = require("../utility/admin");

exports.getAllQuacks = (req, res) => {
  db.collection("quacks")
    .orderBy("created", "desc")
    .get()
    .then(data => {
      let quacks = [];
      data.forEach(doc => {
        quacks.push({
          quackId: doc.id,
          body: doc.data().body,
          userNN: doc.data().userNN,
          created: doc.data().created,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage
        });
      });
      return res.json(quacks);
    })
    .catch(err => console.error(err));
};

exports.postOneQuack = (req, res) => {
  const newQuack = {
    body: req.body.body,
    userNN: req.user.nickname,
    userImage: req.user.imageUrl,
    created: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };
  db.collection("quacks")
    .add(newQuack)
    .then(doc => {
      const resQuack = newQuack;
      newQuack.quackId = doc.id;
      res.json(newQuack);
    })
    .catch(err => {
      res.status(500).json({ error: "Something went wrong!" });
      console.error(err);
    });
};

exports.getQuack = (req, res) => {
  let quackData = {};
  db.doc(`/quacks/${req.params.quackId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Quack not found" });
      }
      quackData = doc.data();
      quackData.quackId = doc.id;
      return db
        .collection("comments")
        .orderBy("created", "desc")
        .where("quackId", "==", req.params.quackId)
        .get();
    })
    .then(data => {
      quackData.comments = [];
      data.forEach(doc => {
        quackData.comments.push(doc.data());
      });
      return res.json(quackData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.commentOnQuack = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });
  const newComment = {
    body: req.body.body,
    created: new Date().toISOString(),
    quackId: req.params.quackId,
    userNN: req.user.nickname,
    userImage: req.user.imageUrl
  };
  db.doc(`/quacks/${req.params.quackId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json({ error: "Quack not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong" ' });
    });
};

exports.likeQuack = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userNN", "==", req.user.nickname)
    .where("quackId", "==", req.params.quackId)
    .limit(1);

  const quackDocument = db.doc(`/quacks/${req.params.quackId}`);

  let quackData;

  quackDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        quackData = doc.data();
        quackData.quackId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Quack not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            quackId: req.params.quackId,
            userNN: req.user.nickname
          })
          .then(() => {
            quackData.likeCount++;
            return quackDocument.update({ likeCount: quackData.likeCount });
          })
          .then(() => {
            return res.json(quackData);
          });
      } else {
        return res.status(400).json({ error: "Quack already liked" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeQuack = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userNN", "==", req.user.nickname)
    .where("quackId", "==", req.params.quackId)
    .limit(1);

  const quackDocument = db.doc(`/quacks/${req.params.quackId}`);

  let quackData;

  quackDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        quackData = doc.data();
        quackData.quackId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Quack not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: "Quack not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            quackData.likeCount--;
            return quackDocument.update({ likeCount: quackData.likeCount });
          })
          .then(() => {
            res.json(quackData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.deleteQuack = (req, res) => {
  //Post to delete
  const document = db.doc(`/quacks/${req.params.quackId}`);
  //Associated likes
  const likeDocument = db
    .collection("likes")
    .where("quackId", "==", req.params.quackId);
  //Associated comments
  const commentDocument = db
    .collection("comments")
    .where("quackId", "==", req.params.quackId);

  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Quack not found" });
      }
      if (doc.data().userNN !== req.user.nickname) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Quack deleted succesfully" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
