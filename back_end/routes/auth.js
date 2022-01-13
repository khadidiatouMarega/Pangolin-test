const express = require('express');
const userCtrl = require('../controllers/user-ctrl');
const router = express.Router();

const UserCtrl = require('../controllers/user-ctrl')

//route API
router.post('/register', UserCtrl.postRegister);
router.post('/login', UserCtrl.postLogin)
router.get('/users', UserCtrl.getUser)
router.get('/user/:id', userCtrl.getUserByName)
router.put('/user/:id', userCtrl.updateUser)

module.exports = router;