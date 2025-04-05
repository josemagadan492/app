const prisma = require('../config/prisma');

exports.createProject = async (req, res) => {
  const { nombre, descripcion, estado, fecha_inicio, fecha_entrega, clientId } = req.body;
  const userId = req.userId;

  try {
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId
      }
    });

    if (!client) return res.status(404).json({ message: 'Cliente no encontrado o no pertenece al usuario' });

    const newProject = await prisma.project.create({
      data: {
        nombre,
        descripcion,
        estado,
        fecha_inicio: new Date(fecha_inicio),
        fecha_entrega: new Date(fecha_entrega),
        cliente: {
          connect: { id: clientId }
        }
      }
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el proyecto', error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  const userId = req.userId;

  try {
    const projects = await prisma.project.findMany({
      where: {
        cliente: {
          userId: userId
        }
      },
      include: { cliente: true }
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los proyectos' });
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: Number(id),
        cliente: {
          userId: userId
        }
      },
      include: { cliente: true }
    });

    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el proyecto' });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, estado, fecha_inicio, fecha_entrega } = req.body;
  const userId = req.userId;

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: Number(id),
        cliente: {
          userId: userId
        }
      }
    });

    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    const updated = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        nombre,
        descripcion,
        estado,
        fecha_inicio: new Date(fecha_inicio),
        fecha_entrega: new Date(fecha_entrega)
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el proyecto', error: error.message });
  }
};


exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: Number(id),
        cliente: {
          userId: userId
        }
      }
    });

    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    await prisma.project.delete({ where: { id: Number(id) } });

    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    console.error("❌ Error al eliminar proyecto:", error); 
    res.status(500).json({ message: 'Error al eliminar el proyecto' });
  }
};

