import React from 'react';

const Filtros = ({
  ciudadFiltro,
  setCiudadFiltro,
  categoriaFiltro,
  setCategoriaFiltro,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  ciudades,
  categorias
}) => {
  return (
    <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
      <label>
        Filtrar por ciudad:{" "}
        <select value={ciudadFiltro} onChange={(e) => setCiudadFiltro(e.target.value)}>
          {ciudades.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Filtrar por categoría:{" "}
        <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Fecha desde:{" "}
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
      </label>
      <br />
      <label>
        Fecha hasta:{" "}
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
      </label>
    </div>
  );
};

export default Filtros;
