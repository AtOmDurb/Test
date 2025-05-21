const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


class User {
  
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw new Error(`Ошибка при поиске пользователя: ${error.message}`);
    }
  }

  
  static async comparePasswords(password, hashedPassword) {
    if (!password || !hashedPassword) {
      throw new Error('Пароль или хэш отсутствуют');
    }
    return bcrypt.compare(password, hashedPassword);
  }

  
  static async hashPassword(password) {
    if (password.length < 8) {
      throw new Error('Пароль должен содержать минимум 8 символов');
    }
    return bcrypt.hash(password, 10);
  }

  
  static generateToken(user) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET не определен в .env');
    }
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
  }
}

module.exports = User;