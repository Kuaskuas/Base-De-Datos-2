const inventarioService = require('../services/inventarioService');

// Añadir producto al catálogo
exports.agregarProducto = async (req, res) => {
  try {
    const resultado = await inventarioService.agregarProducto(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Registrar entrada/salida de stock
exports.registrarMovimiento = async (req, res) => {
  try {
    const resultado = await inventarioService.registrarMovimiento(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Ver stock actual de un producto
exports.consultarStock = async (req, res) => {
  try {
    const { codigo } = req.params;
    const resultado = await inventarioService.consultarStock(codigo);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Listar productos con stock bajo
exports.productosStockBajo = async (req, res) => {
  try {
    const resultado = await inventarioService.productosStockBajo();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Reporte de movimientos en período
exports.reporteMovimientos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await inventarioService.reporteMovimientos(fechaInicio, fechaFin);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// CRUD básico para productos (ejemplo)
exports.obtenerProductos = async (req, res) => {
  try {
    const resultado = await inventarioService.obtenerTodosLosProductos();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.obtenerProveedores = async (req, res) => {
  try {
    const resultado = await inventarioService.obtenerTodosLosProveedores();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const resultado = await inventarioService.obtenerProductoPorId(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Actualizar un producto
exports.actualizarProducto = async (req, res) => {
  try {
    const resultado = await inventarioService.actualizarProducto(req.params.id, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Eliminar un producto (borrado lógico)
exports.eliminarProducto = async (req, res) => {
  try {
    const resultado = await inventarioService.eliminarProducto(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.obtenerProveedorPorId = async (req, res) => {
  try {
    const resultado = await inventarioService.obtenerProveedorPorId(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.crearProveedor = async (req, res) => {
  try {
    const resultado = await inventarioService.crearProveedor(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.actualizarProveedor = async (req, res) => {
  try {
    const resultado = await inventarioService.actualizarProveedor(req.params.id, req.body);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.eliminarProveedor = async (req, res) => {
  try {
    const resultado = await inventarioService.eliminarProveedor(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};