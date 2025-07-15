const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del proveedor es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  contacto: {
    type: String,
    required: [true, 'El contacto es obligatorio'],
    trim: true,
    maxlength: [100, 'El contacto no puede exceder 100 caracteres']
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true,
    match: [/^[\+]?[0-9\s\-\(\)]+$/, 'Formato de teléfono inválido']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  productosOfrecidos: [{
    type: String,
    trim: true,
    uppercase: true
  }],
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para optimizar búsquedas
proveedorSchema.index({ nombre: 1 });
proveedorSchema.index({ email: 1 }, { unique: true });

// Método para agregar producto ofrecido
proveedorSchema.methods.agregarProductoOfrecido = function(codigoProducto) {
  if (!this.productosOfrecidos.includes(codigoProducto)) {
    this.productosOfrecidos.push(codigoProducto);
  }
};

// Método para remover producto ofrecido
proveedorSchema.methods.removerProductoOfrecido = function(codigoProducto) {
  this.productosOfrecidos = this.productosOfrecidos.filter(
    codigo => codigo !== codigoProducto
  );
};

module.exports = mongoose.model('Proveedor', proveedorSchema);