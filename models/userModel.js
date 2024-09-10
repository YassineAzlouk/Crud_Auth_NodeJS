const db = require('../config/dbconfig');

const User = {
  findByLogin: (login, callback) => {
    const query = 'SELECT * FROM users WHERE login = ?';
    db.query(query, [login], callback);
  },
  updatePassword: (login, hashedPassword, callback) => {
    const query = 'UPDATE users SET password = ? WHERE login = ?';
    db.query(query, [hashedPassword, login], callback);
  }
};

module.exports = User;
