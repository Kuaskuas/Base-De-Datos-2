const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: [true, 'El código del producto es obligatorio'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9]+$/, 'El código solo puede contener letras y números']
  },
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    maxlength: [150, 'El nombre no puede exceder 150 caracteres']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true,
    enum: {
      values: ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros','Juguetes', 'Otros'],
      message: 'Categoría no válida'
    }
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  stockActual: {
    type: Number,
    required: [true, 'El stock actual es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  stockMinimo: {
    type: Number,
    required: [true, 'El stock mínimo es obligatorio'],
    min: [0, 'El stock mínimo no puede ser negativo'],
    default: 1
  },
  proveedorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor',
    required: [true, 'El proveedor es obligatorio']
  },
  fechaUltimaActualizacion: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para optimizar búsquedas
productoSchema.index({ codigo: 1 });
productoSchema.index({ categoria: 1 });
productoSchema.index({ stockActual: 1 });
productoSchema.index({ proveedorId: 1 });

// Virtual para verificar si el stock está bajo
productoSchema.virtual('stockBajo').get(function() {
  return this.stockActual <= this.stockMinimo;
});

// Middleware para actualizar fechaUltimaActualizacion cuando cambia el stock
productoSchema.pre('save', function(next) {
  if (this.isModified('stockActual')) {
    this.fechaUltimaActualizacion = new Date();
  }
  next();
});

// Método para verificar disponibilidad
productoSchema.methods.tieneStock = function(cantidad = 1) {
  return this.stockActual >= cantidad;
};

// Método para actualizar stock
productoSchema.methods.actualizarStock = function(cantidad, tipo = 'entrada') {
  if (tipo === 'entrada') {
    this.stockActual += cantidad;
  } else if (tipo === 'salida') {
    if (this.stockActual >= cantidad) {
      this.stockActual -= cantidad;
    } else {
      throw new Error('Stock insuficiente');
    }
  }
  this.fechaUltimaActualizacion = new Date();
};

// Incluir virtuals en JSON
productoSchema.set('toJSON', { virtuals: true });
productoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Producto', productoSchema);