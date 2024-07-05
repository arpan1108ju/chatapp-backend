const express = require('express')
const authenticateUser = require('../middlewares/authMiddleware')
const {saveMessage } = require('../controllers/messageController')
const router = express.Router()


router.post('/savemessage',authenticateUser,saveMessage);

module.exports = router;