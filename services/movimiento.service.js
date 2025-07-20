const Movimiento = require('../models/Movimiento');
const Producto = require('../models/Producto');

class MovimientosService {
    async registrarMovimiento(datosMovimiento) {
        try {
            // Verificar que el producto existe
            const producto = await Producto.findById(datosMovimiento.productoId);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            // Guardar stock anterior
            const stockAnterior = producto.stockActual;

            // Validar stock suficiente para salidas
            if (datosMovimiento.tipo === 'salida' && !producto.tieneStock(datosMovimiento.cantidad)) {
                throw new Error(`Stock insuficiente. Stock actual: ${producto.stockActual}, Cantidad solicitada: ${datosMovimiento.cantidad}`);
            }

            // Actualizar stock del producto
            producto.actualizarStock(datosMovimiento.cantidad, datosMovimiento.tipo);
            await producto.save();

            // Crear el movimiento
            const movimiento = new Movimiento({
                ...datosMovimiento,
                stockAnterior: stockAnterior,
                stockPosterior: producto.stockActual
            });

            await movimiento.save();
            await movimiento.populate('productoId', 'codigo nombre categoria');

            return {
                success: true,
                message: 'Movimiento registrado exitosamente',
                data: {
                    movimiento,
                    stockAnterior,
                    stockActual: producto.stockActual
                }
            };
        } catch (error) {
            throw new Error(`Error al registrar movimiento: ${error.message}`);
        }
    }

    async consultarStock(codigo) {
        try {
            const producto = await Producto.findOne({ codigo: codigo.toUpperCase() })
                .populate('proveedorId', 'nombre contacto telefono email');

            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            // Obtener últimos movimientos
            const ultimosMovimientos = await Movimiento.find({ productoId: producto._id })
                .sort({ fecha: -1 })
                .limit(5)
                .select('tipo cantidad motivo fecha usuario');

            return {
                success: true,
                data: {
                    producto,
                    stockInfo: {
                        stockActual: producto.stockActual,
                        stockMinimo: producto.stockMinimo,
                        stockBajo: producto.stockBajo,
                        disponible: producto.stockActual > 0
                    },
                    ultimosMovimientos
                }
            };
        } catch (error) {
            throw new Error(`Error al consultar stock: ${error.message}`);
        }
    }
    async reporteMovimientos(fechaInicio, fechaFin) {
        try {
            // Validar fechas
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);

            if (inicio > fin) {
                throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
            }

            // Obtener movimientos del período
            const movimientos = await Movimiento.obtenerPorRangoFecha(inicio, fin);

            // Obtener resumen estadístico
            const resumen = await Movimiento.obtenerResumen(inicio, fin);

            // Calcular estadísticas adicionales
            const estadisticas = {
                totalMovimientos: movimientos.length,
                entradas: movimientos.filter(m => m.tipo === 'entrada').length,
                salidas: movimientos.filter(m => m.tipo === 'salida').length,
                cantidadTotalEntradas: movimientos
                    .filter(m => m.tipo === 'entrada')
                    .reduce((sum, m) => sum + m.cantidad, 0),
                cantidadTotalSalidas: movimientos
                    .filter(m => m.tipo === 'salida')
                    .reduce((sum, m) => sum + m.cantidad, 0)
            };

            return {
                success: true,
                message: `Reporte generado del ${inicio.toLocaleDateString()} al ${fin.toLocaleDateString()}`,
                data: {
                    periodo: {
                        inicio: inicio.toISOString(),
                        fin: fin.toISOString()
                    },
                    estadisticas,
                    resumen,
                    movimientos
                }
            };
        } catch (error) {
            throw new Error(`Error al generar reporte: ${error.message}`);
        }
    }
}

module.exports = new MovimientosService();