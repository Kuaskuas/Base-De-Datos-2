const connectDB = require('../config/database');
const inventarioService = require('../services/inventarioService');
const Proveedor = require('../models/Proveedor');

async function testProductosCRUD() {
  try {
    await connectDB();
    console.log('✅ Conectado a MongoDB');

    // 1. Buscar un proveedor activo para asociar al producto
    const proveedor = await Proveedor.findOne({ activo: true });
    if (!proveedor) throw new Error('No hay proveedores activos en la base de datos');

    // 2. Crear producto
    const nuevoProducto = {
      codigo: 'PRUEBA123',
      nombre: 'Producto Test',
      categoria: 'Electrónicos',
      precio: 150,
      stockActual: 20,
      stockMinimo: 5,
      proveedorId: proveedor._id
    };
    const creado = await inventarioService.agregarProducto(nuevoProducto);
    console.log('🟢 Producto creado:', creado.data._id);

    // 3. Obtener todos los productos
    const lista = await inventarioService.obtenerTodosLosProductos();
    console.log('🟢 Productos encontrados:', lista.data.length);

    // 4. Obtener producto por ID
    const consultado = await inventarioService.obtenerProductoPorId(creado.data._id);
    console.log('🟢 Producto consultado:', consultado.data.nombre);

    // 5. Actualizar producto
    const actualizado = await inventarioService.actualizarProducto(creado.data._id, {
      precio: 200
    });
    console.log('🟢 Producto actualizado (nuevo precio):', actualizado.data.precio);

    // 6. Eliminar producto (borrado lógico)
    const eliminado = await inventarioService.eliminarProducto(creado.data._id);
    console.log('🟢 Producto eliminado (activo = false):', eliminado.data.activo === false);

    console.log('\n🎉 ¡Todos los tests básicos de productos pasaron!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testProductosCRUD();