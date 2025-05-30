import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const API_EVENTO_URL = "http://localhost:3000/api/eventos";
const API_REGISTER_URL = "http://localhost:3000/api/registro-evento";

const RegistrarEventoPage = () => {
  const { token, user } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [selectedEventoId, setSelectedEventoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Cargar eventos activos
  const fetchEventos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_EVENTO_URL}/listar-eventos`);
      const eventosDisponibles = res.data.filter(
        (ev) =>
          ev.estado === "activo" &&
          (ev.capacidad_maxima === 0 || ev.capacidad_maxima > 0)
      );
      setEventos(eventosDisponibles);
      setError("");
    } catch {
      setError("Error cargando eventos");
      setEventos([]); // Aseguramos que la lista no desaparezca
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!selectedEventoId) {
      setError("Por favor selecciona un evento.");
      return;
    }
    setSubmitLoading(true);

    try {
      await axios.post(
        `${API_REGISTER_URL}/registrar-evento`,
        {
          user_id: user.id,
          evento_id: selectedEventoId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMsg("Inscripción realizada con éxito.");
      setSelectedEventoId("");
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.includes("Ya estás registrado")
      ) {
        setError("Ya estás inscrito en este evento.");
      } else {
        setError("Error al registrar inscripción.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">
          Registrar a Evento
        </h2>
        <button
          onClick={fetchEventos}
          title="Recargar eventos"
          className="p-2 rounded hover:bg-indigo-100 transition"
        >
          {/* Ícono de recarga SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582M20 20v-5h-.581M4.22 10.22a8 8 0 0113.56-3.42M19.78 13.78a8 8 0 01-13.56 3.42"
            />
          </svg>
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 animate-pulse">
          Cargando eventos...
        </p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mb-4">
            <select
              value={selectedEventoId}
              onChange={(e) => setSelectedEventoId(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 mb-4"
              required
            >
              <option value="">-- Selecciona un evento --</option>
              {eventos.map((evento) => (
                <option key={evento.id} value={evento.id}>
                  {evento.titulo} -{" "}
                  {new Date(evento.fecha_inicio).toLocaleDateString()}
                </option>
              ))}
            </select>

            {successMsg && (
              <p className="mb-4 text-green-600 font-semibold text-center">
                {successMsg}
              </p>
            )}
            {error && (
              <p className="mb-4 text-red-600 font-semibold text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitLoading}
              className={`w-full py-2 rounded text-white font-semibold ${
                submitLoading
                  ? "bg-indigo-300"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } transition`}
            >
              {submitLoading ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default RegistrarEventoPage;
