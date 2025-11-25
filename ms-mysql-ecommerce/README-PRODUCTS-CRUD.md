# Products CRUD - MySQL NestJS Microservice

Este módulo implementa un CRUD completo para productos con NestJS, TypeORM y MySQL, replicando exactamente la funcionalidad del microservicio NoSQL.

## Estructura

```
src/products/
├── entities/
│   ├── product.entity.ts       # Entity Product con FK a Category
│   └── category.entity.ts      # Entity Category
├── dto/
│   ├── create-product.dto.ts   # DTO para crear productos
│   ├── update-product.dto.ts   # DTO para actualizar productos
│   └── buy-product.dto.ts      # DTO para compra de productos
├── products.service.ts         # Lógica de negocio
├── products.controller.ts      # Controlador REST
├── products.module.ts          # Módulo NestJS
├── products.service.spec.ts    # Unit tests del servicio
└── products.controller.spec.ts # Unit tests del controlador
```

## Base de Datos

### Tabla: `producto`
```sql
CREATE TABLE producto (
  id_producto INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  activo BOOLEAN DEFAULT true,
  id_categoria INT,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);
```

### Tabla: `categoria`
```sql
CREATE TABLE categoria (
  id_categoria INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL
);
```

## Endpoints REST

### GET /products
Obtiene todos los productos con sus categorías.

**Response:**
```json
[
  {
    "id_producto": 1,
    "nombre": "Laptop",
    "descripcion": "High performance",
    "precio": 1000,
    "stock": 5,
    "activo": true,
    "id_categoria": 1,
    "categoria": {
      "id_categoria": 1,
      "nombre": "Electronics"
    }
  }
]
```

---

### GET /products/:id
Obtiene un producto específico por ID.

**Response:** (mismo formato que arriba)

---

### POST /products
Crea un nuevo producto (crea la categoría si no existe).

**Request:**
```json
{
  "name": "Laptop",
  "description": "High performance",
  "price": 1000,
  "stock": 5,
  "active": true,
  "category": {
    "name": "Electronics"
  }
}
```

**Response:**
```json
{
  "id_producto": 1,
  "nombre": "Laptop",
  "descripcion": "High performance",
  "precio": 1000,
  "stock": 5,
  "activo": true,
  "id_categoria": 1,
  "categoria": {
    "id_categoria": 1,
    "nombre": "Electronics"
  }
}
```

---

### PATCH /products/:id
Actualiza un producto existente (parcial o completo).

**Request:**
```json
{
  "name": "Updated Laptop",
  "price": 1200,
  "stock": 10
}
```

**Response:** (producto actualizado)

---

### DELETE /products/:id
Elimina un producto.

**Response:**
```json
{
  "message": "Product with ID 1 has been deleted"
}
```

---

### POST /products/:id/buy
Compra una cantidad de productos, disminuyendo el stock.

**Request:**
```json
{
  "quantity": 2
}
```

**Response:**
```json
{
  "id_producto": 1,
  "nombre": "Laptop",
  "descripcion": "High performance",
  "precio": 1000,
  "stock": 3,
  "activo": true,
  "id_categoria": 1,
  "categoria": {
    "id_categoria": 1,
    "nombre": "Electronics"
  }
}
```

**Validaciones:**
- Quantity debe ser mayor que 0
- No puede haber stock insuficiente (lanzará error 400 Bad Request)
- Si el stock llega a 0, el producto se marca como inactivo

---

## Configuración

Asegúrate de que las variables de entorno estén configuradas en `.env`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3302
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=tu_db_mysql
PORT=3000
```

La configuración en `app.module.ts` usa TypeORM con sincronización automática (`synchronize: true`), lo que crea automáticamente las tablas en la base de datos.

## Validaciones

El módulo incluye validaciones usando `class-validator`:
- DTOs validan tipos de datos
- Validación global en `main.ts` con `ValidationPipe`
- Whitelist automático de propiedades
- Transformación automática de tipos

## Testing

Para ejecutar los tests unitarios:

```bash
# Tests del servicio
npm run test -- products.service.spec

# Tests del controlador
npm run test -- products.controller.spec

# Todos los tests
npm run test
```

## Características Principales

✅ CRUD completo (Create, Read, Update, Delete)
✅ Relación ManyToOne entre Product y Category
✅ Creación automática de categorías si no existen
✅ Validación de stock en compra
✅ Marcado como inactivo cuando stock = 0
✅ Eager loading de categoría en findOne y findAll
✅ Unit tests para servicio y controlador
✅ Validación de DTOs con class-validator
✅ Compatible con MongoDB CRUD anterior

## Notas Importantes

- El ID se cambia de MongoDB ObjectId a número (INT AUTO_INCREMENT) de MySQL
- Los nombres de campos en la BD están en español pero los DTOs acepta en inglés para compatibilidad
- TypeORM sincroniza automáticamente las entidades con la BD
- La categoría se crea automáticamente si no existe al crear/actualizar productos
