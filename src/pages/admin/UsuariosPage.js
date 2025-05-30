import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://api-eventos-445r.onrender.com/api/users";
const API_AUTH = "https://api-eventos-445r.onrender.com/api/auth";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    telefono: "",
    fecha_nacimiento: "",
    ciudad: "",
    role_id: 3,
  });
  const [editingId, setEditingId] = useState(null);

  // Cargar usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/listar-usuarios`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsuarios(res.data);
      setError("");
    } catch (e) {
      setError("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "role_id" ? Number(value) : value,
    });
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      correo: "",
      contraseña: "",
      telefono: "",
      fecha_nacimiento: "",
      ciudad: "",
      role_id: 3,
    });
    setEditingId(null);
    setError("");
  };

  // Crear usuario
  const createUsuario = async () => {
    try {
      await axios.post(`${API_AUTH}/register`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsuarios();
      resetForm();
    } catch {
      setError("Error creando usuario");
    }
  };

  // Actualizar usuario
  const updateUsuario = async () => {
    try {
      await axios.put(`${API_URL}/actualizar-usuario/${editingId}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsuarios();
      resetForm();
    } catch {
      setError("Error actualizando usuario");
    }
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateUsuario();
    } else {
      createUsuario();
    }
  };

  // Editar usuario (cargar datos en form)
  const handleEdit = (usuario) => {
    setForm({
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono || "",
      fecha_nacimiento: usuario.fecha_nacimiento?.slice(0, 10) || "",
      ciudad: usuario.ciudad || "",
      role_id: usuario.role_id,
      contraseña: "",
    });
    setEditingId(usuario.id);
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      await axios.delete(`${API_URL}/eliminar-usuario/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsuarios();
    } catch {
      setError("Error eliminando usuario");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Gestión de Usuarios
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded shadow-lg max-w-lg mx-auto"
      >
        <h3 className="text-xl mb-4">
          {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={form.correo}
            onChange={handleChange}
            required
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={form.contraseña || ""}
            onChange={handleChange}
            required
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="date"
            name="fecha_nacimiento"
            placeholder="Fecha de nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          />
          <select
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          >
            <option value={1}>Admin</option>
            <option value={2}>Empresa</option>
            <option value={3}>Usuario</option>
          </select>
        </div>

        {error && (
          <p className="mt-4 text-red-600 font-semibold text-center">{error}</p>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
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
          Cargando usuarios...
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Correo</th>
                <th className="py-2 px-4">Teléfono</th>
                <th className="py-2 px-4">Fecha Nac.</th>
                <th className="py-2 px-4">Ciudad</th>
                <th className="py-2 px-4">Rol</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  <td className="py-2 px-4">{usuario.nombre}</td>
                  <td className="py-2 px-4">{usuario.correo}</td>
                  <td className="py-2 px-4">{usuario.telefono || "-"}</td>
                  <td className="py-2 px-4">
                    {usuario.fecha_nacimiento
                      ? new Date(usuario.fecha_nacimiento).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-2 px-4">{usuario.ciudad || "-"}</td>
                  <td className="py-2 px-4">
                    {usuario.rol === 1
                      ? "Admin"
                      : usuario.rol === 2
                      ? "Empresa"
                      : "Usuario"}
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => handleEdit(usuario)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(usuario.id)}
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
          {usuarios.length === 0 && (
            <p className="text-center mt-4 text-gray-600">No hay usuarios.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
