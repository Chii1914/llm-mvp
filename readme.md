# 🛍️ Locust — E-Commerce con NestJS, Next.js y MongoDB

Un proyecto completo de e-commerce full-stack con arquitectura de microservicios, incluyendo backend API en NestJS, frontend moderno en Next.js, base de datos NoSQL (MongoDB) y herramientas de testing con Locust.

## 📋 Descripción General

**Locust** es un repositorio educativo que demuestra cómo construir una aplicación e-commerce escalable con:

- **Backend**: NestJS + MongoDB (NoSQL)
- **Frontend**: Next.js 14 + React + Bootstrap 5
- **Testing de Carga**: Locust (Python)
- **Containerización**: Docker + Docker Compose
- **Reverse Proxy**: Nginx (opcional)
- **Internationalization**: Español/English en el frontend

### Características Principales

✅ **API REST completa** con CRUD de productos  
✅ **Autenticación y autorización** (usuario/admin)  
✅ **Carrito de compras** con lógica de stock  
✅ **Interfaz admin** para gestionar productos  
✅ **Testing de carga** con Locust  
✅ **Totalmente dockerizado**  
✅ **Interfaz en español** (traducible)  
✅ **Scripts de lanzamiento** (macOS/Linux/Windows)  

---

## 🗂️ Estructura del Repositorio

```
locust/
├── ms-nosql-ecommerce/        # Backend NestJS + MongoDB
│   ├── src/
│   │   ├── products/          # Módulo de productos (CRUD)
│   │   ├── app.module.ts      # Módulo raíz con ConfigModule
│   │   └── main.ts            # Entry point con CORS habilitado
│   ├── locustfile.py          # Tests de carga (GET, POST, PATCH, DELETE, BUY)
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── frontend/                  # Frontend Next.js + Bootstrap
│   ├── app/
│   │   ├── page.tsx           # Página de tienda (comprador)
│   │   ├── admin/page.tsx     # Página admin (gestión)
│   │   ├── backend-select/    # Página de selección de backend
│   │   └── layout.tsx         # Layout raíz con Navbar
│   ├── components/Navbar.tsx  # Navegación
│   ├── context/BackendContext.tsx  # Context para selección de BD
│   ├── lib/
│   │   ├── apiConfig.ts       # Configuración centralizada de API
│   │   ├── productService.ts  # Cliente HTTP para productos
│   │   └── translations.ts    # Traducciones al español
│   ├── .env.local             # Variable NEXT_PUBLIC_API_URL
│   └── package.json
│
├── docker/                    # Docker Compose
│   └── docker-compose.yml     # MongoDB + MySQL + Nginx (optional)
│
├── run-all.sh                 # Script para macOS/Linux
├── run-all-windows.bat        # Script para Windows
└── README.md                  # Este archivo

```

---

## 🚀 Inicio Rápido

### Requisitos
- **Node.js** 18+ (con `npm` o `pnpm`)
- **Docker** & **Docker Compose** (opcional, para base de datos)
- **Python 3.8+** (para Locust, opcional)

### Opción 1: Script Automático (Recomendado)

#### macOS / Linux
```bash
cd /Users/maximilianoaguirre/Desktop/locust
./run-all.sh
```

**Opciones:**
```bash
./run-all.sh --no-docker        # Sin Docker
./run-all.sh --no-locust        # Sin Locust
./run-all.sh --build-frontend   # Construir frontend en producción
```

#### Windows
```cmd
cd C:\path\to\locust
run-all-windows.bat
```

El script abrirá ventanas separadas para:
- ✅ Backend (puerto 3000)
- ✅ Frontend (puerto 3001)
- ✅ Docker Compose (opcional)
- ✅ Locust UI (opcional)

### Opción 2: Manual (Terminal por terminal)

**Terminal 1 — Backend:**
```bash
cd ms-nosql-ecommerce
pnpm install
pnpm start:dev
# Backend escucha en http://localhost:3000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
# Frontend escucha en http://localhost:3001
```

**Terminal 3 — Docker (bases de datos):**
```bash
cd docker
docker compose up -d
# MongoDB en puerto 27017
# MySQL en puerto 3306
```

**Terminal 4 — Locust (opcional):**
```bash
cd ms-nosql-ecommerce
locust -f locustfile.py --host=http://localhost/api/
# Locust UI en http://localhost:8089
```

---

## 📡 Endpoints API

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/products` | Obtener todos los productos |
| `GET` | `/products/:id` | Obtener producto por ID |
| `POST` | `/products` | Crear nuevo producto |
| `PATCH` | `/products/:id` | Actualizar producto |
| `DELETE` | `/products/:id` | Eliminar producto |
| `POST` | `/products/:id/buy` | Comprar producto (reduce stock) |

### Ejemplo: Crear Producto

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming",
    "description": "High-performance laptop",
    "price": 1299.99,
    "stock": 50,
    "active": true,
    "category": { "name": "Electronics" }
  }'
```

### Ejemplo: Comprar Producto

```bash
curl -X POST http://localhost:3000/products/{productId}/buy \
  -H "Content-Type: application/json" \
  -d '{ "quantity": 3 }'
```

---

## 🎯 Flujo de Usuario

### Cliente (Tienda)
1. Accede a `http://localhost:3001`
2. Selecciona **NoSQL** como backend
3. Ve productos disponibles
4. Selecciona cantidad y **"Comprar Ahora"**
5. Stock se actualiza en tiempo real

### Administrador
1. Navega a `/admin`
2. Ve tabla de todos los productos
3. Puede:
   - ➕ **Crear** productos
   - ✏️ **Editar** detalles (precio, stock, categoría)
   - 🗑️ **Eliminar** productos
   - ✅ Marcar como activo/inactivo

---

## 🧪 Testing con Locust

Locust genera carga realista probando:

```python
@task(4)
def list_products(self):  # 40% de requests

@task(3)
def get_product(self):   # 30% de requests

@task(3)
def buy_product(self):   # 30% de requests

@task(2)
def update_product(self):  # 20% de requests

@task(1)
def delete_product(self):  # 10% de requests
```

### Usar Locust

**Interfaz Web:**
```bash
cd ms-nosql-ecommerce
locust -f locustfile.py --host=http://localhost:3000
```
Abre `http://localhost:8089` → Configura usuarios y tasa de spawn → Click "Start swarming"

**Headless (sin UI):**
```bash
locust -f locustfile.py --headless -u 100 -r 10 --run-time 5m --host=http://localhost:3000
```

---

## 🗄️ Bases de Datos

### MongoDB (NoSQL)
- **Puerto:** 27017
- **Usuario:** root
- **Contraseña:** rootpassword
- **Base de datos:** nest (automática)

### MySQL (opcional)
- **Puerto:** 3306
- **Usuario:** root
- **Contraseña:** password
- **Base de datos:** ecommerce

**Iniciar con Docker:**
```bash
cd docker
docker compose up -d
```

**Detener:**
```bash
cd docker
docker compose down
```

---

## 🌐 Frontend en Español

Todas las etiquetas, mensajes y errores están en **español**:

- `Tienda` → Shop page
- `Administrador` → Admin page
- `Comprar Ahora` → Buy Now
- `Actualizar Producto` → Update Product
- etc.

**Cambiar idioma:** Edita `lib/translations.ts` e implementa un toggle de idioma.

---

## 🔧 Variables de Entorno

### Backend (ms-nosql-ecommerce/.env)
```dotenv
MONGODB_URI=mongodb://root:rootpassword@localhost:27017/
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
PORT=3000
```

### Frontend (frontend/.env.local)
```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📚 Prompts y Contexto

### Iteración 1: Docker Compose
```
Hola gemini! Necesito que me proveas un Docker composer para poder usar mi backend en un trabajo, 
necesito levantar una base de datos mongodb y otra mysql, porfavor, debe persistir la data de ambas Bd's

-- comando para usar esto --
> docker compose up -d --force-recreate
```

### Iteración 2: Integración MySQL y NestJS
```
Necesito que dado el siguiente contexto me hagas una base de datos mysql porfavor, 
luego manteniendo ese contexto me ayudarás con mi integración en nestjs porfavor, cuando te lo pida eventualmente

Necesito que ahora te conviertas en un experto en ingeniería de software y modifiques el Docker composer 
para añadir el motor ngix para hacer los reverse proxy
```

### Iteración 3: Módulo de Productos
```
Perfect, we are working in ms-nosql-ecommerce, first, please add a .env and on the app.module.ts 
replace the import uri with the .env import, secondly, i creeated with nestjs cli the folder products, 
i need to integrade my mysql database, could you please do that on the schema for products ?

using the entity that i created, please implement the controller and service, 
i need a get to get all products and another endpoint to "buy" a product, i let to you the logic 
```

### Iteración 4: Testing con Locust
```
perfect, now i need a locuts file example 

please integrate a deletion of some products and the update on other products on the locustfile, 
to test all the api please

-- comando para usar esto --
> locust -f locustfile.py --host=http://localhost:3000
```

### Iteración 5: Frontend Next.js
```
now in top level of the folders i mean /locust i wanna create a nextjs frontend, basic, 
must have 2 pages, one to use the get products and buy them, and another page to the administrator 
i mean, modify products, delete and post more of them. use boostrap please, and isolate the url for the api 
```

### Iteración 6: Multi-Backend y Traducción
```
finally i need you to please isolate a mysql and a nosql front end, just let a page to select 
where to use the backend either the mysql one or the nosql one, let the nosql one that we have been 
working together, the mysql let empty for now with a message that says "tu turno tiano". 
And finnally translate all the frontend into spanish please
```

### Iteración 7: PROMPT MAESTRO - TypeORM + MySQL CRUD
```
Quiero que generes un CRUD completo para productos en NestJS usando TypeORM con MySQL. 
Debes crear todos los archivos necesarios dentro de src/products/ con el siguiente comportamiento:

Objetivo: replicar EXACTAMENTE el CRUD que hoy existe en mi microservicio NoSQL basado en MongoDB.
Mismos endpoints, mismos DTOs, mismo response JSON, misma lógica de comprar producto (/products/:id/buy).

Base de datos MySQL (ORM TypeORM):

Tabla producto con: id_producto (PK), nombre, descripcion, precio, stock, activo, id_categoria (FK)
Tabla categoria con: id_categoria (PK), nombre

Tareas que debes generar:

Entity Product (product.entity.ts)
- Mapear tabla producto
- FK a categoria

Entity Category (category.entity.ts)
- Mapear tabla categoria

DTOs compatibles con el backend MongoDB:

create-product.dto.ts
update-product.dto.ts
buy-product.dto.ts

Deben soportar este JSON:
{
  "name": "Laptop",
  "description": "High performance",
  "price": 1000,
  "stock": 5,
  "active": true,
  "category": { "name": "Electronics" }
}

ProductsService (products.service.ts)
CRUD completo:
- findAll
- findOne
- create (crea categoría si no existe)
- update
- delete
- buy (valida stock, resta stock)

ProductsController (products.controller.ts)
Rutas REST:
- GET /products
- GET /products/:id
- POST /products
- PATCH /products/:id
- DELETE /products/:id
- POST /products/:id/buy

ProductsModule (products.module.ts)
- Exporta TypeOrmModule con Product y Category.

Importante:
- Usa @nestjs/typeorm con repositorios
- Usa validaciones con class-validator
- Usa TypeORM con relaciones ManyToOne / OneToMany
- El código debe estar ya listo para pegar y funcionar
- Crea todos los archivos dentro de src/products/ con el contenido completo.
```

---

## 🛠️ Desarrollo y Troubleshooting

### El backend no inicia
```bash
cd ms-nosql-ecommerce
pnpm install  # Reinstalar dependencias
pnpm start:dev
```

### El frontend no conecta al backend
- Verifica que el backend esté en `http://localhost:3000`
- Edita `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3000`
- Verifica CORS en `ms-nosql-ecommerce/src/main.ts`

### MongoDB no está disponible
```bash
cd docker
docker compose up -d
# Espera 5 segundos y reinicia el backend
```

### Error de puerto en uso
```bash
# MacOS/Linux
lsof -i :3000  # Encuentra proceso en puerto 3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📦 Tech Stack

| Componente | Tecnología |
|-----------|-----------|
| Backend | NestJS 11 + TypeScript |
| Base Datos | MongoDB 8 + Mongoose |
| Frontend | Next.js 16 + React 19 |
| UI | Bootstrap 5 + react-bootstrap |
| HTTP Client | Axios |
| Testing | Locust + Python |
| Contenedores | Docker + Docker Compose |

---

## 🤝 Cómo Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Maximiliánno Aguirre** — E-commerce Full-Stack Project

---

## 🎓 Notas Educativas

Este proyecto demuestra:

- ✅ Arquitectura de API REST en NestJS
- ✅ Separación de responsabilidades (Service/Controller)
- ✅ Gestión de contexto en React (Context API)
- ✅ CORS y seguridad en APIs
- ✅ Testing de carga con Locust
- ✅ Internacionalización básica (i18n)
- ✅ Docker Compose multi-servicio
- ✅ Variables de entorno con `.env`

---

## 📞 Soporte

Para preguntas o issues:
1. Abre un **GitHub Issue**
2. Revisa los logs en `/logs` (si usas los scripts)
3. Verifica que Docker y Node.js estén correctamente instalados