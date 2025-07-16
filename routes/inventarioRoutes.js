const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// CRUD de productos
router.get('/productos', inventarioController.obtenerProductos);
router.post('/productos', inventarioController.agregarProducto);
router.get('/productos/:id', inventarioController.obtenerProductoPorId);
router.put('/productos/:id', inventarioController.actualizarProducto);
router.delete('/productos/:id', inventarioController.eliminarProducto);

// CRUD de proveedores
router.get('/proveedores', inventarioController.obtenerProveedores);
router.get('/proveedores/:id', inventarioController.obtenerProveedorPorId);
router.post('/proveedores', inventarioController.crearProveedor);
router.put('/proveedores/:id', inventarioController.actualizarProveedor);
router.delete('/proveedores/:id', inventarioController.eliminarProveedor);

//Consultas del tp 
// Consultar stock de un producto por codigo
router.get('/productos/:codigo/stock', inventarioController.consultarStock);

// Listar productos con stock bajo
router.get('/productos/stock/bajo', inventarioController.productosStockBajo);

// Registrar movimiento de stock
router.post('/movimientos', inventarioController.registrarMovimiento);

// Reporte de movimientos por período
router.get('/movimientos/reporte', inventarioController.reporteMovimientos);

// Obtener proveedores
router.get('/proveedores', inventarioController.obtenerProveedores);

module.exports = router;