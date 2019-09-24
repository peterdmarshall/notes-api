const userModel = require('./models/users');
const uuid = require('uuid/v1');

function generateUID() {
    // Generate a unique user ID for the new user
    return uuid();
}

function usernameIsUnique(username) {
    // Determine if username is already in use
    var isUnique = false;
    userModel.findOne({username: username}, function (err, user) {
        if(!err && user) {
            isUnique = true;
        } else {
            isUnique = false;
        }
    });
}

function checkPassword(password) {
    // Determine if the password meets requirements
    // Require password to contain at least one uppercase letter,
    // lowercase letter, and at least on number
    var passwordRegex = new RegExp("^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))");
    if(passwordRegex.test(password)) {
        return true;
    } else {
        return false
    }
}

module.exports = {generateUID, usernameIsUnique, checkPassword};