const User = require('../models/user');
const pool = require('../config/db'); // Добавлен импорт pool
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Проверка наличия email и пароля
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    // 2. Поиск пользователя в базе
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const user = users[0];

    // 3. Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // 4. Генерация токена
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5. Отправка успешного ответа (только один раз!)
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.register = async (req, res) => {
  try {
    // Проверка наличия обязательных полей
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const {username, email, password, role } = req.body;

    // Проверка существования пользователя
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь уже существует' });
    }

    const hashedPassword = await User.hashPassword(password);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    res.status(201).json({ 
      message: 'Пользователь создан',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Ошибка в методе register:', error.stack);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};