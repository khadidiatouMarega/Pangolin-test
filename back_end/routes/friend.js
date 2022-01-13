const express = require('express');
const friendCtrl = require('../controllers/friend-ctrl');
const router = express.Router();

router.post('/addFriend', friendCtrl.addFriend);
router.get('/friend/:id', friendCtrl.getFriend)
router.post('/deleteFriend', friendCtrl.deleteFriend)



module.exports = router; 