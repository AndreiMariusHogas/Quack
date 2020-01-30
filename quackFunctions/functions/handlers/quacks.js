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