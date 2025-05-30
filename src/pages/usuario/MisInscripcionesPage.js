import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const API_REGISTRO_EVENTO_URL =
  "https://api-eventos-445r.onrender.com/api/registro-evento";

const MisInscripcionesPage = () => {
  const { user, token } = useContext(AuthContext);
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInscripciones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_REGISTRO_EVENTO_URL}/listar-registros-usuario`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInscripciones(res.data);
      setError("");
    } catch {
      setError("Error cargando inscripciones");
      setInscripciones([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user) fetchInscripciones();
  }, [fetchInscripciones, user]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres cancelar esta inscripción?"))
      return;
    try {
      await axios.delete(`${API_REGISTRO_EVENTO_URL}/eliminar-registro/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInscripciones();
    } catch {
      setError("Error cancelando inscripción");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-green-700">
        Mis Inscripciones
      </h2>

      {loading ? (
        <p className="text-center text-gray-600 animate-pulse">
          Cargando inscripciones...
        </p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : inscripciones.length === 0 ? (
        <p className="text-center text-gray-700">
          No estás inscrito a ningún evento.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Evento</th>
                <th className="py-2 px-4 text-left">Fecha y hora del evento</th>
                <th className="py-2 px-4 text-left">Lugar</th>
                <th className="py-2 px-4 text-left">Duración</th>
                <th className="py-2 px-4 text-left">Organiza</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inscripciones.map((registro) => (
                <tr
                  key={registro.id_registro}
                  className="border-b hover:bg-green-50 transition"
                >
                  <td className="py-2 px-4">{registro.evento}</td>
                  <td className="py-2 px-4">
                    {new Date(registro.fecha).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{registro.lugar}</td>
                  <td className="py-2 px-4">{registro.duracion} Horas</td>
                  <td className="py-2 px-4">{registro.empresa}</td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleDelete(registro.id_registro)}
                      className="text-red-600 hover:text-red-900"
                      title="Cancelar inscripción"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MisInscripcionesPage;
