import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const TablaVentas = ({ ventasFiltradas, filtroGlobal, setFiltroGlobal }) => {
  const columns = useMemo(
    () => [
      { header: 'Fecha', accessorKey: 'fecha' },
      { header: 'Producto', accessorKey: 'producto' },
      { header: 'Categoría', accessorKey: 'categoria' },
      { header: 'Cantidad', accessorKey: 'cantidad' },
      { header: 'Precio Unitario', accessorKey: 'precio_unitario' },
      { header: 'Total Venta', accessorKey: 'total_venta' },
      { header: 'Cliente', accessorKey: 'cliente' },
      { header: 'Ciudad', accessorKey: 'ciudad' },
    ],
    []
  );

  const table = useReactTable({
    data: ventasFiltradas,
    columns,
    state: { globalFilter: filtroGlobal },
    onGlobalFilterChange: setFiltroGlobal,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <h2>Ventas Detalladas</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Buscar: </label>
        <input
          type="text"
          value={filtroGlobal}
          onChange={(e) => setFiltroGlobal(e.target.value)}
          placeholder="Buscar en todas las columnas"
          style={{ padding: '0.5rem', width: '300px' }}
        />
      </div>
      <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '1rem' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: 'pointer' }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === 'asc' ? ' 🔼' :
                   header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          ⬅️ Anterior
        </button>
        <span>
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente ➡️
        </button>
      </div>
    </>
  );
};

export default TablaVentas;
