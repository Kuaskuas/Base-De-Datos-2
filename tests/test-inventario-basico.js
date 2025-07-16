const connectDB = require('../config/database');
const inventarioService = require('../services/inventarioService');

async function testInventario() {
  try {
    await connectDB();
    console.log('✅ Conectado a MongoDB');

    // 1. Obtener todos los productos
    const productos = await inventarioService.obtenerTodosLosProductos();
    console.log('🟢 Productos encontrados:', productos.data.length);

    // 2. Agregar un producto (usa un proveedor existente)
    const Proveedor = require('../models/Proveedor');
    const proveedor = await Proveedor.findOne();
    if (!proveedor) throw new Error('No hay proveedores en la base de datos');

    const nuevoProducto = {
      codigo: 'TEST123',
      nombre: 'Producto Test',
      categoria: 'Electrónicos',
      precio: 123,
      stockActual: 10,
      stockMinimo: 2,
      proveedorId: proveedor._id
    };

    const productoCreado = await inventarioService.agregarProducto(nuevoProducto);
    console.log('🟢 Producto creado:', productoCreado.data.codigo);

    // 3. Consultar stock
    const stock = await inventarioService.consultarStock('TEST123');
    console.log('🟢 Stock consultado:', stock.data.stockInfo);

    // 4. Registrar movimiento de salida
    const movimiento = await inventarioService.registrarMovimiento({
      productoId: productoCreado.data._id,
      tipo: 'salida',
      cantidad: 3,
      motivo: 'Test salida',
      usuario: 'tester'
    });
    console.log('🟢 Movimiento registrado:', movimiento.data.movimiento.tipo);

    // 5. Productos con stock bajo
    const stockBajo = await inventarioService.productosStockBajo();
    console.log('🟢 Productos con stock bajo:', stockBajo.data.length);

    // 6. Reporte de movimientos
    const hoy = new Date();
    const ayer = new Date(hoy.getTime() - 24 * 60 * 60 * 1000);
    const reporte = await inventarioService.reporteMovimientos(ayer, hoy);
    console.log('🟢 Reporte movimientos:', reporte.data.estadisticas);

    console.log('\n🎉 ¡Todos los tests básicos pasaron!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testInventario();