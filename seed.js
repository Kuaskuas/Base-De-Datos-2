const mongoose = require('mongoose');
const connectDB = require('./config/database');
const Proveedor = require('./models/Proveedor');
const Producto = require('./models/Producto');
const Movimiento = require('./models/Movimiento');

async function seedProveedores() {
  const count = await Proveedor.countDocuments();
  if (count > 0) {
    console.log('Proveedores ya existen, se omite seed.');
    return;
  }
  await Proveedor.insertMany([
    {
      nombre: 'Proveedor Uno',
      contacto: 'Juan Pérez',
      telefono: '1111-1111',
      email: 'uno@proveedor.com'
    },
    {
      nombre: 'Proveedor Dos',
      contacto: 'Ana Gómez',
      telefono: '2222-2222',
      email: 'dos@proveedor.com'
    },
    {
      nombre: 'Proveedor Tres',
      contacto: 'Carlos Ruiz',
      telefono: '3333-3333',
      email: 'tres@proveedor.com'
    }
  ]);
  console.log('Proveedores seed completado');
}

async function seedProductos() {
  const count = await Producto.countDocuments();
  if (count > 0) {
    console.log('Productos ya existen, se omite seed.');
    return;
  }
  const proveedores = await Proveedor.find().limit(3);
  if (proveedores.length < 3) {
    throw new Error('Se necesitan al menos 3 proveedores para este seeder.');
  }
  await Producto.insertMany([
    {
      codigo: 'P001',
      nombre: 'Producto A',
      categoria: 'Electrónicos',
      precio: 100,
      stockActual: 10,
      stockMinimo: 2,
      proveedorId: proveedores[0]._id
    },
    {
      codigo: 'P002',
      nombre: 'Producto B',
      categoria: 'Hogar',
      precio: 50,
      stockActual: 5,
      stockMinimo: 1,
      proveedorId: proveedores[1]._id
    },
    {
      codigo: 'P003',
      nombre: 'Producto C',
      categoria: 'Juguetes',
      precio: 30,
      stockActual: 8,
      stockMinimo: 3,
      proveedorId: proveedores[2]._id
    }
  ]);
  console.log('Productos seed completado');
}

async function seedMovimientos() {
  const count = await Movimiento.countDocuments();
  if (count > 0) {
    console.log('Movimientos ya existen, se omite seed.');
    return;
  }
  const productos = await Producto.find().limit(3);
  if (productos.length < 3) {
    throw new Error('Se necesitan al menos 3 productos para este seeder.');
  }
  await Movimiento.insertMany([
    {
      productoId: productos[0]._id,
      tipo: 'entrada',
      cantidad: 5,
      motivo: 'Compra inicial',
      usuario: 'admin',
      stockAnterior: 0,
      stockPosterior: 5,
      fecha: new Date()
    },
    {
      productoId: productos[1]._id,
      tipo: 'salida',
      cantidad: 2,
      motivo: 'Venta',
      usuario: 'admin',
      stockAnterior: 5,
      stockPosterior: 3,
      fecha: new Date()
    },
    {
      productoId: productos[2]._id,
      tipo: 'entrada',
      cantidad: 10,
      motivo: 'Reposición',
      usuario: 'admin',
      stockAnterior: 0,
      stockPosterior: 10,
      fecha: new Date()
    }
  ]);
  console.log('Movimientos seed completado');
}

async function runSeeders() {
  try {
    await connectDB();
    await seedProveedores();
    await seedProductos();
    await seedMovimientos();
    console.log('\nTodos los seeders ejecutados correctamente.');
  } catch (error) {
    console.error('Error en el seeder:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

runSeeders();