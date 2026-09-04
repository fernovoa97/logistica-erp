import Link from "next/link";

const MODULOS = [
  {
    href: "/pedidos-venta",
    nombre: "Pedidos de venta",
    descripcion: "Las OC que envían las minas (clientes), ingresadas al sistema con sus artículos.",
    disponible: true,
  },
  {
    href: "/despachos",
    nombre: "Despachos",
    descripcion: "Registra y controla el estado de cada despacho, su transportista, pedido de venta y guía asociada.",
    disponible: true,
  },
  {
    href: "/clientes",
    nombre: "Clientes",
    descripcion: "Catálogo de clientes (minas): contacto, RUC y estado.",
    disponible: true,
  },
  {
    href: "/articulos",
    nombre: "Artículos",
    descripcion: "Maestro de artículos de perforación que se venden a los clientes.",
    disponible: true,
  },
  {
    href: "/ordenes-compra",
    nombre: "Órdenes de compra",
    descripcion: "Compras propias a proveedores (locales e importaciones), independientes de los pedidos de venta.",
    disponible: true,
  },
  {
    href: "/transportistas",
    nombre: "Transportistas",
    descripcion: "Catálogo de transportistas: contacto, vehículo y estado.",
    disponible: true,
  },
  {
    href: "/proveedores",
    nombre: "Proveedores",
    descripcion: "Catálogo de proveedores: contacto, RUC y estado.",
    disponible: true,
  },
  {
    href: "#",
    nombre: "Guías",
    descripcion: "Próximamente: registro y consulta de guías de remisión.",
    disponible: false,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sistema de Logística</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Panel de control para despachos, órdenes de compra, transportistas y guías. Iremos
          habilitando módulos de forma progresiva.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MODULOS.map((modulo) =>
          modulo.disponible ? (
            <Link
              key={modulo.nombre}
              href={modulo.href}
              className="rounded-lg border border-zinc-200 bg-white p-5 transition hover:border-zinc-400 hover:shadow-sm"
            >
              <h2 className="font-medium">{modulo.nombre}</h2>
              <p className="mt-1 text-sm text-zinc-600">{modulo.descripcion}</p>
            </Link>
          ) : (
            <div
              key={modulo.nombre}
              className="rounded-lg border border-dashed border-zinc-200 bg-zinc-100/50 p-5 opacity-60"
            >
              <h2 className="font-medium">{modulo.nombre}</h2>
              <p className="mt-1 text-sm text-zinc-600">{modulo.descripcion}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
