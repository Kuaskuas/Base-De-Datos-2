const Movimiento = require('../controllers/movimiento.controller');
const Producto = require('../controllers/producto.controller');     
const Proveedor = require('../controllers/proveedor.controller');

class Controladores {
    constructor() {
        this.movimientos = Movimiento;
        this.productos = Producto;
        this.proveedores = Proveedor;
    }
}

module.exports = new Controladores();