import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Logística",
  description: "Control de despachos, órdenes de compra, transportistas y guías.",
};

const NAV_ITEMS = [
  { href: "/despachos", label: "Despachos", disponible: true },
  { href: "#", label: "Órdenes de compra", disponible: false },
  { href: "#", label: "Transportistas", disponible: false },
  { href: "#", label: "Guías", disponible: false },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-sans">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Sistema de Logística
            </Link>
            <nav className="flex items-center gap-6">
              {NAV_ITEMS.map((item) =>
                item.disponible ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    key={item.label}
                    title="Próximamente"
                    className="text-sm font-medium text-zinc-300 cursor-not-allowed"
                  >
                    {item.label}
                  </span>
                )
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
