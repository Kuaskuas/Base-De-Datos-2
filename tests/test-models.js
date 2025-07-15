const connectDB = require('../config/database');
const inventarioService = require('../services/inventarioService.js');

async function probarModelos() {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('✅ Conectado a MongoDB');

    // Crear un proveedor de ejemplo
    const Proveedor = require('../models/Proveedor');
    const proveedor = new Proveedor({
      nombre: 'Tech Solutions',
      contacto: 'Juan Pérez',
      telefono: '+54-11-1234-5678',
      email: 'juan@techsolutions.com'
    });
    
    await proveedor.save();
    console.log('✅ Proveedor creado:', proveedor.nombre);

    // Crear un producto usando el servicio
    const resultadoProducto = await inventarioService.agregarProducto({
      codigo: 'LAPTOP001',
      nombre: 'Laptop HP Pavilion',
      categoria: 'Electrónicos',
      precio: 899.99,
      stockActual: 10,
      stockMinimo: 3,
      proveedorId: proveedor._id
    });

    console.log('✅ Producto creado:', resultadoProducto.data.nombre);

    // Consultar stock
    const stock = await inventarioService.consultarStock('LAPTOP001');
    console.log('✅ Stock consultado:', stock.data.stockInfo);

    // Registrar un movimiento
    const movimiento = await inventarioService.registrarMovimiento({
      productoId: resultadoProducto.data._id,
      tipo: 'salida',
      cantidad: 2,
      motivo: 'Venta a cliente',
      usuario: 'admin'
    });

    console.log('✅ Movimiento registrado:', movimiento.data.movimiento.tipo);

    // Verificar productos con stock bajo
    const stockBajo = await inventarioService.productosStockBajo();
    console.log('✅ Productos con stock bajo:', stockBajo.data.length);

    console.log('\n🎉 ¡Todos los modelos funcionan correctamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

probarModelos();