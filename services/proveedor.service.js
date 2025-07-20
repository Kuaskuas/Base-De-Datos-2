const Proveedor = require('../models/Proveedor');

class ProveedorService {
  // Función auxiliar: Obtener todos los proveedores
  async obtenerTodosLosProveedores() {
    try {
      const proveedores = await Proveedor.find({ activo: true })
        .sort({ nombre: 1 });

      return {
        success: true,
        message: `${proveedores.length} proveedores encontrados`,
        data: proveedores
      };
    } catch (error) {
      throw new Error(`Error al obtener proveedores: ${error.message}`);
    }
  }
  // Obtener todos los proveedores
  async obtenerTodosLosProveedores() {
    try {
      const proveedores = await Proveedor.find({ activo: true }).sort({ nombre: 1 });
      return { success: true, message: `${proveedores.length} proveedores encontrados`, data: proveedores };
    } catch (error) {
      throw new Error(`Error al obtener proveedores: ${error.message}`);
    }
  }

  // Obtener proveedor por ID
  async obtenerProveedorPorId(id) {
    try {
      const proveedor = await Proveedor.findById(id);
      if (!proveedor || !proveedor.activo) throw new Error('Proveedor no encontrado');
      return { success: true, data: proveedor };
    } catch (error) {
      throw new Error(`Error al obtener proveedor: ${error.message}`);
    }
  }

  // Crear proveedor
  async crearProveedor(datos) {
    try {
      const proveedor = new Proveedor(datos);
      await proveedor.save();
      return { success: true, message: 'Proveedor creado', data: proveedor };
    } catch (error) {
      throw new Error(`Error al crear proveedor: ${error.message}`);
    }
  }

  // Actualizar proveedor
  async actualizarProveedor(id, datos) {
    try {
      const proveedor = await Proveedor.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
      if (!proveedor) throw new Error('Proveedor no encontrado');
      return { success: true, message: 'Proveedor actualizado', data: proveedor };
    } catch (error) {
      throw new Error(`Error al actualizar proveedor: ${error.message}`);
    }
  }

  // Eliminar proveedor (borrado lógico)
  async eliminarProveedor(id) {
    try {
      const proveedor = await Proveedor.findByIdAndUpdate(id, { activo: false }, { new: true });
      if (!proveedor) throw new Error('Proveedor no encontrado');
      return { success: true, message: 'Proveedor eliminado', data: proveedor };
    } catch (error) {
      throw new Error(`Error al eliminar proveedor: ${error.message}`);
    }
  }
}

module.exports = new ProveedorService();