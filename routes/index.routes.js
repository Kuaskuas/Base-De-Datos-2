const express = require('express');
const router = express.Router();
const Controlador = require('../controllers/index.controller');

// CRUD de productos
router.get('/productos', Controlador.productos.obtenerProductos);
router.post('/productos', Controlador.productos.agregarProducto);
router.get('/productos/:id', Controlador.productos.obtenerProductoPorId);
router.put('/productos/:id', Controlador.productos.actualizarProducto);
router.delete('/productos/:id', Controlador.productos.eliminarProducto);

// CRUD de proveedores
router.get('/proveedores', Controlador.proveedores.obtenerProveedores);
router.get('/proveedores/:id', Controlador.proveedores.obtenerProveedorPorId);
router.post('/proveedores', Controlador.proveedores.crearProveedor);
router.put('/proveedores/:id', Controlador.proveedores.actualizarProveedor);
router.delete('/proveedores/:id', Controlador.proveedores.eliminarProveedor);

//Consultas del tp 
// Consultar stock de un producto por codigo
router.get('/productos/:codigo/stock', Controlador.movimientos.consultarStock);

// Listar productos con stock bajo
router.get('/productos/stock/bajo', Controlador.productos.productosStockBajo);

// Registrar movimiento de stock
router.post('/movimientos', Controlador.movimientos.registrarMovimiento);

// Reporte de movimientos por período
router.get('/movimientos/reporte', Controlador.movimientos.reporteMovimientos);

// Obtener proveedores 
router.get('/proveedores', Controlador.proveedores.obtenerProveedores);

module.exports = router;