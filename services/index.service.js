const MovimientoService = require('../services/movimiento.service');
const ProductoService = require('../services/producto.service');
const ProveedorService = require('../services/proveedor.service');

class Servicios {
  constructor() {
    this.movimientos = MovimientoService;
    this.productos = ProductoService;
    this.proveedores = ProveedorService;
  }
}

module.exports = new Servicios();