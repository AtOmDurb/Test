const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.get('/dashboard', authMiddleware, checkRole('student'), (req, res) => {
  res.json({ 
    message: 'Панель студента',
    user: req.user
  });
});

module.exports = router;