const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const UserService = {
    changePassword: async (login, oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      User.findByLogin(login, async (err, results) => {
        if (err) {
          return reject('Erreur lors de la récupération de l\'utilisateur');
        }

        if (results.length === 0) {
          return reject('Utilisateur non trouvé');
        }

        const user = results[0];

        // Vérifier si l'ancien mot de passe correspond
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return reject('Ancien mot de passe incorrect');
        }

        // Hasher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Mettre à jour le mot de passe
        User.updatePassword(login, hashedPassword, (err, result) => {
          if (err) {
            return reject('Erreur lors de la mise à jour du mot de passe');
          }

          resolve('Mot de passe mis à jour avec succès');
        });
      });
    });
  }
};

module.exports = UserService;
