const prisma = require('../config/prisma');

// Crear un nuevo cliente
exports.createClient = async (req, res) => {
  const { nombre, correo, telefono } = req.body;
  const userId = req.userId;

  try {
    const client = await prisma.client.create({
      data: {
        nombre,
        correo,
        telefono,
        userId,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente' });
  }
};


exports.getClients = async (req, res) => {
  const userId = req.userId;

  try {
    const clients = await prisma.client.findMany({
      where: { userId },
      include: {
        projects: true, 
      },
    });

    res.json(clients);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error al obtener los clientes' });
  }
};



// Obtener un cliente por ID
exports.getClientById = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const client = await prisma.client.findFirst({
      where: { id: Number(id), userId }
    });

    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente' });
  }
};

// Actualizar un cliente
exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono } = req.body;
  const userId = req.userId;

  try {
    const client = await prisma.client.findFirst({ where: { id: Number(id), userId } });

    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });

    const updated = await prisma.client.update({
      where: { id: Number(id) },
      data: { nombre, correo, telefono }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cliente' });
  }
};


// Eliminar un cliente
exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const client = await prisma.client.findFirst({ where: { id: Number(id), userId } });

    if (!client) return res.status(404).json({ message: 'Cliente no encontrado' });

    await prisma.client.delete({ where: { id: Number(id) } });

    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente' });
  }
};
