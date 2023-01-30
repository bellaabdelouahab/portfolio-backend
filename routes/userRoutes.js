const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');


router.post('/login', authController.login);
router.post('/signup', authController.signup);
router
    .route('/')
    .get(userController.getAllUsers);

router.use(authController.protect);

router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));



router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
