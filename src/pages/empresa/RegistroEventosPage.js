import React, { useEffect, useState } from "react";
import axios from "axios";

const API_REGISTRO_EVENTO_URL = "http://localhost:3000/api/registro-evento";

const RegistroEventosPage = () => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchRegistros = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_REGISTRO_EVENTO_URL}/listar-registros`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRegistros(res.data);
      setError("");
    } catch {
      setError("Error cargando registros");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRegistros();
  }, [fetchRegistros]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este registro?")) return;
    try {
      await axios.delete(`${API_REGISTRO_EVENTO_URL}/eliminar-registro/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRegistros();
    } catch {
      setError("Error eliminando registro");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Registros a mis Eventos
      </h2>

      {loading ? (
        <p className="text-center text-gray-600 animate-pulse">
          Cargando registros...
        </p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : registros.length === 0 ? (
        <p className="text-center text-gray-700">No hay registros aún.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-2 px-4">Usuario</th>
                <th className="py-2 px-4">Evento</th>
                <th className="py-2 px-4">Empresa</th>
                <th className="py-2 px-4">Fecha de Registro</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr
                  key={registro.id_registro_evento}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  <td className="py-2 px-4">{registro.usuario}</td>
                  <td className="py-2 px-4">{registro.evento}</td>
                  <td className="py-2 px-4">{registro.empresa}</td>
                  <td className="py-2 px-4">
                    {new Date(registro.fecha_registro).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(registro.id_registro_evento)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar registro"
                    >
                      🗑️
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

export default RegistroEventosPage;
