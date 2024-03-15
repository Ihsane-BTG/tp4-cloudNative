const mongoose = require('mongoose');

const auteurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    pays: {
        type: String
    },
    livres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livre'
    }]
});

module.exports = mongoose.model('Auteur', auteurSchema);
