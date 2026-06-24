const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/adminUserController');
const { verifyToken, isAdmin } = require('../../middleware/auth');

router.use(verifyToken, isAdmin);

router.route('/')
  .get(adminUserController.getUsers);

router.route('/:id')
  .put(adminUserController.updateUser)
  .delete(adminUserController.deleteUser);


router.route('/:id/role')
  .put(adminUserController.updateUserRole);

router.route('/:id/status')
  .put(adminUserController.updateUserStatus);

module.exports = router;
