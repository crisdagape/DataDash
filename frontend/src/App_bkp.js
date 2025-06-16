import React, { useEffect, useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import {
  useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, flexRender,
} from '@tanstack/react-table';

function App() {
  const [ciudadFiltro, setCiudadFiltro] = useState("Todas");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtroGlobal, setFiltroGlobal] = useState("");

  useEffect(() => {
    fetch('http://localhost:3001/api/data')
      .then((res) => res.json())
      .then((data) => setVentas(data))
      .catch((err) => console.error('Error al obtener datos:', err));
  }, []);

  // Memoizar filtros
  const ventasFiltradas = useMemo(() => {
    return ventas.filter((v) => {
      const ciudadMatch = ciudadFiltro === "Todas" || v.ciudad === ciudadFiltro;
      const categoriaMatch = categoriaFiltro === "Todas" || v.categoria === categoriaFiltro;
      const fecha = new Date(v.fecha);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;
      const fechaMatch = (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
      return ciudadMatch && categoriaMatch && fechaMatch;
    });
  }, [ventas, ciudadFiltro, categoriaFiltro, fechaInicio, fechaFin]);

  // KPIs
  const totalVentas = useMemo(() =>
    ventasFiltradas.reduce((acc, v) => acc + Number(v.total_venta || 0), 0), [ventasFiltradas]
  );
  const totalProductos = useMemo(() =>
    ventasFiltradas.reduce((acc, v) => acc + Number(v.cantidad || 0), 0), [ventasFiltradas]
  );
  const clientesUnicos = useMemo(() =>
    new Set(ventasFiltradas.map((v) => v.cliente)).size, [ventasFiltradas]
  );
  const ciudadesUnicas = useMemo(() =>
    new Set(ventasFiltradas.map((v) => v.ciudad)).size, [ventasFiltradas]
  );

  const ventasOrdenadas = useMemo(() =>
    [...ventasFiltradas].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)), [ventasFiltradas]
  );

  const dataVentasAcumuladas = useMemo(() => {
    let acumulado = 0;
    return ventasOrdenadas.map((v) => {
      acumulado += Number(v.total_venta || 0);
      return {
        fecha: v.fecha,
        totalAcumulado: acumulado,
      };
    });
  }, [ventasOrdenadas]);

  const dataGrafico = useMemo(() => {
    const agrupadas = ventasFiltradas.reduce((acc, venta) => {
      if (!acc[venta.fecha]) acc[venta.fecha] = 0;
      acc[venta.fecha] += Number(venta.total_venta || 0);
      return acc;
    }, {});
    return Object.entries(agrupadas).map(([fecha, total]) => ({ fecha, total }));
  }, [ventasFiltradas]);

  const dataCategoria = useMemo(() => {
    const agrupadas = ventasFiltradas.reduce((acc, venta) => {
      if (!acc[venta.categoria]) acc[venta.categoria] = 0;
      acc[venta.categoria] += Number(venta.total_venta || 0);
      return acc;
    }, {});
    return Object.entries(agrupadas).map(([name, value]) => ({ name, value }));
  }, [ventasFiltradas]);

  const dataCiudad = useMemo(() => {
    const agrupadas = ventasFiltradas.reduce((acc, venta) => {
      if (!acc[venta.ciudad]) acc[venta.ciudad] = 0;
      acc[venta.ciudad] += Number(venta.total_venta || 0);
      return acc;
    }, {});
    return Object.entries(agrupadas).map(([ciudad, total]) => ({ ciudad, total }));
  }, [ventasFiltradas]);

  const ciudades = useMemo(() => ["Todas", ...new Set(ventas.map((v) => v.ciudad))], [ventas]);
  const categorias = useMemo(() => ["Todas", ...new Set(ventas.map((v) => v.categoria))], [ventas]);

  const columns = useMemo(() => [
    { header: 'Fecha', accessorKey: 'fecha' },
    { header: 'Producto', accessorKey: 'producto' },
    { header: 'Categoría', accessorKey: 'categoria' },
    { header: 'Cantidad', accessorKey: 'cantidad' },
    { header: 'Precio Unitario', accessorKey: 'precio_unitario' },
    { header: 'Total Venta', accessorKey: 'total_venta' },
    { header: 'Cliente', accessorKey: 'cliente' },
    { header: 'Ciudad', accessorKey: 'ciudad' },
  ], []);

  const table = useReactTable({
    data: ventasFiltradas,
    columns,
    state: {
      globalFilter: filtroGlobal,
    },
    onGlobalFilterChange: setFiltroGlobal,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 20, // limitar filas por página
      }
    }
  });

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard de Ventas</h1>

      {/* Filtros y KPIs */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
          <label>
            Ciudad:
            <select value={ciudadFiltro} onChange={(e) => setCiudadFiltro(e.target.value)}>
              {ciudades.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <br />
          <label>
            Categoría:
            <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
              {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <br />
          <label>
            Desde:
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </label>
          <br />
          <label>
            Hasta:
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </label>
          <h3>Total Ventas</h3>
          <p>S/ {totalVentas.toLocaleString()}</p>
        </div>

        <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
          <h3>Productos Vendidos</h3>
          <p>{totalProductos}</p>
        </div>
        <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
          <h3>Clientes</h3>
          <p>{clientesUnicos}</p>
        </div>
        <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
          <h3>Ciudades</h3>
          <p>{ciudadesUnicas}</p>
        </div>
      </div>

      {/* Gráficos */}
      <h2>Ventas por Día</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataGrafico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Ventas Acumuladas</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataVentasAcumuladas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalAcumulado" stroke="#ff7300" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>

      <h2>Ventas por Categoría</h2>
      <PieChart width={400} height={300}>
        <Pie data={dataCategoria} cx="50%" cy="50%" label outerRadius={100} fill="#8884d8" dataKey="value">
          {dataCategoria.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>

      <h2>Ventas por Ciudad</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataCiudad}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ciudad" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      {/* Tabla */}
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
                <th key={header.id} onClick={header.column.getToggleSortingHandler()} style={{ cursor: 'pointer' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === 'asc' ? ' 🔼' : header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
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
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>⬅️ Anterior</button>
        <span>Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}</span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Siguiente ➡️</button>
      </div>
    </div>
  );
}

export default App;
