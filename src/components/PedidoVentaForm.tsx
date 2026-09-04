"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  ESTADOS_PEDIDO_VENTA,
  ESTADO_PEDIDO_VENTA_LABEL,
  TIPOS_VENTA,
  TIPO_VENTA_LABEL,
  MONEDAS,
  MONEDA_LABEL,
  CONDICIONES_VENTA,
  CONDICION_VENTA_LABEL,
  DIAS_CREDITO_OPCIONES,
} from "@/lib/pedidos-venta";
import { aFechaInput } from "@/lib/fechas";
import type { Cliente, Articulo, PedidoVentaConRelaciones } from "@/db/schema";
import type { EstadoFormularioPedidoVenta } from "@/app/pedidos-venta/actions";

type FilaItem = {
  key: string;
  articuloId: string;
  cantidad: string;
  precioUnitario: string;
  observaciones: string;
};

let contadorFilas = 0;
function nuevaFila(): FilaItem {
  contadorFilas += 1;
  return {
    key: `fila-${contadorFilas}-${Date.now()}`,
    articuloId: "",
    cantidad: "",
    precioUnitario: "",
    observaciones: "",
  };
}

export function PedidoVentaForm({
  action,
  pedidoVenta,
  clientes,
  articulos,
  submitLabel,
}: {
  action: (
    prevState: EstadoFormularioPedidoVenta,
    formData: FormData
  ) => Promise<EstadoFormularioPedidoVenta>;
  pedidoVenta?: PedidoVentaConRelaciones;
  clientes: Cliente[];
  articulos: Articulo[];
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<
    EstadoFormularioPedidoVenta,
    FormData
  >(action, null);

  const [condicionVenta, setCondicionVenta] = useState(
    pedidoVenta?.condicionVenta ?? "contado"
  );

  const [items, setItems] = useState<FilaItem[]>(() => {
    if (pedidoVenta && pedidoVenta.items.length > 0) {
      return pedidoVenta.items.map((item) => {
        contadorFilas += 1;
        return {
          key: `fila-${contadorFilas}-${item.id}`,
          articuloId: item.articuloId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario ?? "",
          observaciones: item.observaciones ?? "",
        };
      });
    }
    return [nuevaFila()];
  });

  function actualizarFila(key: string, cambios: Partial<FilaItem>) {
    setItems((prev) => prev.map((f) => (f.key === key ? { ...f, ...cambios } : f)));
  }

  function agregarFila() {
    setItems((prev) => [...prev, nuevaFila()]);
  }

  function quitarFila(key: string) {
    setItems((prev) => prev.filter((f) => f.key !== key));
  }

  const itemsJson = JSON.stringify(
    items.map((f) => ({
      articuloId: f.articuloId,
      cantidad: f.cantidad,
      precioUnitario: f.precioUnitario || null,
      observaciones: f.observaciones || null,
    }))
  );

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-3xl">
      {state?.error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-200">
          {state.error}
        </div>
      )}

      <input type="hidden" name="itemsJson" value={itemsJson} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="clienteId" className="text-sm font-medium text-zinc-700">
            Cliente *
          </label>
          <select
            id="clienteId"
            name="clienteId"
            required
            defaultValue={pedidoVenta?.clienteId ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            <option value="" disabled>
              Selecciona un cliente...
            </option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
                {c.estado === "inactivo" ? " (inactivo)" : ""}
              </option>
            ))}
          </select>
          {clientes.length === 0 && (
            <p className="text-xs text-zinc-500">
              No hay clientes registrados todavía.{" "}
              <Link href="/clientes/nuevo" className="underline">
                Crea uno primero
              </Link>
              .
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="numeroOcCliente" className="text-sm font-medium text-zinc-700">
            N° de OC del cliente
          </label>
          <input
            id="numeroOcCliente"
            name="numeroOcCliente"
            type="text"
            defaultValue={pedidoVenta?.numeroOcCliente ?? ""}
            placeholder="Ej. OC-4500123456"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fecha" className="text-sm font-medium text-zinc-700">
            Fecha *
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={aFechaInput(pedidoVenta?.fecha) || aFechaInput(new Date())}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="estado" className="text-sm font-medium text-zinc-700">
            Estado *
          </label>
          <select
            id="estado"
            name="estado"
            defaultValue={pedidoVenta?.estado ?? "pendiente"}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            {ESTADOS_PEDIDO_VENTA.map((estado) => (
              <option key={estado} value={estado}>
                {ESTADO_PEDIDO_VENTA_LABEL[estado]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="tipoVenta" className="text-sm font-medium text-zinc-700">
            Tipo de venta *
          </label>
          <select
            id="tipoVenta"
            name="tipoVenta"
            defaultValue={pedidoVenta?.tipoVenta ?? "directa"}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            {TIPOS_VENTA.map((tipo) => (
              <option key={tipo} value={tipo}>
                {TIPO_VENTA_LABEL[tipo]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="moneda" className="text-sm font-medium text-zinc-700">
            Moneda *
          </label>
          <select
            id="moneda"
            name="moneda"
            defaultValue={pedidoVenta?.moneda ?? "PEN"}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            {MONEDAS.map((moneda) => (
              <option key={moneda} value={moneda}>
                {MONEDA_LABEL[moneda]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="condicionVenta" className="text-sm font-medium text-zinc-700">
            Condición de venta *
          </label>
          <select
            id="condicionVenta"
            name="condicionVenta"
            value={condicionVenta}
            onChange={(e) =>
              setCondicionVenta(e.target.value as typeof condicionVenta)
            }
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
          >
            {CONDICIONES_VENTA.map((cond) => (
              <option key={cond} value={cond}>
                {CONDICION_VENTA_LABEL[cond]}
              </option>
            ))}
          </select>
        </div>

        {condicionVenta === "credito" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="diasCredito" className="text-sm font-medium text-zinc-700">
              Días de crédito *
            </label>
            <select
              id="diasCredito"
              name="diasCredito"
              required
              defaultValue={pedidoVenta?.diasCredito ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            >
              <option value="" disabled>
                Selecciona...
              </option>
              {DIAS_CREDITO_OPCIONES.map((dias) => (
                <option key={dias} value={dias}>
                  {dias} días
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-700">Artículos *</h2>
          <button
            type="button"
            onClick={agregarFila}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            + Agregar artículo
          </button>
        </div>

        {articulos.length === 0 ? (
          <p className="text-xs text-zinc-500">
            No hay artículos registrados todavía.{" "}
            <Link href="/articulos/nuevo" className="underline">
              Crea uno primero
            </Link>
            .
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600">Artículo</th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600">Cantidad</th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600">
                    Precio unitario
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600">
                    Observaciones
                  </th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {items.map((fila) => (
                  <tr key={fila.key}>
                    <td className="px-3 py-2">
                      <select
                        value={fila.articuloId}
                        onChange={(e) =>
                          actualizarFila(fila.key, { articuloId: e.target.value })
                        }
                        className="w-56 rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
                      >
                        <option value="" disabled>
                          Selecciona...
                        </option>
                        {articulos.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.codigo ? `${a.codigo} — ` : ""}
                            {a.descripcion}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={fila.cantidad}
                        onChange={(e) =>
                          actualizarFila(fila.key, { cantidad: e.target.value })
                        }
                        placeholder="0.00"
                        className="w-24 rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={fila.precioUnitario}
                        onChange={(e) =>
                          actualizarFila(fila.key, { precioUnitario: e.target.value })
                        }
                        placeholder="Opcional"
                        className="w-28 rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={fila.observaciones}
                        onChange={(e) =>
                          actualizarFila(fila.key, { observaciones: e.target.value })
                        }
                        placeholder="Opcional"
                        className="w-40 rounded-md border border-zinc-300 px-2 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => quitarFila(fila.key)}
                        disabled={items.length === 1}
                        className="text-xs font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="observaciones" className="text-sm font-medium text-zinc-700">
          Observaciones
        </label>
        <textarea
          id="observaciones"
          name="observaciones"
          rows={3}
          defaultValue={pedidoVenta?.observaciones ?? ""}
          placeholder="Notas adicionales sobre el pedido..."
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {isPending ? "Guardando..." : submitLabel}
        </button>
        <Link
          href="/pedidos-venta"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
