const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/role');
const userController = require('../controllers/admin/userController');
const disciplineController = require('../controllers/admin/disciplineController');
const groupController = require('../controllers/admin/groupController');


router.get('/dashboard', authMiddleware, checkRole('admin'), (req, res) => {
  res.json({ 
    message: 'Админ панель',
    user: req.user
  });
});

router.post('/users', 
  authMiddleware, 
  checkRole('admin'), 
  adminController.createUser
);

// Users
router.post('/users', authMiddleware, checkRole('admin'), userController.createUser);
router.put('/users/:id', authMiddleware, checkRole('admin'), userController.updateUser);
router.delete('/users/:id', authMiddleware, checkRole('admin'), userController.deleteUser);

// Disciplines
router.post('/disciplines', authMiddleware, checkRole('admin'), disciplineController.createDiscipline);
router.put('/disciplines/:id', authMiddleware, checkRole('admin'), disciplineController.updateDiscipline);
router.delete('/disciplines/:id', authMiddleware, checkRole('admin'), disciplineController.deleteDiscipline);

// Groups
router.post('/groups', authMiddleware, checkRole('admin'), groupController.createGroup);
router.put('/groups/:id', authMiddleware, checkRole('admin'), groupController.updateGroup);
router.delete('/groups/:id', authMiddleware, checkRole('admin'), groupController.deleteGroup);

module.exports = router;