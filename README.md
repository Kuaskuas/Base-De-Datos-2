
# Inventario Tienda - API REST

Este proyecto es una API REST para la gestión de inventario de una tienda, desarrollada con Node.js, Express y MongoDB (Mongoose). Permite administrar productos, proveedores y movimientos de stock, así como consultar reportes y el estado del inventario.

## Características

- CRUD de productos y proveedores
- Registro de movimientos de stock (entradas y salidas)
- Consulta de stock actual y productos con stock bajo
- Reporte de movimientos por período
- Validaciones y control de stock mínimo

## Requisitos

- Node.js >= 14
- MongoDB >= 4

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd Base-De-Datos-2
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env` o usa `.env.developer` como ejemplo:
   ```env
   MONGO_URI=mongodb://localhost:27017/inventario_tienda
   PORT=3000
   ```
4. (Opcional) Ejecuta el seeder para poblar la base de datos con datos de ejemplo:
   ```bash
   node seed.js
   ```

## Ejecución

Inicia el servidor con:
```bash
npm start
# o
node index.js
```
El servidor escuchará en el puerto definido en `.env` (por defecto 3000).

## Estructura del Proyecto

- `models/` - Esquemas de Mongoose para Productos, Proveedores y Movimientos
- `controllers/` - Lógica de control para cada recurso
- `services/` - Lógica de negocio y acceso a datos
- `routes/` - Definición de rutas de la API
- `config/` - Configuración de la base de datos
- `seed.js` - Script para poblar la base de datos

## Endpoints Principales

Todos los endpoints están bajo el prefijo `/api`.

### Productos
- `GET    /api/productos` - Listar productos
- `POST   /api/productos` - Crear producto
- `GET    /api/productos/:id` - Obtener producto por ID
- `PUT    /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto (borrado lógico)
- `GET    /api/productos/:codigo/stock` - Consultar stock por código
- `GET    /api/productos/stock/bajo` - Listar productos con stock bajo

### Proveedores
- `GET    /api/proveedores` - Listar proveedores
- `GET    /api/proveedores/:id` - Obtener proveedor por ID
- `POST   /api/proveedores` - Crear proveedor
- `PUT    /api/proveedores/:id` - Actualizar proveedor
- `DELETE /api/proveedores/:id` - Eliminar proveedor (borrado lógico)

### Movimientos
- `POST   /api/movimientos` - Registrar movimiento de stock
- `GET    /api/movimientos/reporte?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD` - Reporte de movimientos por período

## Ejemplo de Registro de Movimiento

```json
POST /api/movimientos
{
  "productoId": "<id_producto>",
  "tipo": "entrada", // o "salida"
  "cantidad": 5,
  "motivo": "Compra",
  "usuario": "admin"
}
```

## Notas

- El sistema valida stock suficiente antes de registrar una salida.
- Los movimientos guardan el stock anterior y posterior para trazabilidad.
- Los productos y proveedores se eliminan de forma lógica (campo `activo: false`).

## Participantes

- Camilo Dietrich
- Garnica Martin Andres
