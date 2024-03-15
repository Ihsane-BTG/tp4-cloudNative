const express = require('express');
const router = express.Router();
const Editeur = require('../Models/editeursModel');

router.get('/all', async (req, res) => {
    try {
        const editeurs = await Editeur.find();
        res.json(editeurs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/names', async (req, res) => {
    try {
        const editeurNames = await Editeur.find().select('nom');
        res.json(editeurNames);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/add', async (req, res) => {
    const editeur = new Editeur({
        nom: req.body.nom,
        pays: req.body.pays
    });

    try {
        const newEditeur = await editeur.save();
        res.status(201).json(newEditeur);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/update/:name', async (req, res) => {
    try {
        const editeur = await Editeur.findOne({ nom: req.params.name });
        if (editeur) {
            editeur.nom = req.body.nom;
            editeur.pays = req.body.pays;
            const updatedEditeur = await editeur.save();
            res.json(updatedEditeur);
        } else {
            res.status(404).json({ message: "Éditeur non trouvé" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/delete/:name', async (req, res) => {
    try {
        const deletedEditeur = await Editeur.deleteOne({ nom: req.params.name });
        res.json(deletedEditeur);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;