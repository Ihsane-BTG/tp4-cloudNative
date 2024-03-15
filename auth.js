const jwt = require('jwt');

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "Le token est obligatoire pour l'authentification" });
    }

    jwt.verify(token, process.env.TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token invalide" });
        }
        next();
    });
}

module.exports = verifyToken;
