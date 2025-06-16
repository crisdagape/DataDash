import React from 'react';

const KPIs = ({ kpis }) => {
  return (
    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
      {Object.entries(kpis).map(([key, value]) => (
        <div key={key} style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
          <h3>{key}</h3>
          <p>{value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPIs;
