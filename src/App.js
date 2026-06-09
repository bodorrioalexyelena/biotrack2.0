 import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Settings,
  Database,
  Scale,
  Calendar,
  Plus,
  Layers,
  Trash2,
} from "lucide-react";

// Data inicial por defecto (si la memoria local y la nube están vacías)
const DEFAULT_MOCK_DATA = [
  {
    fecha: "2026-01-10",
    peso: 81.5,
    imc: 25.1,
    grasa: 18.2,
    masaGrasa: 14.8,
    ffm: 66.7,
    visceral: 7,
    edadMet: 30,
    cintura: 86.0,
    abdominal: 91.0,
    cadera: 99.0,
    brazoRel: 36.5,
    brazoCon: 40.0,
    piernaIzq: 19.5,
    piernaDer: 19.4,
    brazoIzq: 16.0,
    brazoDer: 15.8,
    torso: 18.5,
  },
  {
    fecha: "2026-05-30",
    peso: 77.8,
    imc: 24.0,
    grasa: 15.1,
    masaGrasa: 11.7,
    ffm: 66.1,
    visceral: 5,
    edadMet: 25,
    cintura: 81.8,
    abdominal: 85.2,
    cadera: 95.1,
    brazoRel: 35.8,
    brazoCon: 39.4,
    piernaIzq: 17.2,
    piernaDer: 17.1,
    brazoIzq: 13.9,
    brazoDer: 13.8,
    torso: 15.2,
  },
];

// Estilos de diseño e interfaz profesional de alta densidad
const S = {
  app: {
    display: "flex",
    height: "100vh",
    background: "#090b0f",
    color: "#e2e8f0",
    fontFamily: "Inter, system-ui, sans-serif",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topbar: {
    padding: "18px 30px",
    borderBottom: "1px solid #171e2e",
    background: "#0f131f",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#f8fafc",
    letterSpacing: "-0.5px",
  },
  sub: { fontSize: "12px", color: "#64748b", marginTop: "2px" },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 30px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  card: {
    background: "#0f131f",
    border: "1px solid #171e2e",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #171e2e",
    paddingBottom: "12px",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  formGroup: { display: "flex", flexDirection: "column", gap: "6px", flex: 1 },
  label: {
    fontSize: "11px",
    color: "#94a3b8",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    background: "#090b0f",
    border: "1px solid #222c40",
    borderRadius: "8px",
    padding: "9px 12px",
    color: "#f1f5f9",
    fontSize: "13px",
    outline: "none",
    width: "100%",
  },
  btnPrimary: {
    background: "#1e3a8a",
    color: "#60a5fa",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  btnSecondary: {
    background: "#131a2c",
    color: "#94a3b8",
    border: "1px solid #222c40",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  btnDelete: {
    background: "#1c1212",
    color: "#f87171",
    border: "1px solid #7f1d1d",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "background 0.2s",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "12px",
  },
  kpiItem: {
    background: "#090b0f",
    border: "1px solid #171e2e",
    borderRadius: "10px",
    padding: "14px 12px",
  },
  kpiVal: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#f8fafc",
    marginTop: "4px",
  },
  kpiUnit: { fontSize: "11px", color: "#475569", marginLeft: "2px" },
  kpiSub: { fontSize: "10px", color: "#64748b", marginTop: "2px" },
};

export default function BioTrackCuerpo() {
  // 1. GESTIÓN DE MEMORIA INTEGRADA (LOCALSTORAGE)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("biotrack_history");
    return saved ? JSON.parse(saved) : DEFAULT_MOCK_DATA;
  });

  const [sheetUrl, setSheetUrl] = useState(() => {
    return localStorage.getItem("biotrack_sheet_url") || "";
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // 'loading' | 'success' | 'error'

  // Estados de inputs manuales locales
  const [inputDate, setInputDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [inputWeight, setInputWeight] = useState("");
  const [editKpiMode, setEditKpiMode] = useState(false);
  const [kpiFormValues, setKpiFormValues] = useState({});

  const currentRecord = useMemo(
    () => history[activeIndex] || history[history.length - 1] || {},
    [history, activeIndex]
  );

  // Sincronizar el subformulario cuando cambie de fila seleccionada
  useEffect(() => {
    if (currentRecord && Object.keys(currentRecord).length > 0) {
      setKpiFormValues({ ...currentRecord });
    }
  }, [currentRecord]);

  // Escucha de cambios para auto-guardar en local storage
  useEffect(() => {
    localStorage.setItem("biotrack_history", JSON.stringify(history));
    if (activeIndex >= history.length) {
      setActiveIndex(Math.max(0, history.length - 1));
    }
  }, [history, activeIndex]);

  useEffect(() => {
    localStorage.setItem("biotrack_sheet_url", sheetUrl);
  }, [sheetUrl]);

  // Intentar sincronizar la nube de Google al arrancar la aplicación
  useEffect(() => {
    if (sheetUrl) {
      fetchGoogleSheetsData(sheetUrl);
    }
  }, []);

  // Función Quirúrgica: Eliminar el registro que se está visualizando actualmente
  const handleBorrarRegistroActivo = () => {
    if (history.length <= 1) {
      alert("No puedes eliminar todos los registros. Debe quedar al menos uno.");
      return;
    }

    const confirmacion = window.confirm(
      `¿Seguro que deseas eliminar permanentemente el registro del día ${currentRecord.fecha}?`
    );

    if (confirmacion) {
      const nuevoHistorial = history.filter((_, idx) => idx !== activeIndex);
      setHistory(nuevoHistorial);
      // Reposicionar el índice activo de forma segura
      setActiveIndex(Math.max(0, activeIndex - 1));
    }
  };

  // 2. DETECTOR Y PROCESADOR DE GOOGLE SHEETS EN ESPAÑOL/EUROPA (PARSER RESILIENTE)
  const fetchGoogleSheetsData = async (targetUrl) => {
    if (!targetUrl) return;
    setSyncStatus("loading");
    try {
      let formattedUrl = targetUrl.trim();
      if (formattedUrl.includes("/edit")) {
        formattedUrl = formattedUrl.replace(/\/edit.*$/, "/export?format=csv");
      } else if (
        !formattedUrl.includes("output=csv") &&
        formattedUrl.includes("pub?")
      ) {
        formattedUrl = formattedUrl + "&output=csv";
      }

      const response = await fetch(formattedUrl);
      if (!response.ok) throw new Error("Error de red o enlace privado");
      const text = await response.text();

      const lines = text.trim().split(/\r?\n/);
      if (lines.length < 2) throw new Error("Documento vacío o sin formato");

      const firstLine = lines[0];
      const separator = firstLine.includes(";") ? ";" : ",";

      const headers = firstLine
        .split(separator)
        .map((h) => h.trim().replace(/['"]+/g, "").toLowerCase());
      const parsedRecords = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i]
          .split(separator)
          .map((v) => v.trim().replace(/['"]+/g, ""));
        const obj = {};

        headers.forEach((h, idx) => {
          let val = values[idx];
          if (h === "fecha") {
            obj[h] = val;
          } else if (val) {
            if (separator === ";") {
              val = val.replace(",", ".");
            }
            obj[h] = parseFloat(val) || 0;
          } else {
            obj[h] = 0;
          }
        });

        if (obj.fecha && obj.peso) {
          parsedRecords.push({
            fecha: obj.fecha,
            peso: obj.peso,
            imc: obj.imc || +(obj.peso / 3.24).toFixed(1),
            grasa: obj.grasa || 15,
            masaGrasa:
              obj.masaGrasa ||
              +(obj.peso * ((obj.grasa || 15) / 100)).toFixed(1),
            ffm:
              obj.ffm ||
              +(obj.peso - obj.peso * ((obj.grasa || 15) / 100)).toFixed(1),
            visceral: obj.visceral || 5,
            edadMet: obj.edadMet || 25,
            cintura: obj.cintura || 80,
            abdominal: obj.abdominal || 85,
            cadera: obj.cadera || 95,
            brazoRel: obj.brazoRel || 35,
            brazoCon: obj.brazoCon || 39,
            piernaIzq: obj.piernaIzq || 17,
            piernaDer: obj.piernaDer || 17,
            brazoIzq: obj.brazoIzq || 13,
            brazoDer: obj.brazoDer || 13,
            torso: obj.torso || 15,
          });
        }
      }

      if (parsedRecords.length === 0)
        throw new Error("No se encontraron filas estructuradas");

      const sortedData = parsedRecords.sort(
        (a, b) => new Date(a.fecha) - new Date(b.fecha)
      );
      setHistory(sortedData);
      setActiveIndex(sortedData.length - 1);
      setSyncStatus("success");
    } catch (err) {
      console.error("Detalle técnico del error:", err);
      setSyncStatus("error");
    }
  };

  const getFatRange = (grasa) => {
    if (grasa < 10) return "Atleta Superior";
    if (grasa < 14) return "Fitness Óptimo";
    if (grasa < 18) return "Saludable";
    return "Elevado";
  };

  const handleAddWeightPoint = () => {
    if (!inputWeight || isNaN(parseFloat(inputWeight))) return;
    const newWeight = parseFloat(inputWeight);
    const base = currentRecord;
    const computedImc = +(newWeight / 3.24).toFixed(1);
    const computedMasaGrasa = +(newWeight * ((base.grasa || 15) / 100)).toFixed(
      1
    );
    const computedFfm = +(newWeight - computedMasaGrasa).toFixed(1);

    const newRecord = {
      ...base,
      fecha: inputDate,
      peso: newWeight,
      imc: computedImc,
      masaGrasa: computedMasaGrasa,
      ffm: computedFfm,
    };

    const updatedHistory = [...history, newRecord].sort(
      (a, b) => new Date(a.fecha) - new Date(b.fecha)
    );
    setHistory(updatedHistory);
    setActiveIndex(updatedHistory.findIndex((r) => r.fecha === inputDate));
    setInputWeight("");
  };

  const handleSelectRecord = (index) => {
    if (index >= 0 && index < history.length) {
      setActiveIndex(index);
    }
  };

  const chartDataWithTrend = useMemo(() => {
    return history.map((item, idx) => {
      if (idx < 2) return { ...item, tendencia: item.peso };
      const smoothTrend = +(
        (item.peso + history[idx - 1].peso + history[idx - 2].peso) /
        3
      ).toFixed(2);
      return { ...item, tendencia: smoothTrend };
    });
  }, [history]);

  const handleUpdateAdvancedMetrics = (e) => {
    e.preventDefault();
    const updated = {
      ...currentRecord,
      imc: parseFloat(kpiFormValues.imc) || currentRecord.imc,
      grasa: parseFloat(kpiFormValues.grasa) || currentRecord.grasa,
      visceral: parseInt(kpiFormValues.visceral) || currentRecord.visceral,
      edadMet: parseInt(kpiFormValues.edadMet) || currentRecord.edadMet,
    };
    const nextHistory = [...history];
    nextHistory[activeIndex] = updated;
    setHistory(nextHistory);
    setEditKpiMode(false);
  };

  const formatXAxisDate = (str) => {
    if (!str) return "";
    const parts = str.split("-");
    if (parts.length < 3) return str;
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return `${parseInt(parts[2])} ${months[parseInt(parts[1]) - 1]}`;
  };

  return (
    <div style={S.app}>
      {/* Inyección nativa de la animación CSS de rotación */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .spin-animation { animation: spin 2s linear infinite; }
      `}</style>

      <div style={S.main}>
        {/* TOPBAR GLOBAL CON SENSADO EN TIEMPO REAL */}
        <div style={S.topbar}>
          <div>
            <div style={S.title}>
              BioTrack Pro — Centro de Control de Composición Corporal
            </div>
            <div style={S.sub}>
              Motor híbrido de persistencia: Nube síncrona de Drive y
              Almacenamiento Local Seguro
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {syncStatus === "loading" && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#60a5fa",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <RefreshCw size={13} className="spin-animation" /> Analizando
                Sheets...
              </span>
            )}
            {syncStatus === "success" && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#34d399",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <CheckCircle2 size={13} /> Cloud Sheets Activo
              </span>
            )}
            {syncStatus === "error" && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#f87171",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <AlertCircle size={13} /> Error de Enlace
              </span>
            )}

            <button
              onClick={() => setShowConfig(!showConfig)}
              style={S.btnSecondary}
            >
              <Settings size={14} />{" "}
              {showConfig ? "Ocultar Ajustes" : "Vincular Google Sheet"}
            </button>
          </div>
        </div>

        <div style={S.content}>
          {/* PANEL DE CONFIGURACIÓN DEL ORIGEN DE DATOS */}
          {showConfig && (
            <div
              style={{
                ...S.card,
                borderColor: "#2563eb",
                background: "#0c1524",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Database size={16} color="#60a5fa" /> Configuración de la Base
                de Datos Externa
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                Introduce abajo la URL de tu hoja de cálculo publicada en
                formato **CSV**. La aplicación auto-detectará si tu Excel está
                configurado en España y adaptará la separación de celdas
                automáticamente.
              </p>
              <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  style={S.input}
                />
                <button
                  onClick={() => fetchGoogleSheetsData(sheetUrl)}
                  style={S.btnPrimary}
                >
                  Sincronizar Canal
                </button>
              </div>
            </div>
          )}

          {/* 1. SECCIÓN CRONOLÓGICA DE PESO */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <div style={S.cardTitle}>
                <Scale size={16} color="#3b82f6" /> 1. Control Cronológico de
                Peso y Línea de Tendencia Macroscópica (Haz clic en los puntos del gráfico para alternar de día)
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "240px 1fr",
                gap: "24px",
              }}
            >
              <div
                style={{
                  background: "#090b0f",
                  padding: "16px",
                  borderRadius: "10px",
                  border: "1px solid #171e2e",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Calendar size={13} /> Registro Rápido Local
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Fecha de Medición</label>
                  <input
                    type="date"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    style={S.input}
                  />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Masa (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej: 77.8"
                    value={inputWeight}
                    onChange={(e) => setInputWeight(e.target.value)}
                    style={S.input}
                  />
                </div>
                <button
                  onClick={handleAddWeightPoint}
                  style={{ ...S.btnPrimary, justifyContent: "center" }}
                >
                  <Plus size={14} /> Insertar Hito
                </button>
              </div>
              <div style={{ flex: 1, minHeight: "180px" }}>
                <ResponsiveContainer width="100%" height={210}>
                  <LineChart
                    data={chartDataWithTrend}
                    onClick={(data) =>
                      data &&
                      data.activeStartIndex !== undefined &&
                      handleSelectRecord(data.activeStartIndex)
                    }
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,.03)"
                    />
                    <XAxis
                      dataKey="fecha"
                      tickFormatter={formatXAxisDate}
                      tick={{ fill: "#475569", fontSize: 11 }}
                    />
                    <YAxis
                      domain={["auto - 1", "auto + 1"]}
                      tick={{ fill: "#475569", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f131f",
                        borderColor: "#171e2e",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Line
                      type="linear"
                      dataKey="peso"
                      name="Peso Real"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tendencia"
                      name="Tendencia Suavizada"
                      stroke="#34d399"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 2. PANEL COMPOSICIÓN TISULAR */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <div style={S.cardTitle}>
                <Layers size={16} color="#a78bfa" /> 2. Índices de Composición
                Tisular ({currentRecord.fecha || "Sin fecha"})
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {/* BOTÓN DE BORRADO REGISTRO ACTIVO */}
                <button
                  onClick={handleBorrarRegistroActivo}
                  style={S.btnDelete}
                  title="Eliminar este registro permanentemente"
                >
                  <Trash2 size={13} /> Borrar Día
                </button>
                <button
                  onClick={() => setEditKpiMode(!editKpiMode)}
                  style={S.btnSecondary}
                >
                  {editKpiMode ? "Volver" : "Editar Fila Activa"}
                </button>
              </div>
            </div>
            {!editKpiMode ? (
              <div style={S.kpiGrid}>
                {[
                  {
                    id: "imc",
                    name: "IMC",
                    val: currentRecord.imc || 0,
                    unit: "",
                    sub: "Estructura IMC",
                  },
                  {
                    id: "grasa",
                    name: "Grasa Corporal",
                    val: currentRecord.grasa || 0,
                    unit: "%",
                    sub: getFatRange(currentRecord.grasa || 0),
                  },
                  {
                    id: "masaGrasa",
                    name: "Masa Grasa",
                    val: currentRecord.masaGrasa || 0,
                    unit: "kg",
                    sub: "Tejido Adiposo",
                  },
                  {
                    id: "ffm",
                    name: "Masa Libre de Grasa",
                    val: currentRecord.ffm || 0,
                    unit: "kg",
                    sub: "Masa Magra",
                  },
                  {
                    id: "visceral",
                    name: "Grasa Visceral",
                    val: currentRecord.visceral || 0,
                    unit: "lvl",
                    sub: "Área Core",
                  },
                  {
                    id: "edadMet",
                    name: "Edad Metabólica",
                    val: currentRecord.edadMet || 0,
                    unit: "años",
                    sub: "Biomarcador",
                  },
                ].map((kpi) => (
                  <div key={kpi.id} style={S.kpiItem}>
                    <div style={S.label}>{kpi.name}</div>
                    <div style={S.kpiVal}>
                      {kpi.val}
                      <span style={S.kpiUnit}>{kpi.unit}</span>
                    </div>
                    <div style={S.kpiSub}>{kpi.sub}</div>
                  </div>
                ))}
              </div>
            ) : (
              <form
                onSubmit={handleUpdateAdvancedMetrics}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  background: "#090b0f",
                  padding: "14px",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  {["imc", "grasa", "visceral", "edadMet"].map((field) => (
                    <div key={field} style={S.formGroup}>
                      <label style={S.label}>{field}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={kpiFormValues[field] || ""}
                        onChange={(e) =>
                          setKpiFormValues({
                            ...kpiFormValues,
                            [field]: e.target.value,
                          })
                        }
                        style={S.input}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  style={{ ...S.btnPrimary, alignSelf: "flex-end" }}
                >
                  Guardar Cambios Fila
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
