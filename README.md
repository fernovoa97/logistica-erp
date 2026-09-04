# Sistema de Logística

Sistema web tipo ERP para controlar despachos, órdenes de compra, transportistas
y guías. Es un sistema de información: guarda y organiza datos, no genera
documentos (guías, PDFs, etc.).

Construido con **Next.js 16** (App Router) + **PostgreSQL** vía **Drizzle ORM**.
Pensado para desplegarse en **Railway** de forma simple.

## Módulos

| Módulo             | Estado         |
| ------------------- | -------------- |
| Despachos            | ✅ Disponible  |
| Transportistas        | ✅ Disponible  |
| Órdenes de compra    | 🔜 Próximamente |
| Guías                 | 🔜 Próximamente |

El campo "Transportista" de un despacho ahora es una relación real con el
catálogo de Transportistas (selector, no texto libre). Un transportista no se
puede eliminar si tiene despachos asociados: primero hay que reasignarlos o
marcar al transportista como "Inactivo".

Los módulos se construyen de forma progresiva. Cada módulo nuevo agrega su
propia carpeta en `src/app/<modulo>` y su tabla en `src/db/schema.ts`.

## Requisitos

- Node.js 20.9 o superior
- Una base de datos PostgreSQL (local o en Railway)

## Desarrollo local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` a `.env` y coloca tu cadena de conexión a PostgreSQL:

   ```bash
   cp .env.example .env
   ```

3. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Al iniciar, la aplicación **aplica automáticamente las migraciones
   pendientes** contra la base de datos indicada en `DATABASE_URL` (ver
   `src/instrumentation.ts`). No necesitas correr ningún comando de base de
   datos aparte.

4. Abre [http://localhost:3000](http://localhost:3000).

## Cambiar el esquema de la base de datos

Cuando se agregue o modifique un módulo (por ejemplo, una nueva columna o una
tabla nueva en `src/db/schema.ts`):

```bash
npm run db:generate
```

Esto genera un nuevo archivo SQL en `drizzle/`. Al desplegar (o al reiniciar
`npm run dev`), la migración se aplica sola.

Para explorar los datos con una interfaz visual:

```bash
npm run db:studio
```

### Actualizar un despliegue que ya tiene datos

Si ya usaste el sistema y tienes despachos guardados antes de agregar el
módulo de Transportistas: no hay que hacer nada especial. La migración
`drizzle/0002_backfill_transportistas.sql` crea automáticamente un
transportista por cada nombre que ya existía escrito como texto libre y
reasigna cada despacho al transportista correcto, sin perder información.
Esto pasa solo, la próxima vez que el servicio arranque con el código nuevo.

## Despliegue en Railway

1. Sube este proyecto a un repositorio de GitHub.
2. En Railway, crea un nuevo proyecto y selecciona **"Deploy from GitHub repo"**,
   eligiendo este repositorio.
3. Agrega un plugin de **PostgreSQL** al proyecto (botón "+ New" → "Database" →
   "PostgreSQL").
4. En el servicio web (el que corre Next.js), ve a la pestaña **Variables** y
   agrega:

   ```
   DATABASE_URL = ${{Postgres.DATABASE_URL}}
   ```

   (Railway te sugiere esta referencia automáticamente al escribir `DATABASE_URL`;
   así el servicio web se conecta al plugin de PostgreSQL sin copiar contraseñas
   a mano.)

5. Railway detecta automáticamente que es un proyecto Next.js (usa Nixpacks) y
   ejecuta `npm run build` y luego `npm run start`. Esto ya está confirmado en
   `railway.json`.
6. Al desplegar, la aplicación crea automáticamente las tablas necesarias en la
   base de datos (no hay que correr migraciones a mano).
7. Railway te da una URL pública (`*.up.railway.app`) o puedes conectar tu
   propio dominio desde la pestaña **Settings** del servicio.

Eso es todo — no se requiere configuración adicional para tener el sistema
funcionando en producción.

### Notas para producción

- El proceso de auto-migración al arrancar está pensado para una sola
  instancia del servicio (lo normal en un despliegue simple de Railway). Si
  más adelante escalas a varias instancias corriendo en paralelo, conviene
  mover la migración a un paso de despliegue separado en vez de que cada
  instancia la ejecute al iniciar.
- Actualmente el sistema no tiene login (queda abierto). Si en el futuro varias
  personas van a usarlo, se puede agregar autenticación como un módulo aparte.

## Estructura del proyecto

```
src/
  app/
    despachos/          # Módulo de Despachos (páginas + server actions)
    layout.tsx           # Layout raíz con navegación entre módulos
    page.tsx              # Panel principal
  components/            # Componentes de UI reutilizables
  db/
    schema.ts             # Definición de tablas (Drizzle)
    index.ts               # Cliente de base de datos
    queries.ts             # Funciones de acceso a datos
    migrate.ts              # Aplica migraciones pendientes
  instrumentation.ts       # Corre las migraciones al iniciar el servidor
  lib/
    estados.ts              # Constantes y etiquetas de estado
drizzle/                    # Migraciones SQL generadas
```

## Próximos módulos sugeridos

- **Transportistas**: catálogo con datos de contacto y vehículos. Cuando se
  construya, el campo `transportista` de Despachos pasará de texto libre a una
  relación con este módulo.
- **Órdenes de compra**: registro con su propio estado y detalle. El campo
  `ordenCompraRef` de Despachos se enlazará a este módulo.
- **Guías**: registro y consulta de guías de remisión, enlazado a Despachos.
