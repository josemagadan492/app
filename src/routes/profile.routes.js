const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Ruta protegida
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true },
    });
    res.json({ message: 'Perfil obtenido correctamente', user });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil', details: err.message });
  }
});

module.exports = router;
