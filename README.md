# Sistema de Logística

Sistema web tipo ERP para Drillco Tools Perú: controla pedidos de venta,
despachos, órdenes de compra, transportistas, clientes, artículos y guías. Es
un sistema de información: guarda y organiza datos, no genera documentos
(guías, PDFs, etc.).

Construido con **Next.js 16** (App Router) + **PostgreSQL** vía **Drizzle ORM**.
Pensado para desplegarse en **Railway** de forma simple.

## Modelo de negocio

- Los **clientes** son las minas. Cada mina envía una OC, que se ingresa al
  sistema como **Pedido de venta** (con sus líneas de artículos, moneda, tipo
  de venta y condición de pago).
- Cada pedido de venta se **despacha** (módulo Despachos), y ese despacho se
  adjunta a una guía.
- Por separado, Drillco compra sus propios artículos a **proveedores**
  (locales o importaciones) mediante **órdenes de compra**. Este flujo de
  compras es independiente del flujo de venta/despacho — no están conectados
  entre sí.

## Módulos

| Módulo             | Estado         |
| ------------------- | -------------- |
| Pedidos de venta      | ✅ Disponible  |
| Despachos            | ✅ Disponible  |
| Clientes               | ✅ Disponible  |
| Artículos              | ✅ Disponible  |
| Transportistas        | ✅ Disponible  |
| Proveedores           | ✅ Disponible  |
| Órdenes de compra    | ✅ Disponible  |
| Guías                 | 🔜 Próximamente |

Los campos "Transportista" y "Pedido de venta" de un despacho son relaciones
reales (selectores), no texto libre. Reglas de borrado (guardas de
integridad): un transportista no se puede eliminar si tiene despachos
asociados; un cliente no se puede eliminar si tiene pedidos de venta
asociados; un artículo no se puede eliminar si aparece en líneas de algún
pedido de venta; un pedido de venta no se puede eliminar si tiene despachos
asociados; un proveedor no se puede eliminar si tiene órdenes de compra
asociadas. En todos los casos, la alternativa es marcar el registro como
"Inactivo"/"Cancelado" en vez de eliminarlo, o reasignar los registros
relacionados primero.

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

Si ya usaste el sistema y tienes despachos guardados antes de agregar un
módulo nuevo, no hay que hacer nada especial: las migraciones de backfill se
encargan de no perder información, la próxima vez que el servicio arranque
con el código nuevo.

- `drizzle/0002_backfill_transportistas.sql` crea un transportista por cada
  nombre que existía como texto libre y reasigna cada despacho.
- `drizzle/0005_backfill_ordenes_compra.sql` crea una orden de compra (con un
  proveedor placeholder) por cada número de OC que existía como texto libre.
- `drizzle/0009_backfill_pedidos_venta.sql` — al introducir el módulo de
  Pedidos de venta, el campo "Orden de compra" del despacho se reemplazó por
  "Pedido de venta" (son conceptos distintos: uno es una compra a un
  proveedor, el otro es la venta a un cliente). Si tenías despachos sin un
  pedido de venta asignado, esta migración crea un cliente placeholder
  ("Cliente sin especificar") y un pedido de venta placeholder, y reasigna
  ahí esos despachos. **Revisa esos despachos después de actualizar** y
  reasígnalos al cliente y pedido de venta correctos desde el formulario de
  edición.

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
    pedidos-venta/       # Módulo de Pedidos de venta (OC del cliente + líneas)
    despachos/            # Módulo de Despachos (páginas + server actions)
    clientes/              # Catálogo de clientes (minas)
    articulos/              # Maestro de artículos
    transportistas/          # Catálogo de transportistas
    proveedores/              # Catálogo de proveedores
    ordenes-compra/            # Compras propias a proveedores
    layout.tsx                  # Layout raíz con navegación entre módulos
    page.tsx                     # Panel principal
  components/                    # Componentes de UI reutilizables
  db/
    schema.ts                     # Definición de tablas (Drizzle)
    index.ts                       # Cliente de base de datos
    queries/                        # Funciones de acceso a datos, por módulo
    migrate.ts                       # Aplica migraciones pendientes
  instrumentation.ts                 # Corre las migraciones al iniciar el servidor
  lib/                                # Constantes y etiquetas de estado, por módulo
drizzle/                                # Migraciones SQL generadas
```

## Próximo módulo sugerido

- **Guías**: registro y consulta de guías de remisión, agrupando uno o más
  despachos.
