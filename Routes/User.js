const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');

router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/names', async (req, res) => {
    try {
        const userNames = await User.find().select('nom_complet');
        res.json(userNames);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/add', async (req, res) => {
    const user = new User({
        email: req.body.email,
        nom_complet: req.body.nom_complet,
        username: req.body.username,
        mdp: req.body.mdp
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/update/:name', async (req, res) => {
    try {
        const user = await User.findOne({ nom_complet: req.params.name });
        if (user) {
            user.email = req.body.email;
            user.nom_complet = req.body.nom_complet;
            user.username = req.body.username;
            user.mdp = req.body.mdp;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/delete/:name', async (req, res) => {
    try {
        const deletedUser = await User.deleteOne({ nom_complet: req.params.name });
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;