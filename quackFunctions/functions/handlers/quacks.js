const { db } = require('../utility/admin');

exports.getAllQuacks =  (req, res) =>{
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
}

exports.postOneQuack = (req,res) => {
    const newQuack = {
        body: req.body.body,
        userNN: req.user.nickname,
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
}

exports.getQuack = (req, res) => {
    let quackData = {};
    db.doc(`/quacks/${req.params.quackId}`)
    .get()
    .then((doc) => {
        if(!doc.exists){
            return res.status(404).json({ error: 'Quack not found'});
        }
        quackData = doc.data();
        quackData.quackId = doc.id;
        return db.collection('comments')
        .orderBy('created','desc')
        .where('quackId','==',req.params.quackId)
        .get();
    })
    .then((data) => {
        quackData.comments = [];
        data.forEach(doc => {
            quackData.comments.push(doc.data());
        })
        return res.json(quackData);
    })
    .catch((err)=> {
        console.error(err);
        res.status(500).json({error: err.code});
    })
}

exports.commentOnQuack = (req,res) => {
    if(req.body.body.trim() === '') return res.status(400).json({error: 'Must not be empty'});
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
        if(!doc.exists){
            return res.status(400).json({error: 'Quack not found'});
        }
        return db.collection('comments').add(newComment);
    })
    .then(()=> {
        res.json(newComment);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: 'Something went wrong" '});
    })
}