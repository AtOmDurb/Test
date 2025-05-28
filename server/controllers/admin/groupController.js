const pool = require('../../config/db');
const { groupSchema } = require('../validators/groupSchema');

module.exports = {

getAllGroups: async (req, res) => {
    try {
      const [groups] = await pool.query(`
        SELECT g.*, d.title as discipline_name 
        FROM groups g
        JOIN disciplines d ON g.discipline_id = d.id
      `);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },





  // Создание группы
  createGroup: async (req, res) => {
    try {
      const { error } = groupSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      const [result] = await pool.execute(
        `INSERT INTO groups (name, discipline_id) 
        VALUES (?, ?)`,
        [req.body.name, req.body.discipline_id]
      );
      
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка создания группы' });
    }
  },

  // Редактирование группы
  updateGroup: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, discipline_id } = req.body;

      const { error } = groupSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });

      await pool.execute(
        `UPDATE groups 
        SET name = ?, discipline_id = ? 
        WHERE id = ?`,
        [name, discipline_id, id]
      );

      res.json({ message: 'Группа обновлена' });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка обновления' });
    }
  },

  // Удаление группы
  deleteGroup: async (req, res) => {
    try {
      const { id } = req.params;
      await pool.execute('DELETE FROM groups WHERE id = ?', [id]);
      res.json({ message: 'Группа удалена' });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка удаления' });
    }
  }
};