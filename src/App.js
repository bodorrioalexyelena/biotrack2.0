// BioTrack Pro — Edición Persistente con Sincronización Avanzada Google Sheets
// Soporta formatos regionales de España/Europa automáticamente (Separador ';' y decimales con ',')
// Stack: React + Recharts + Lucide React

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Scale,
  Ruler,
  Plus,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
  Settings,
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
  layoutGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
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
  anthroLayout: {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    gap: "24px",
    alignItems: "center",
  },
  silhouetteContainer: {
    position: "relative",
    width: "160px",
    height: "310px",
    background: "#090b0f",
    borderRadius: "12px",
    border: "1px solid #171e2e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  hotspot: (active) => ({
    position: "absolute",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: active ? "#3b82f6" : "#475569",
    border: "2px solid #090b0f",
    cursor: "pointer",
    transform: "translate(-50%, -50%)",
    transition: "all 0.2s",
    boxShadow: active ? "0 0 8px #3b82f6" : "none",
  }),
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
  const [activeZone, setActiveZone] = useState("abdominal");
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
  }, [history]);

  useEffect(() => {
    localStorage.setItem("biotrack_sheet_url", sheetUrl);
  }, [sheetUrl]);

  // Intentar sincronizar la nube de Google al arrancar la aplicación
  useEffect(() => {
    if (sheetUrl) {
      fetchGoogleSheetsData(sheetUrl);
    }
  }, []);

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

      // AUTO-DETECCIÓN DE SEPARADOR REGIONAL: Compara si tu Excel exporta con ';' o ','
      const firstLine = lines[0];
      const separator = firstLine.includes(";") ? ";" : ",";

      // Normalizar las cabeceras pasándolas a minúsculas
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
            obj[h] = val; // Mantener la fecha intacta
          } else if (val) {
            // Si el separador es europeo ';', reemplaza comas por puntos en los números (ej: 77,8 -> 77.8)
            if (separator === ";") {
              val = val.replace(",", ".");
            }
            obj[h] = parseFloat(val) || 0;
          } else {
            obj[h] = 0;
          }
        });

        // Solo procesar la fila si contiene datos indispensables como fecha y peso
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

  const handleAnthroChange = (zone, value) => {
    const val = parseFloat(value) || 0;
    const nextHistory = [...history];
    nextHistory[activeIndex] = { ...currentRecord, [zone]: val };
    setHistory(nextHistory);
  };

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

  const segmentChartData = useMemo(() => {
    const r = currentRecord;
    return [
      {
        name: "Torso",
        Porcentaje: r.torso || 0,
        Masa: +((r.peso || 0) * ((r.torso || 0) / 100)).toFixed(1),
      },
      {
        name: "Brazo Izq.",
        Porcentaje: r.brazoIzq || 0,
        Masa: +((r.peso || 0) * ((r.brazoIzq || 0) / 100)).toFixed(1),
      },
      {
        name: "Brazo Der.",
        Porcentaje: r.brazoDer || 0,
        Masa: +((r.peso || 0) * ((r.brazoDer || 0) / 100)).toFixed(1),
      },
      {
        name: "Pierna Izq.",
        Porcentaje: r.piernaIzq || 0,
        Masa: +((r.peso || 0) * ((r.piernaIzq || 0) / 100)).toFixed(1),
      },
      {
        name: "Pierna Der.",
        Porcentaje: r.piernaDer || 0,
        Masa: +((r.peso || 0) * ((r.piernaDer || 0) / 100)).toFixed(1),
      },
    ];
  }, [currentRecord]);

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
                Peso y Línea de Tendencia Macroscópica
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

          <div style={S.layoutGrid}>
            {/* 2. PANEL COMPOSICIÓN TISULAR */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={S.cardTitle}>
                  <Layers size={16} color="#a78bfa" /> 2. Índices de Composición
                  Tisular y Compartimentos
                </div>
                <button
                  onClick={() => setEditKpiMode(!editKpiMode)}
                  style={S.btnSecondary}
                >
                  {editKpiMode ? "Volver" : "Editar Fila Activa"}
                </button>
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

            {/* 3. DIAGRAMA ANTROPOMÉTRICO */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={S.cardTitle}>
                  <Ruler size={16} color="#fbbf24" /> 3. Mapeo Perimetral
                  Localizado y Segmentación de Grasa
                </div>
              </div>
              <div style={S.anthroLayout}>
                <div style={S.silhouetteContainer}>
                  <svg
                    width="110"
                    height="280"
                    viewBox="0 0 100 240"
                    style={{ opacity: 0.25 }}
                  >
                    <circle cx="50" cy="22" r="14" fill="#64748b" />
                    <path
                      d="M35,40 L65,40 L70,110 L64,110 L60,230 L40,230 L36,110 L30,110 Z"
                      fill="#64748b"
                    />
                  </svg>
                  <div
                    style={{
                      ...S.hotspot(activeZone === "brazoRel"),
                      top: "22%",
                      left: "20%",
                    }}
                    onClick={() => setActiveZone("brazoRel")}
                  />
                  <div
                    style={{
                      ...S.hotspot(activeZone === "cintura"),
                      top: "36%",
                      left: "50%",
                    }}
                    onClick={() => setActiveZone("cintura")}
                  />
                  <div
                    style={{
                      ...S.hotspot(activeZone === "abdominal"),
                      top: "43%",
                      left: "50%",
                    }}
                    onClick={() => setActiveZone("abdominal")}
                  />
                  <div
                    style={{
                      ...S.hotspot(activeZone === "cadera"),
                      top: "52%",
                      left: "50%",
                    }}
                    onClick={() => setActiveZone("cadera")}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    }}
                  >
                    {[
                      "cintura",
                      "abdominal",
                      "cadera",
                      "brazoRel",
                      "brazoCon",
                    ].map((zone) => (
                      <div
                        key={zone}
                        style={{
                          background:
                            activeZone === zone ? "#131c31" : "#090b0f",
                          border:
                            activeZone === zone
                              ? "1px solid #3b82f6"
                              : "1px solid #171e2e",
                          padding: "8px 10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                        onClick={() => setActiveZone(zone)}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            color: activeZone === zone ? "#60a5fa" : "#64748b",
                          }}
                        >
                          {zone.toUpperCase()}
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          value={currentRecord[zone] || 0}
                          onChange={(e) =>
                            handleAnthroChange(zone, e.target.value)
                          }
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#f1f5f9",
                            fontSize: "14px",
                            fontWeight: 700,
                            width: "100%",
                            outline: "none",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={115}>
                    <BarChart
                      data={segmentChartData}
                      layout="vertical"
                      margin={{ left: -20 }}
                    >
                      <XAxis
                        type="number"
                        tick={{ fill: "#475569", fontSize: 9 }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="Porcentaje"
                        fill="#3b82f6"
                        radius={[0, 4, 4, 0]}
                        barSize={8}
                        name="% Grasa"
                      />
                      <Bar
                        dataKey="Masa"
                        fill="#f43f5e"
                        radius={[0, 4, 4, 0]}
                        barSize={8}
                        name="Masa (kg)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
