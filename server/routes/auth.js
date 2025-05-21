const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);

router.post("/debug-bcrypt", async (req, res) => {
  const bcrypt = require("bcryptjs");
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);
  const isMatch = await bcrypt.compare(password, hash);
  res.json({ hash, isMatch });
});

module.exports = router;