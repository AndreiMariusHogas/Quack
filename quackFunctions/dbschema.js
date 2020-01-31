let db = {
    users: [
        {
            userId: 'dh23sdadsadawewafasfhjsajda',
            email: 'user@email.com',
            created: '2020-01-28T17:40:25.407Z',
            imageUrl: 'image/dsadasda/dsadada',
            bio: 'Hello my name is user, nice to meet you',
            website: 'https://user.com',
            location: 'Shanghai, China'
        }
    ],
    quacks: [
        {
            userNN: 'user',
            body: 'this is the quack body',
            userImage: 'image/dsadasda/dsadada',
            created: '2020-01-28T17:40:25.407Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userNN: 'user',
            quackId: 'ksdaskdaskdaksdka',
            body: 'First try is the lucky one',
            created: '2020-01-28T17:40:25.407Z'
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'john doe',
            read: 'true | false',
            screamId: 'sdasadasdasfgjsa',
            type: 'like | comment',
            created: '2020-01-28T17:40:25.407Z'
        }
    ]
}

const userDetails = {
    credentials: {
            userId: 'dh23sdadsadawewafasfhjsajda',
            email: 'user@email.com',
            created: '2020-01-28T17:40:25.407Z',
            imageUrl: 'image/dsadasda/dsadada',
            bio: 'Hello my name is user, nice to meet you',
            website: 'https://user.com',
            location: 'Shanghai, China'
    }, 
    likes: [ 
        {
            userNN : 'user',
            quackId: 'tsatrasdwadwawa'
        },
        {
            userNN: 'user',
            quackId: 'dsdadaspoieuopadksalk'
        }
    ]
}