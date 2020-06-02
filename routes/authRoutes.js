const express = require('express');
const router = express.Router();
const db = require('mysql');
const AuthController = require('../controllers/auth');

router.post('', AuthController.createUser);

router.post('/login', AuthController.loginUser);

module.exports = router;