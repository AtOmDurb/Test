const pool = require('../../config/db');
const { disciplineSchema } = require('../validators/disciplineSchema');

module.exports = {
  // Создание дисциплины
  createDiscipline: async (req, res) => {
    try {
      const { error } = disciplineSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const [result] = await pool.execute(
        `INSERT INTO disciplines (title, description, created_by) 
        VALUES (?, ?, ?)`,
        [req.body.title, req.body.description, req.user.id]
      );
      
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка создания дисциплины' });
    }
  },

  // Редактирование дисциплины
  updateDiscipline: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const { error } = disciplineSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      await pool.execute(
        `UPDATE disciplines 
        SET title = ?, description = ? 
        WHERE id = ?`,
        [title, description, id]
      );

      res.json({ message: 'Дисциплина обновлена' });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка обновления' });
    }
  },




  // Удаление дисциплины
  deleteDiscipline: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.execute('DELETE FROM disciplines WHERE id = ?', [id]);
      res.json({ message: 'Дисциплина удалена' });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка удаления' });
    }
  }
};