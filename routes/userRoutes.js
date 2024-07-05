const express = require('express')
const {registerUser,loginUser,fetchUserByName} = require('../controllers/userControllers')
const authenticateUser = require('../middlewares/authMiddleware')

const router = express.Router()


router.post('/signup',registerUser);
router.post('/login',loginUser);
router.get('/',authenticateUser,fetchUserByName);

module.exports = router;