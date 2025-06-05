
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);
router.post('/registro', registrar);

module.exports = router;
