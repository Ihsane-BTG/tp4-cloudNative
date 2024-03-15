const express = require('express');
const router = express.Router();
const Livre = require('../Models/livresModel');
const Auteur = require('../Models/auteursModel');
const Editeur = require('../Models/editeursModel');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token non fourni' });

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Échec de l\'authentification du token' });
        req.user = user;
        next();
    });
}

router.use(verifyToken); 

router.get('/all', async (req, res) => {
    try {
        const livres = await Livre.find();
        res.json(livres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/auteurs/:livrename', async (req, res) => {
    try {
        const livre = await Livre.findOne({ titre: req.params.livrename });
        if (livre) {
            const auteurs = await Auteur.find({ _id: { $in: livre.auteurs } });
            res.json(auteurs);
        } else {
            res.status(404).json({ message: "Livre non trouvé" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/editeurs/:livrename', async (req, res) => {
    try {
        const livre = await Livre.findOne({ titre: req.params.livrename });
        if (livre) {
            const editeurs = await Editeur.find({ _id: { $in: livre.editeurs } });
            res.json(editeurs);
        } else {
            res.status(404).json({ message: "Livre non trouvé" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/listCategorie/:category', async (req, res) => {
    try {
        const livres = await Livre.find({ categorie: req.params.category });
        res.json(livres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:annee1/:annee2', async (req, res) => {
    try {
        const livres = await Livre.find({
            date_publication: { $gte: req.params.annee1, $lte: req.params.annee2 }
        });
        res.json(livres);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/add', async (req, res) => {
    const livre = new Livre({
        titre: req.body.titre,
        auteurs: req.body.auteurs,
        editeurs: req.body.editeurs,
        date_publication: req.body.date_publication,
        categorie: req.body.categorie
    });

    try {
        const newLivre = await livre.save();
        res.status(201).json(newLivre);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/update/:name', async (req, res) => {
    try {
        const livre = await Livre.findOne({ titre: req.params.name });
        if (livre) {
            livre.titre = req.body.titre;
            livre.auteurs = req.body.auteurs;
            livre.editeurs = req.body.editeurs;
            livre.date_publication = req.body.date_publication;
            livre.categorie = req.body.categorie;
            const updatedLivre = await livre.save();
            res.json(updatedLivre);
        } else {
            res.status(404).json({ message: "Livre non trouvé" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/delete/:name', async (req, res) => {
    try {
        const deletedLivre = await Livre.deleteOne({ titre: req.params.name });
        res.json(deletedLivre);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;