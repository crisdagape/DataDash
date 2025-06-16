import React, { useEffect, useState } from 'react';
import Filtros from './components/Filtros';
import KPIs from './components/KPIs';
import Graficos from './components/Graficos';
import TablaVentas from './components/TablaVentas';
import useVentasFiltradas from './hooks/useVentasFiltradas';

function App() {
  const [ventas, setVentas] = useState([]);
  const [ciudadFiltro, setCiudadFiltro] = useState("Todas");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtroGlobal, setFiltroGlobal] = useState("");

  useEffect(() => {
    fetch('http://localhost:3001/api/data')
      .then((res) => res.json())
      .then((data) => setVentas(data))
      .catch((err) => console.error('Error al obtener datos:', err));
  }, []);

  const {
    ventasFiltradas,
    ciudades,
    categorias,
    KPIs: kpis,
    graficos,
  } = useVentasFiltradas(ventas, ciudadFiltro, categoriaFiltro, fechaInicio, fechaFin);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard de Ventas</h1>
      <Filtros
        ciudadFiltro={ciudadFiltro}
        setCiudadFiltro={setCiudadFiltro}
        categoriaFiltro={categoriaFiltro}
        setCategoriaFiltro={setCategoriaFiltro}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
        ciudades={ciudades}
        categorias={categorias}
      />
      <KPIs kpis={kpis} />
      <Graficos data={graficos} />
      <TablaVentas
        ventasFiltradas={ventasFiltradas}
        filtroGlobal={filtroGlobal}
        setFiltroGlobal={setFiltroGlobal}
      />
    </div>
  );
}

export default App;
