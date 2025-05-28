const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const auth = require('../middleware/auth');
const userController = require('../controllers/admin/userController');
const disciplineController = require('../controllers/admin/disciplineController');
const groupController = require('../controllers/admin/groupController');
const checkRole = require('../middleware/role');

const adminMiddleware = [auth, checkRole('admin')];

router.get('/users', ...adminMiddleware, userController.getAllUsers);
router.post('/users', ...adminMiddleware, userController.createUser);
router.put('/users/:id', ...adminMiddleware, userController.updateUser);
router.delete('/users/:id', ...adminMiddleware, userController.deleteUser);

// Disciplines
router.get('/disciplines', ...adminMiddleware, disciplineController.getAllDisciplines);
router.post('/disciplines', ...adminMiddleware, disciplineController.createDiscipline);
router.put('/disciplines/:id', ...adminMiddleware, disciplineController.updateDiscipline);
router.delete('/disciplines/:id', ...adminMiddleware, disciplineController.deleteDiscipline);

// Groups
router.get('/groups', ...adminMiddleware, groupController.getAllGroups);
router.post('/groups', ...adminMiddleware, groupController.createGroup);
router.put('/groups/:id', ...adminMiddleware, groupController.updateGroup);
router.delete('/groups/:id', ...adminMiddleware, groupController.deleteGroup);

module.exports = router;