const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

// Initialiser Express
const app = express();
app.use(express.json()); // Pour parser les requêtes JSON

// Configurer la connexion MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Utilisateur MySQL
  password: 'votre_mot_de_passe', // Mot de passe MySQL
  database: 'nom_de_votre_base_de_donnees' // Nom de la base de données
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

// Endpoint pour changer le mot de passe
app.put('/changePassword', async (req, res) => {
  const { login, oldPassword, newPassword } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const queryUser = 'SELECT * FROM users WHERE login = ?';
    db.query(queryUser, [login], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const user = results[0];

      // Vérifier si l'ancien mot de passe correspond
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
      }

      // Hasher le nouveau mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Mettre à jour le mot de passe dans la base de données
      const updateQuery = 'UPDATE users SET password = ? WHERE login = ?';
      db.query(updateQuery, [hashedPassword, login], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe' });
        }

        res.json({ message: 'Mot de passe mis à jour avec succès' });
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
