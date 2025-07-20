const servicios = require('../services/index.service');

class ProductoController {
    async agregarProducto(req, res) {
        try {
            const resultado = await servicios.productos.agregarProducto(req.body);
            res.status(201).json(resultado);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async obtenerProductos(req, res) {
        try {
            const resultado = await servicios.productos.obtenerTodosLosProductos();
            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async obtenerProductoPorId(req, res) {
        try {
            const resultado = await servicios.productos.obtenerProductoPorId(req.params.id);
            res.status(200).json(resultado);
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    async actualizarProducto(req, res) {
        try {
            const resultado = await servicios.productos.actualizarProducto(req.params.id, req.body);
            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    async eliminarProducto(req, res) {
        try {
            const resultado = await servicios.productos.eliminarProducto(req.params.id);
            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    async productosStockBajo(req, res) {
      try {
        const resultado = await servicios.productos.productosStockBajo();
        res.status(200).json(resultado);
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    };

}
module.exports = new ProductoController();