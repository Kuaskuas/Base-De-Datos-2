const Producto = require('../models/Producto');
const Proveedor = require('../models/Proveedor');
const Movimiento = require('../models/Movimiento');

class InventarioService {
  
  // 1. Añadir producto al catálogo
  async agregarProducto(datosProducto) {
    try {
      // Verificar que el proveedor existe
      const proveedor = await Proveedor.findById(datosProducto.proveedorId);
      if (!proveedor) {
        throw new Error('Proveedor no encontrado');
      }

      // Crear el producto
      const producto = new Producto(datosProducto);
      await producto.save();

      // Agregar el código del producto a la lista de productos ofrecidos del proveedor
      proveedor.agregarProductoOfrecido(producto.codigo);
      await proveedor.save();

      // Populate para devolver información completa
      await producto.populate('proveedorId', 'nombre contacto');

      return {
        success: true,
        message: 'Producto agregado exitosamente',
        data: producto
      };
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  }

  // 2. Registrar entrada/salida de stock
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

  // 3. Ver stock actual de un producto
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

  // 4. Listar productos con stock por debajo del mínimo
  async productosStockBajo() {
    try {
      const productos = await Producto.find({
        $expr: { $lte: ['$stockActual', '$stockMinimo'] },
        activo: true
      })
      .populate('proveedorId', 'nombre contacto telefono email')
      .sort({ stockActual: 1 });

      return {
        success: true,
        message: `${productos.length} productos con stock bajo`,
        data: productos.map(producto => ({
          _id: producto._id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          categoria: producto.categoria,
          stockActual: producto.stockActual,
          stockMinimo: producto.stockMinimo,
          diferencia: producto.stockMinimo - producto.stockActual,
          proveedor: producto.proveedorId,
          fechaUltimaActualizacion: producto.fechaUltimaActualizacion
        }))
      };
    } catch (error) {
      throw new Error(`Error al obtener productos con stock bajo: ${error.message}`);
    }
  }

  // 5. Reporte de movimientos en período
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

  // Función auxiliar: Obtener todos los productos
  async obtenerTodosLosProductos() {
    try {
      const productos = await Producto.find({ activo: true })
        .populate('proveedorId', 'nombre contacto')
        .sort({ codigo: 1 });

      return {
        success: true,
        message: `${productos.length} productos encontrados`,
        data: productos
      };
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  // Función auxiliar: Obtener todos los proveedores
  async obtenerTodosLosProveedores() {
    try {
      const proveedores = await Proveedor.find({ activo: true })
        .sort({ nombre: 1 });

      return {
        success: true,
        message: `${proveedores.length} proveedores encontrados`,
        data: proveedores
      };
    } catch (error) {
      throw new Error(`Error al obtener proveedores: ${error.message}`);
    }
  }

      // Obtener un producto por ID
    async obtenerProductoPorId(id) {
      try {
        const producto = await Producto.findById(id).populate('proveedorId', 'nombre contacto');
        if (!producto || !producto.activo) throw new Error('Producto no encontrado');
        return { success: true, data: producto };
      } catch (error) {
        throw new Error(`Error al obtener producto: ${error.message}`);
      }
    }

    // Actualizar un producto
    async actualizarProducto(id, datos) {
      try {
        const producto = await Producto.findByIdAndUpdate(
          id,
          datos,
          { new: true, runValidators: true }
        ).populate('proveedorId', 'nombre contacto');
        if (!producto) throw new Error('Producto no encontrado');
        return { success: true, message: 'Producto actualizado', data: producto };
      } catch (error) {
        throw new Error(`Error al actualizar producto: ${error.message}`);
      }
    }

    // Eliminar un producto (borrado lógico)
    async eliminarProducto(id) {
      try {
        const producto = await Producto.findByIdAndUpdate(
          id,
          { activo: false },
          { new: true }
        );
        if (!producto) throw new Error('Producto no encontrado');
        return { success: true, message: 'Producto eliminado', data: producto };
      } catch (error) {
        throw new Error(`Error al eliminar producto: ${error.message}`);
      }
    }

      // Obtener todos los proveedores
    async obtenerTodosLosProveedores() {
      try {
        const proveedores = await Proveedor.find({ activo: true }).sort({ nombre: 1 });
        return { success: true, message: `${proveedores.length} proveedores encontrados`, data: proveedores };
      } catch (error) {
        throw new Error(`Error al obtener proveedores: ${error.message}`);
      }
    }

    // Obtener proveedor por ID
    async obtenerProveedorPorId(id) {
      try {
        const proveedor = await Proveedor.findById(id);
        if (!proveedor || !proveedor.activo) throw new Error('Proveedor no encontrado');
        return { success: true, data: proveedor };
      } catch (error) {
        throw new Error(`Error al obtener proveedor: ${error.message}`);
      }
    }

    // Crear proveedor
    async crearProveedor(datos) {
      try {
        const proveedor = new Proveedor(datos);
        await proveedor.save();
        return { success: true, message: 'Proveedor creado', data: proveedor };
      } catch (error) {
        throw new Error(`Error al crear proveedor: ${error.message}`);
      }
    }

    // Actualizar proveedor
    async actualizarProveedor(id, datos) {
      try {
        const proveedor = await Proveedor.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
        if (!proveedor) throw new Error('Proveedor no encontrado');
        return { success: true, message: 'Proveedor actualizado', data: proveedor };
      } catch (error) {
        throw new Error(`Error al actualizar proveedor: ${error.message}`);
      }
    }

    // Eliminar proveedor (borrado lógico)
    async eliminarProveedor(id) {
      try {
        const proveedor = await Proveedor.findByIdAndUpdate(id, { activo: false }, { new: true });
        if (!proveedor) throw new Error('Proveedor no encontrado');
        return { success: true, message: 'Proveedor eliminado', data: proveedor };
      } catch (error) {
        throw new Error(`Error al eliminar proveedor: ${error.message}`);
      }
    }
}




module.exports = new InventarioService();