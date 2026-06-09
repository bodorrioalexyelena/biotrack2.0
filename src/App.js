import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './styles.css'; // Volvemos a vincular tu archivo de estilos original

// Registros de ejemplo iniciales
const registrosEjemplo = [
  { id: 1, fecha: '2026-05-15', parametro: 'Peso', valor: 76.2 },
  { id: 2, fecha: '2026-05-16', parametro: 'Peso', valor: 76.0 },
  { id: 3, fecha: '2026-05-17', parametro: 'Horas Sueño', valor: 7.5 },
  { id: 4, fecha: '2026-05-18', parametro: 'Peso', valor: 75.8 },
  { id: 5, fecha: '2026-05-19', parametro: 'Horas Sueño', valor: 8.0 },
  { id: 6, fecha: '2026-05-20', parametro: 'Peso', valor: 75.5 },
];

function App() {
  // LÓGICA DE DATOS (Mantenemos la funcionalidad que querías)
  const [registros, setRegistros] = useState(() => {
    const datosGuardados = localStorage.getItem('biotrack_data');
    return datosGuardados ? JSON.parse(datosGuardados) : registrosEjemplo;
  });

  const [fecha, setFecha] = useState('');
  const [parametro, setParametro] = useState('Peso');
  const [valor, setValor] = useState('');

  useEffect(() => {
    localStorage.setItem('biotrack_data', JSON.stringify(registros));
  }, [registros]);

  const añadirRegistro = (e) => {
    e.preventDefault();
    if (fecha && parametro && valor && !isNaN(parseFloat(valor))) {
      const nuevoRegistro = {
        id: Date.now(), 
        fecha: fecha,
        parametro: parametro,
        valor: parseFloat(valor),
      };
      setRegistros(prevRegistros => [...prevRegistros, nuevoRegistro]);
      setFecha(''); 
      setValor('');
    } else {
      alert("Por favor, rellena todos los campos.");
    }
  };

  const borrarRegistro = (idParaBorrar) => {
    const listaActualizada = registros.filter(registro => registro.id !== idParaBorrar);
    setRegistros(listaActualizada);
  };

  // DISEÑO VISUAL (Restaurado para usar las clases de tu styles.css)
  return (
    <div className="App"> {/* Usamos tus clases CSS originales */}
      <h1>BioTrack</h1>

      <div className="container"> {/* Volvemos a usar tu estructura de contenedores CSS */}
        
        {/* Sección del Gráfico */}
        <div className="chart-section">
          <h2>Evolución (Peso)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={registros.filter(r => r.parametro === 'Peso').sort((a,b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="valor" stackId="1" stroke="#8884d8" fill="#8884d8" name="Peso (kg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sección del Formulario */}
        <div className="form-section">
          <h2>Nuevo Dato</h2>
          <form onSubmit={añadirRegistro}>
            <div className="input-group">
              <label>Fecha</label>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Métrica</label>
              <select value={parametro} onChange={e => setParametro(e.target.value)} required>
                <option value="Peso">Peso (kg)</option>
                <option value="Horas Sueño">Horas de Sueño</option>
                <option value="Pasos">Pasos Diarios</option>
              </select>
            </div>
            <div className="input-group">
              <label>Valor</label>
              <input type="number" step="0.1" value={valor} onChange={e => setValor(e.target.value)} required />
            </div>
            <button type="submit" className="btn-add">Añadir</button>
          </form>
        </div>
      </div>

      {/* Sección del Historial con botones de borrado */}
      <div className="history-section">
        <h2>Registros Guardados</h2>
        <ul className="history-list">
          {registros.map((registro) => (
            <li key={registro.id} className="history-item">
              <span><strong>{registro.fecha}</strong>: {registro.parametro} — {registro.valor}</span>
              
              {/* Le ponemos una clase CSS al botón para que lo puedas estilizar */}
              <button
                onClick={() => borrarRegistro(registro.id)}
                className="btn-delete"
                title="Borrar registro"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
