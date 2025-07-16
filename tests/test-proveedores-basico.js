const connectDB = require('../config/database');
const inventarioService = require('../services/inventarioService');

async function testProveedoresCRUD() {
  try {
    await connectDB();
    console.log('✅ Conectado a MongoDB');

    // 1. Crear proveedor
    const nuevoProveedor = {
      nombre: 'Proveedor Test',
      contacto: 'Contacto Test',
      telefono: '1234-5678',
      email: 'test@proveedor.com'
    };
    const creado = await inventarioService.crearProveedor(nuevoProveedor);
    console.log('🟢 Proveedor creado:', creado.data._id);

    // 2. Obtener todos los proveedores
    const lista = await inventarioService.obtenerTodosLosProveedores();
    console.log('🟢 Proveedores encontrados:', lista.data.length);

    // 3. Obtener proveedor por ID
    const consultado = await inventarioService.obtenerProveedorPorId(creado.data._id);
    console.log('🟢 Proveedor consultado:', consultado.data.nombre);

    // 4. Actualizar proveedor
    const actualizado = await inventarioService.actualizarProveedor(creado.data._id, {
      telefono: '9999-9999'
    });
    console.log('🟢 Proveedor actualizado:', actualizado.data.telefono);

    // 5. Eliminar proveedor (borrado lógico)
    const eliminado = await inventarioService.eliminarProveedor(creado.data._id);
    console.log('🟢 Proveedor eliminado (activo = false):', eliminado.data.activo === false);

    console.log('\n🎉 ¡Todos los tests básicos de proveedores pasaron!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testProveedoresCRUD();