const pool = require('../../config/db');
const bcrypt = require('bcryptjs');
const { userSchema } = require('../validators/userSchema');

module.exports = {
  // Создание пользователя
  createUser: async (req, res) => {
    try {
      const { error } = userSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const { username, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.execute(
        `INSERT INTO users (username, email, password, role) 
        VALUES (?, ?, ?, ?)`,
        [username, email, hashedPassword, role]
      );

      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка создания пользователя' });
    }
  },

  // Редактирование пользователя
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, role } = req.body;

      const { error } = userSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      await pool.execute(
        `UPDATE users 
        SET username = ?, email = ?, role = ? 
        WHERE id = ?`,
        [username, email, role, id]
      );

      res.json({ message: 'Пользователь обновлен' });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка обновления' });
    }
  },

  // Удаление пользователя
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      res.json({ message: 'Пользователь удален' });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка удаления' });
    }
  }
};