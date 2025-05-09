import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/data')
      .then(res => res.json())
      .then(data => setDatos(data));
  }, []);

  return (
    <div className="App">
      <h1>Dashboard de Datos Procesados</h1>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item, index) => (
            <tr key={index}>
              <td>{item.producto}</td>
              <td>{item.cantidad}</td>
              <td>{item.precio_unitario}</td>
              <td>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
