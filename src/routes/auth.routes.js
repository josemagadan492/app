const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// Ruta para registrar usuario
router.post('/register', register);

// Ruta para login
router.post('/login', login);

module.exports = router;
