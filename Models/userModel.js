const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    nom_complet: {
        type: String,
        minlength: 5
    },
    username: {
        type: String,
        minlength: 5
    },
    mdp: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);