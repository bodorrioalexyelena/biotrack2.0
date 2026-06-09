import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './styles.css'; // Vinculado correctamente a tu archivo de estilos

// 1. Registros de ejemplo iniciales
const registrosEjemplo = [
  { id: 1, fecha: '2026-05-15', parametro: 'Peso', valor: 76.2 },
  { id: 2, fecha: '2026-05-16', parametro: 'Peso', valor: 76.0 },
  { id: 3, fecha: '2026-05-17', parametro: 'Horas Sueño', valor: 7.5 },
  { id: 4, fecha: '2026-05-18', parametro: 'Peso', valor: 75.8 },
  { id: 5, fecha: '2026-05-19', parametro: 'Horas Sueño', valor: 8.0 },
  { id: 6, fecha: '2026-05-20', parametro: 'Peso', valor: 75.5 },
];

function App() {
  // 2. Estado: Inicializa buscando en el navegador; si no hay nada, usa los ejemplos
  const [registros, setRegistros] = useState(() => {
    const datosGuardados = localStorage.getItem('biotrack_data');
    return datosGuardados ? JSON.parse(datosGuardados) : registrosEjemplo;
  });

  // Estados para controlar lo que escribes en el formulario
  const [fecha, setFecha] = useState('');
  const [parametro, setParametro] = useState('Peso');
  const [valor, setValor] = useState('');

  // 3. Persistencia: Guarda automáticamente en el navegador al añadir o borrar
  useEffect(() => {
    localStorage.setItem('biotrack_data', JSON.stringify(registros));
  }, [registros]);

  // 4. Función para AÑADIR un nuevo registro
  const añadirRegistro = (e) => {
    e.preventDefault();
    if (fecha && parametro && valor && !isNaN(parseFloat(valor))) {
      const nuevoRegistro = {
        id: Date.now(), // Crea un ID único usando la hora exacta
        fecha: fecha,
        parametro: parametro,
        valor: parseFloat(valor),
      };
      setRegistros(prevRegistros => [...prevRegistros, nuevoRegistro]);
      setFecha(''); // Limpia el formulario
      setValor('');
    } else {
      alert("Por favor, rellena todos los campos con valores válidos.");
    }
  };

  // 5. Función MAESTRA para BORRAR un registro si te equivocas
  const borrarRegistro = (idParaBorrar) => {
    // Filtra la lista y conserva solo los que NO tengan el ID que queremos borrar
    const listaActualizada = registros.filter(registro => registro.id !== idParaBorrar);
    setRegistros(listaActualizada);
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>BioTrack - Panel de Seguimiento Biométrico</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        {/* Gráfico Dinámico */}
        <div style={{ flex: 1, height: '400px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
          <h2>Gráfico de Evolución (Peso)</h2>
          <ResponsiveContainer width="100%" height="90%">
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

        {/* Formulario de Entrada */}
        <div style={{ width: '300px', background: '#fefefe', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h2>Añadir Registro</h2>
          <form onSubmit={añadirRegistro}>
            <div style={{ marginBottom: '10px' }}>
              <label>Fecha:</label><br />
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Parámetro:</label><br />
              <select value={parametro} onChange={e => setParametro(e.target.value)} required>
                <option value="Peso">Peso (kg)</option>
                <option value="Horas Sueño">Horas de Sueño</option>
                <option value="Pasos">Pasos Diarios</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Valor:</label><br />
              <input type="number" step="0.1" value={valor} onChange={e => setValor(e.target.value)} required />
            </div>
            <button type="submit" style={{ width: '100%', padding: '8px', cursor: 'pointer' }}>Añadir</button>
          </form>
        </div>
      </div>

      {/* Historial con opción de eliminar en vivo */}
      <div style={{ background: '#fdfdfd', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h2>Historial de Registros (Haz clic en 🗑️ para eliminar)</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {registros.map((registro) => (
            <li key={registro.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <strong>{registro.fecha}</strong>: {registro.parametro} — {registro.valor}
              </div>
              
              {/* Botón de borrar */}
              <button
                onClick={() => borrarRegistro(registro.id)}
                style={{
                  padding: '5px 10px',
                  background: '#ff4d4d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Borrar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
