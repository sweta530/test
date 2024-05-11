const mongoose = require('mongoose')
require('./connection')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    user_name: String,
    contact_info: String,
    profile_picture: String,
    user_role: {
        type: String,
        default: 'user'
    }
})

const Users = mongoose.model('users', userSchema)

module.exports = Users
