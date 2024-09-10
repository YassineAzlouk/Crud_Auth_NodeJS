const express = require('express');
const userController = require('./controllers/userController');

const app = express();
app.use(express.json()); // Pour parser les requêtes JSON

// Route pour changer le mot de passe
app.put('/changePassword', userController.changePassword);

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
