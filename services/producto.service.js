const Producto = require('../models/Producto');
const Proveedor = require('../models/Proveedor');

class productoService {
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

            // Agregar el codigo del producto a la lista de productos ofrecidos del proveedor
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
}

module.exports = new productoService();