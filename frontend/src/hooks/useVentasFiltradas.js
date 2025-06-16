function useVentasFiltradas(ventas, ciudadFiltro, categoriaFiltro, fechaInicio, fechaFin) {
    const ventasFiltradas = ventas.filter((v) => {
      const ciudadMatch = ciudadFiltro === "Todas" || v.ciudad === ciudadFiltro;
      const categoriaMatch = categoriaFiltro === "Todas" || v.categoria === categoriaFiltro;
      const fechaMatch =
        (!fechaInicio || v.fecha >= fechaInicio) &&
        (!fechaFin || v.fecha <= fechaFin);
      return ciudadMatch && categoriaMatch && fechaMatch;
    });
  
    const ciudades = ["Todas", ...new Set(ventas.map((v) => v.ciudad))];
    const categorias = ["Todas", ...new Set(ventas.map((v) => v.categoria))];
  
    const totalVentas = ventasFiltradas.reduce((acc, v) => acc + Number(v.total_venta), 0);
    const totalProductos = ventasFiltradas.reduce((acc, v) => acc + Number(v.cantidad), 0);
    const clientesUnicos = new Set(ventasFiltradas.map((v) => v.cliente)).size;
    const ciudadesUnicas = new Set(ventasFiltradas.map((v) => v.ciudad)).size;
  
    const ventasOrdenadas = [...ventasFiltradas].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  
    let acumulado = 0;
    const dataVentasAcumuladas = ventasOrdenadas.map((v) => {
      acumulado += Number(v.total_venta);
      return {
        fecha: v.fecha,
        totalAcumulado: acumulado,
      };
    });
  
    const ventasPorFecha = ventasFiltradas.reduce((acc, venta) => {
      if (!acc[venta.fecha]) acc[venta.fecha] = 0;
      acc[venta.fecha] += Number(venta.total_venta);
      return acc;
    }, {});
  
    const dataGrafico = Object.entries(ventasPorFecha).map(([fecha, total]) => ({ fecha, total }));
  
    const ventasPorCategoria = ventasFiltradas.reduce((acc, venta) => {
      if (!acc[venta.categoria]) acc[venta.categoria] = 0;
      acc[venta.categoria] += Number(venta.total_venta);
      return acc;
    }, {});
    const dataCategoria = Object.entries(ventasPorCategoria).map(([name, value]) => ({ name, value }));
  
    const ventasPorCiudad = ventasFiltradas.reduce((acc, venta) => {
      if (!acc[venta.ciudad]) acc[venta.ciudad] = 0;
      acc[venta.ciudad] += Number(venta.total_venta);
      return acc;
    }, {});
    const dataCiudad = Object.entries(ventasPorCiudad).map(([ciudad, total]) => ({ ciudad, total }));
  
    return {
      ventasFiltradas,
      ciudades,
      categorias,
      KPIs: {
        'Total Ventas': `S/ ${totalVentas.toLocaleString()}`,
        'Productos Vendidos': totalProductos,
        'Clientes': clientesUnicos,
        'Ciudades': ciudadesUnicas,
      },
      graficos: {
        dataGrafico,
        dataVentasAcumuladas,
        dataCategoria,
        dataCiudad
      }
    };
  }
  
  export default useVentasFiltradas;
  