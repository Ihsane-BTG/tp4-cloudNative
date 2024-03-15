const express = require('express');
const router = express.Router();
const Auteur = require('../Models/auteursModel');
const Livre = require('../Models/livresModel');

router.get('/all', async (req, res) => {
    try {
        const auteurs = await Auteur.find();
        res.json(auteurs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/names', async (req, res) => {
    try {
        const auteurNames = await Auteur.find().select('nom');
        res.json(auteurNames);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/editeurs', async (req, res) => {
    try {
        const editeursByAuteur = await Auteur.aggregate([
            {
                $lookup: {
                    from: "editeurs",
                    localField: "_id",
                    foreignField: "auteur",
                    as: "editeurs"
                }
            },
            {
                $project: {
                    nom: 1,
                    nombre_editeurs: { $size: "$editeurs" }
                }
            }
        ]);
        res.json(editeursByAuteur);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/add', async (req, res) => {
    const auteur = new Auteur({
        nom: req.body.nom,
        pays: req.body.pays
    });

    try {
        const newAuteur = await auteur.save();
        res.status(201).json(newAuteur);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/update/:name', async (req, res) => {
    try {
        const auteur = await Auteur.findOne({ nom: req.params.name });
        if (auteur) {
            auteur.nom = req.body.nom;
            auteur.pays = req.body.pays;
            const updatedAuteur = await auteur.save();
            res.json(updatedAuteur);
        } else {
            res.status(404).json({ message: "Auteur non trouvé" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/delete/:name', async (req, res) => {
    try {
        const deletedAuteur = await Auteur.deleteOne({ nom: req.params.name });
        res.json(deletedAuteur);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;