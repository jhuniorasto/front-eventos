import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const API_USERS_URL = "https://api-eventos-445r.onrender.com/api/users";

const PerfilPage = () => {
  const { user, token, login } = useContext(AuthContext);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    fecha_nacimiento: "",
    ciudad: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      // Cargar datos actuales
      setForm({
        nombre: user.nombre || "",
        correo: user.correo || "",
        telefono: user.telefono || "",
        fecha_nacimiento: user.fecha_nacimiento || "",
        ciudad: user.ciudad || "",
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      await axios.put(`${API_USERS_URL}/actualizar-usuario/${user.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("Perfil actualizado correctamente.");
      // Actualizar user en contexto
      login({ ...user, ...form }, token);
    } catch {
      setError("Error al actualizar perfil.");
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Mi Perfil</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="correo"
          type="email"
          value={form.correo}
          onChange={handleChange}
          placeholder="Correo"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
        />
        <input
          name="fecha_nacimiento"
          type="date"
          value={form.fecha_nacimiento}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
        />
        <input
          name="ciudad"
          value={form.ciudad}
          onChange={handleChange}
          placeholder="Ciudad"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
          required
        />

        {error && <p className="text-red-600">{error}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Actualizar Perfil
        </button>
      </form>
    </div>
  );
};

export default PerfilPage;
