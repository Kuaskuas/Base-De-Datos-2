const servicios = require('../services/index.service');

class ProveedorController {
    async obtenerProveedores(res, req) {
        try {
            const resultado = await servicios.proveedores.obtenerTodosLosProveedores();
            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    async obtenerProveedorPorId(res, req) {
        try {
            const resultado = await servicios.proveedores.obtenerProveedorPorId(req.params.id);
            res.status(200).json(resultado);
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    };

    async crearProveedor(res, req) {
        try {
            const resultado = await servicios.proveedores.crearProveedor(req.body);
            res.status(201).json(resultado);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    async actualizarProveedor(res, req) {
        try {
            const resultado = await servicios.proveedores.actualizarProveedor(req.params.id, req.body);
            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    async eliminarProveedor(res, req) {
        try {
            const resultado = await servicios.proveedores.eliminarProveedor(req.params.id);
            res.status(200).json(resultado);
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

}

module.exports = new ProveedorController();