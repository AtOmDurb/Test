const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/role');

router.get('/dashboard', authMiddleware, checkRole('admin'), (req, res) => {
  res.json({ 
    message: 'Админ панель',
    user: req.user
  });
});

module.exports = router;