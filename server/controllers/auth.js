const User = require('../models/user');
const pool = require('../config/db'); // Добавлен импорт pool

exports.login = async (req, res) => {
  try {
    // Проверка наличия обязательных полей
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const { email, password } = req.body;
    console.log('Получен запрос на вход:', email);

    const user = await User.findByEmail(email);
    console.log('Найден пользователь:', user);

    if (!user) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const isMatch = await User.comparePasswords(password, user.password);
    console.log('Сравнение паролей:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const token = User.generateToken(user);
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
    console.error('Ошибка в методе login:', error.stack); // Детальное логирование
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

exports.register = async (req, res) => {
  try {
    // Проверка наличия обязательных полей
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const { email, password, role } = req.body;

    // Проверка существования пользователя
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь уже существует' });
    }

    const hashedPassword = await User.hashPassword(password);
    
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
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