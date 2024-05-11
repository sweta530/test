const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/users_database', {})
    .then(() => {
        console.log('Database Connected')
    }).catch((err) => {
        console.log('Error in database connection : ', err)
    })