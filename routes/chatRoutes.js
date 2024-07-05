const express = require('express')
const authenticateUser = require('../middlewares/authMiddleware')
const {getChats, fetchChat,createGroupChat,fetchGroupChat,fetchGroupChatByName } = require('../controllers/chatControllers')
const router = express.Router()


router.post('/fetchchat',authenticateUser,fetchChat);
router.get('/getchats',authenticateUser,getChats);
router.post('/creategroup',authenticateUser,createGroupChat);
router.post('/fetchgroup',authenticateUser,fetchGroupChat);
router.get('/',authenticateUser,fetchGroupChatByName);

module.exports = router;