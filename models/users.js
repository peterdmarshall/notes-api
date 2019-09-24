const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    }
});

const User = mongoose.model("User", noteSchema);
module.exports = User;