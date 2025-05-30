import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const API_EVENTOS_URL = "https://api-eventos-445r.onrender.com/api/eventos";

const EventosEmpresaPage = () => {
  const { user, token } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    direccion: "",
    tipo_evento: "",
    fecha_inicio: "",
    duracion_horas: 1,
    capacidad_maxima: 0,
    estado: "activo",
  });
  const [editingId, setEditingId] = useState(null);

  // Cargar eventos
  const fetchEventos = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_EVENTOS_URL}/listar-eventos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventos(res.data);
      setError("");
    } catch (e) {
      setError("Error cargando eventos");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      titulo: "",
      descripcion: "",
      direccion: "",
      tipo_evento: "",
      fecha_inicio: "",
      duracion_horas: 1,
      capacidad_maxima: 0,
      estado: "activo",
    });
    setEditingId(null);
    setError("");
  };

  const createEvento = async () => {
    try {
      const formWithEmpresa = { ...form, user_id: user.id };

      await axios.post(`${API_EVENTOS_URL}/crear-evento`, formWithEmpresa, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchEventos();
      resetForm();
    } catch (error) {
      const msg = error.response?.data?.error || "Error creando evento";
      setError(msg);
    }
  };

  // Actualizar evento
  const updateEvento = async () => {
    try {
      await axios.put(
        `${API_EVENTOS_URL}/actualizar-evento/${editingId}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchEventos();
      resetForm();
    } catch {
      setError("Error actualizando evento");
    }
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateEvento();
    } else {
      createEvento();
    }
  };

  // Editar evento
  const handleEdit = (evento) => {
    setForm({
      titulo: evento.titulo || "",
      descripcion: evento.descripcion || "",
      direccion: evento.direccion || "",
      tipo_evento: evento.tipo_evento || "",
      fecha_inicio: evento.fecha_inicio
        ? new Date(evento.fecha_inicio).toISOString().slice(0, 16)
        : "",
      duracion_horas: evento.duracion_horas || 1,
      capacidad_maxima: evento.capacidad_maxima || 0,
      estado: evento.estado || "activo",
    });
    setEditingId(evento.id);
  };

  // Eliminar evento
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este evento?")) return;
    try {
      await axios.delete(`${API_EVENTOS_URL}/eliminar-evento/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEventos();
    } catch {
      setError("Error eliminando evento");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-purple-700">
        Gestión de Eventos
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded shadow-lg max-w-3xl mx-auto"
      >
        <h3 className="text-xl mb-4">
          {editingId ? "Editar Evento" : "Crear Nuevo Evento"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            required
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="tipo_evento"
            placeholder="Tipo de evento"
            value={form.tipo_evento}
            onChange={handleChange}
            required
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="fecha_inicio"
            type="datetime-local"
            placeholder="Fecha de inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
            required
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="duracion_horas"
            type="number"
            min="1"
            placeholder="Duración (horas)"
            value={form.duracion_horas}
            onChange={handleChange}
            required
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
          />
          <input
            name="capacidad_maxima"
            type="number"
            min="0"
            placeholder="Capacidad máxima"
            value={form.capacidad_maxima}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
          />
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500"
          >
            <option value="activo">Activo</option>
            <option value="finalizado">Finalizado</option>
          </select>
          <input
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500 md:col-span-2"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500 md:col-span-2"
            rows={3}
          />
        </div>

        {error && (
          <p className="mt-4 text-red-600 font-semibold text-center">{error}</p>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
          >
            {editingId ? "Actualizar" : "Crear"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 border rounded hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-center text-gray-600 animate-pulse">
          Cargando eventos...
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="py-2 px-4">Título</th>
                <th className="py-2 px-4">Tipo</th>
                <th className="py-2 px-4">Fecha Inicio</th>
                <th className="py-2 px-4">Duración (hrs)</th>
                <th className="py-2 px-4">Capacidad</th>
                <th className="py-2 px-4">Estado</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr
                  key={evento.id}
                  className="border-b hover:bg-purple-50 transition"
                >
                  <td className="py-2 px-4">{evento.titulo}</td>
                  <td className="py-2 px-4">{evento.tipo_evento}</td>
                  <td className="py-2 px-4">
                    {new Date(evento.fecha_inicio).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{evento.duracion_horas}</td>
                  <td className="py-2 px-4">{evento.capacidad_maxima}</td>
                  <td className="py-2 px-4 capitalize">{evento.estado}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => handleEdit(evento)}
                      className="text-purple-600 hover:text-purple-900"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(evento.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {eventos.length === 0 && (
            <p className="text-center mt-4 text-gray-600">No hay eventos.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventosEmpresaPage;
