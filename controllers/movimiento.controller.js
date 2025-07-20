const servicios = require('../services/index.service');

class MovimientoController {
    async registrarMovimiento(req, res) {
      try {
        const resultado = await servicios.movimientos.registrarMovimiento(req.body);
        res.status(201).json(resultado);
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    };

    async consultarStock(req, res) {
      try {
        const { codigo } = req.params;
        const resultado = await servicios.movimientos.consultarStock(codigo);
        res.status(200).json(resultado);
      } catch (error) {
        res.status(404).json({ success: false, message: error.message });
      }
    };

    async reporteMovimientos(req, res) {
      try {
        const { fechaInicio, fechaFin } = req.query;
        const resultado = await servicios.movimientos.reporteMovimientos(fechaInicio, fechaFin);
        res.status(200).json(resultado);
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    };
}

module.exports = new MovimientoController();