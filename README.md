# Express.js - Node.js con TypeScript

Este es un sistema de gestión de inventarios profesional migrado de JavaScript a **TypeScript**, aplicando arquitectura de capas y estándares modernos de Backend (ESM).

## Tecnologías utilizadas

* **Node.js** (Entorno de ejecución)
* **Express** (Framework de servidor)
* **TypeScript** (Lenguaje principal)
* **SQLite3** (Base de datos relacional)
* **TSX** (Ejecutor de TypeScript en desarrollo)
* **Bcrypt** (Seguridad de contraseñas)
* **JWT** (Autenticación)

## Estructura del Proyecto (Arquitectura de Capas)

* `src/index.ts`: Punto de entrada del servidor.
* `src/config/`: Configuración de base de datos y variables de entorno.
* `src/models/`: Definición de interfaces y lógica de datos.
* `src/controllers/`: Lógica de negocio y manejo de peticiones.
* `src/routes/`: Definición de puntos de acceso (endpoints).
* `src/middlewares/`: Filtros de seguridad y validación.
* `src/types/`: Definiciones de tipos globales.

### 1. Sistema de Módulos
Se configuró el proyecto como **ES Modules** (`"type": "module"` en `package.json`).
**Regla de oro:** En TypeScript con ESM, todas las importaciones locales deben incluir la extensión `.js`, aunque el archivo fuente sea `.ts`.
*Ejemplo:* `import db from './config/database.js';`

### 2. Ejecución en Desarrollo
Se reemplazó `ts-node-dev` por **`tsx`** debido a su mejor compatibilidad con ESM y mayor velocidad.

## Comandos Principales

1. **Instalar dependencias:**
   ```bash
   npm install

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev

3. **Compilar a JavaScript (Producción):**
   ```bash
   npm run build

4. **Iniciar en producción:**
   ```bash
   npm start





