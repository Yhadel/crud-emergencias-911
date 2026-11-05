// Autor: Yhadel López - Matrícula: 20242493 (Registro 1 en el código)
import React, { useState, useEffect } from "react";
import { Trash2, Plus, ShieldAlert, FileText, Calendar, Camera, Edit3, X, Eye, Upload } from "lucide-react";

// Autor: Yhadel López - Matrícula: 20242493 (Registro 2 en el código)
const MISIONES_INICIALES = [
  { 
    id: 1, 
    title: "Atención de Incidente Vehicular", 
    date: "2026-10-24", 
    description: "Colisión leve entre dos vehículos en la Av. Principal. Sin heridos de gravedad. Se aseguró el perímetro.", 
    photo: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80" 
  },
  { 
    id: 2, 
    title: "Soporte de Emergencia Médica", 
    date: "2026-10-25", 
    description: "Asistencia a paciente adulto con dificultad respiratoria. Estabilizado en sitio y trasladado al hospital.", 
    photo: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80" 
  }
];

export default function App() {
  // Autor: Yhadel López - Matrícula: 20242493 (Registro 3 en el código)
  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem("emergencias_911");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    localStorage.setItem("emergencias_911", JSON.stringify(MISIONES_INICIALES));
    return MISIONES_INICIALES;
  });
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [selectedMission, setSelectedMission] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("emergencias_911", JSON.stringify(missions));
  }, [missions]);

  // Función para manejar la subida de archivos desde el almacenamiento interno
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Guarda la imagen convertida a Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !date || !description.trim()) return;

    if (editingId !== null) {
      setMissions(
        missions.map((m) =>
          m.id === editingId ? { ...m, title, date, description, photo: photo || m.photo } : m
        )
      );
      setEditingId(null);
    } else {
      const newMission = {
        id: Date.now(),
        title: title.trim(),
        date,
        description: description.trim(),
        photo: photo.trim() || "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80"
      };
      setMissions([newMission, ...missions]);
    }
    setTitle("");
    setDate("");
    setDescription("");
    setPhoto("");
  };

  const startEditing = (mission) => {
    setEditingId(mission.id);
    setTitle(mission.title);
    setDate(mission.date);
    setDescription(mission.description);
    setPhoto(mission.photo);
    setSelectedMission(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTitle("");
    setDate("");
    setDescription("");
    setPhoto("");
  };

  const deleteMission = (id) => {
    setMissions(missions.filter((m) => m.id !== id));
    if (editingId === id) cancelEditing();
    if (selectedMission?.id === id) setSelectedMission(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* HEADER INSTITUCIONAL 911 */}
      <header className="bg-red-700 text-white border-b border-red-800 px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white text-red-700 rounded-xl font-black text-xl shadow-inner">
              911
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Sistema de Registro de Emergencias</h1>
              <p className="text-xs text-red-100">Unidad de Operaciones y Campo • Yhadel López (20242493)</p>
            </div>
          </div>
          <span className="text-xs bg-red-800 text-white font-semibold px-3 py-1.5 rounded-full border border-red-600">
            Base Local Activa
          </span>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert size={18} className="text-red-600" />
                {editingId !== null ? "Actualizar Misión" : "Registrar Nueva Misión"}
              </h2>
              {editingId !== null && (
                <button onClick={cancelEditing} className="text-xs text-slate-500 hover:text-slate-700">
                  <X size={16} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Título del Evento</label>
                <input
                  type="text"
                  placeholder="Ej: Incendio estructural..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Fecha de la Misión</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Descripción de la Misión</label>
                <textarea
                  rows="3"
                  placeholder="Detalles de la asistencia prestada..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 text-sm resize-none"
                  required
                />
              </div>

              {/* SECCIÓN DE FOTO: SUBIR DESDE ALMACENAMIENTO O URL */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 block">Evidencia / Foto del Evento</label>
                
                {/* Selector de archivo interno */}
                <label className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-dashed border-slate-300 text-xs font-semibold cursor-pointer transition">
                  <Upload size={16} />
                  <span>Subir foto desde el dispositivo</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {/* Alternativa con URL */}
                <input
                  type="url"
                  placeholder="O pega una URL de imagen..."
                  value={photo.startsWith("data:") ? "" : photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 text-xs"
                />

                {photo && (
                  <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border border-slate-200">
                    <img src={photo} alt="Vista previa" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition text-sm text-white shadow-sm cursor-pointer ${
                  editingId !== null ? "bg-amber-600 hover:bg-amber-700" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {editingId !== null ? <Edit3 size={16} /> : <Plus size={16} />}
                <span>{editingId !== null ? "Actualizar Registro" : "Guardar Registro"}</span>
              </button>
            </form>
          </section>
        </div>

        {/* COLUMNA DERECHA: LISTADO Y DETALLES */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* LISTADO DE EVENTOS */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText size={16} className="text-red-600" />
              Misiones Registradas ({missions.length})
            </h3>

            {missions.length === 0 ? (
              <p className="text-slate-400 text-sm italic text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No hay misiones registradas en el sistema.
              </p>
            ) : (
              <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {missions.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200 hover:border-red-300 transition"
                  >
                    <div>
                      <span className="font-bold text-slate-800 text-sm block">{m.title}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} className="text-slate-400" /> {m.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedMission(m)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Eye size={14} /> Ver
                      </button>
                      <button
                        onClick={() => startEditing(m)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition cursor-pointer"
                        title="Editar"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteMission(m.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* VISOR DE DETALLES Y FOTO SELECCIONADA */}
          {selectedMission && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-red-200 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                  <Camera size={16} /> Detalles del Evento Seleccionado
                </h3>
                <button onClick={() => setSelectedMission(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">{selectedMission.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">Fecha: {selectedMission.date}</p>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {selectedMission.description}
                  </p>
                </div>
                <div>
                  <img
                    src={selectedMission.photo}
                    alt="Evidencia de misión"
                    className="w-full h-40 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                </div>
              </div>
            </section>
          )}

        </div>

      </main>

      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400">
        Sistema de Emergencias 911 • Desarrollado por Yhadel López (20242493)
      </footer>

    </div>
  );
}