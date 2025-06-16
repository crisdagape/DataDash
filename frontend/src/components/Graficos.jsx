import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Graficos = ({ data }) => {
  return (
    <>
      <h2>Ventas por Día</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.dataGrafico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Ventas Acumuladas</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data.dataVentasAcumuladas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalAcumulado" stroke="#ff7300" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>

      <h2>Ventas por Categoría</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={data.dataCategoria}
          cx="50%"
          cy="50%"
          label
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.dataCategoria.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>

      <h2>Ventas por Ciudad</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.dataCiudad}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ciudad" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default Graficos;
