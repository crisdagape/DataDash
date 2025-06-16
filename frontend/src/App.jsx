// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAutenticado(true);
  }, []);

  return autenticado ? (
    <Dashboard />
  ) : (
    <Login onLogin={() => setAutenticado(true)} />
  );
}

export default App;