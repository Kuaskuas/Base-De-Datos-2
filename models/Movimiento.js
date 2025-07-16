const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema({
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: [true, 'El producto es obligatorio']
  },
  tipo: {
    type: String,
    required: [true, 'El tipo de movimiento es obligatorio'],
    enum: {
      values: ['entrada', 'salida'],
      message: 'El tipo debe ser "entrada" o "salida"'
    }
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [1, 'La cantidad debe ser mayor a 0']
  },
  motivo: {
    type: String,
    required: [true, 'El motivo es obligatorio'],
    trim: true,
    maxlength: [200, 'El motivo no puede exceder 200 caracteres']
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  usuario: {
    type: String,
    required: [true, 'El usuario es obligatorio'],
    trim: true,
    maxlength: [50, 'El usuario no puede exceder 50 caracteres']
  },
  stockAnterior: {
    type: Number,
    required: true,
    min: [0, 'El stock anterior no puede ser negativo']
  },
  stockPosterior: {
    type: Number,
    required: true,
    min: [0, 'El stock posterior no puede ser negativo']
  },
  observaciones: {
    type: String,
    trim: true,
    maxlength: [300, 'Las observaciones no pueden exceder 300 caracteres']
  }
}, {
  timestamps: true
});

// Índices para optimizar búsquedas
movimientoSchema.index({ productoId: 1 });
movimientoSchema.index({ fecha: -1 });
movimientoSchema.index({ tipo: 1 });
movimientoSchema.index({ usuario: 1 });

// Índice compuesto para reportes por rango de fechas
movimientoSchema.index({ fecha: 1, tipo: 1 });

// Virtual para calcular el impacto en el stock
movimientoSchema.virtual('impactoStock').get(function () {
  return this.tipo === 'entrada' ? this.cantidad : -this.cantidad;
});

// Método estático para obtener movimientos por rango de fechas
movimientoSchema.statics.obtenerPorRangoFecha = function (fechaInicio, fechaFin) {
  return this.find({
    fecha: {
      $gte: fechaInicio,
      $lte: fechaFin
    }
  }).populate('productoId', 'codigo nombre categoria').sort({ fecha: -1 });
};

// Método estático para obtener resumen de movimientos
movimientoSchema.statics.obtenerResumen = function (fechaInicio, fechaFin) {
  return this.aggregate([
    {
      $match: {
        fecha: {
          $gte: fechaInicio,
          $lte: fechaFin
        }
      }
    },
    {
      $group: {
        _id: '$tipo',
        totalMovimientos: { $sum: 1 },
        totalCantidad: { $sum: '$cantidad' }
      }
    }
  ]);
};

// Incluir virtuals en JSON
movimientoSchema.set('toJSON', { virtuals: true });
movimientoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Movimiento', movimientoSchema);