const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const auth = require('../middleware/auth.js');
const userController = require('../controllers/admin/userController');
const disciplineController = require('../controllers/admin/disciplineController');
const groupController = require('../controllers/admin/groupController');
const checkRole = require('../middleware/role.js');

const adminMiddleware = [auth, checkRole('admin')];

// Users
router.get('/users', ...adminMiddleware, userController.getAllUsers);
router.get('/users/:id', ...adminMiddleware, userController.getUserById);
router.post('/users', ...adminMiddleware, userController.createUser);
router.put('/users/:id', ...adminMiddleware, userController.updateUser);
router.delete('/users/:id', ...adminMiddleware, userController.deleteUser);

// Disciplines
router.get('/disciplines', ...adminMiddleware, disciplineController.getAllDisciplines);
router.get('/disciplines/:id', ...adminMiddleware, disciplineController.getDisciplineById);
router.post('/disciplines', ...adminMiddleware, disciplineController.createDiscipline);
router.put('/disciplines/:id', ...adminMiddleware, disciplineController.updateDiscipline);
router.delete('/disciplines/:id', ...adminMiddleware, disciplineController.deleteDiscipline);

// Groups
router.get('/groups', ...adminMiddleware, groupController.getAllGroups);
router.get('/groups/:id', ...adminMiddleware, groupController.getGroupById);
router.post('/groups', ...adminMiddleware, groupController.createGroup);
router.put('/groups/:id', ...adminMiddleware, groupController.updateGroup);
router.delete('/groups/:id', ...adminMiddleware, groupController.deleteGroup);



module.exports = router;