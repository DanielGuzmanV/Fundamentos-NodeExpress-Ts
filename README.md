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
Se reemplazó `ts-node-dev` por **`tsx`** debido a su mejor compatibilidad con ESM y mayor velocidad. Se utiliza el gestor **pnpm** por su rapidez y gestión eficiente de `node_modules`.

## Comandos Principales

1. **Instalar dependencias:**
   ```bash
   pnpm install

2. **Ejecutar en modo desarrollo:**
   ```bash
   pnpm run dev

3. **Compilar a JavaScript (Producción):**
   ```bash
   pnpm run build

4. **Iniciar en producción:**
   ```bash
   pnpm start

## Configuración e Inicialización de Prisma 7 con SQLite

### 1\. Instalación de Dependencias

Para comenzar con Prisma 7 en un entorno de Node.js con TypeScript y pnpm, se instalaron los paquetes necesarios en las dependencias de desarrollo y de producción:

```bash
pnpm add @prisma/client
pnpm add prisma --save-dev
```

__Nota: No se requiere ningún adaptador de SQLite externo (como__ _`_@prisma/adapter-sqlite_`___) para entornos estándar de Node.js/Express; el motor nativo de Prisma se encarga de la conexión directamente.__

### 2\. Inicialización del Proyecto Prisma

Se ejecutó el comando de inicialización para generar la estructura base:

```bash
pnpm prisma init
```

### 3\. Configuración del Entorno (.env)

Se configuró la variable de entorno en el archivo `.env` apuntando a un archivo de base de datos exclusivo para las pruebas con el ORM:

Fragmento de código

```
DATABASE_URL="file:./inventario_prisma.db"
```

### 4\. Definición del Esquema (`prisma/schema.prisma`)

Se estructuró el archivo de los modelos mapeando las tablas existentes mediante el atributo `@@map`. Se configuró la salida (`output`) de manera personalizada hacia la carpeta `src`

### 5\. Creación de Migraciones y Sincronización

Para aplicar los modelos a la base de datos por primera vez y generar el historial de cambios, se ejecutó el siguiente comando en la terminal:

```bash
pnpm prisma migrate dev --name migracion\_inicial  
```

Este comando:

-   Lee el archivo `prisma.config.ts` utilizando la función nativa `env("DATABASE_URL")`.
-   Crea el archivo físico `inventario_prisma.db`.
-   Genera la carpeta estructurada `prisma/migrations/` con el archivo correspondiente en código SQL puro (`migration.sql`).

### 6\. Generación Física del Cliente Tipado

En caso de que el cliente de tipado estricto no se escriba físicamente en la ruta relativa especificada del `src`, se debe forzar su creación mediante el comando:

```bash
pnpm prisma generate
```

Esto escribe todos los archivos de tipos de TypeScript necesarios dentro del directorio `src/generated/prisma`.

### 7\. Inicialización Global del Cliente (`src/config/prisma.ts`)

Se configuró la instancia del cliente utilizando módulos de ECMAScript (ESM), por lo que es obligatorio especificar la extensión `.js` en la importación relativa