import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const API_EMPRESAS_URL = "http://localhost:3000/api/empresas";
const API_AUTH = "http://localhost:3000/api/auth";

const EmpresasPage = () => {
  const { token } = useContext(AuthContext);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    tipo_empresa: "",
    role_id: 2, // <-- Agrega esto, 2 para empresa
  });
  const [editingId, setEditingId] = useState(null);

  // Cargar empresas
  const fetchEmpresas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_EMPRESAS_URL}/listar-empresas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpresas(res.data);
      setError("");
    } catch (e) {
      setError("Error cargando empresas");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

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
      direccion: "",
      ciudad: "",
      tipo_empresa: "",
      role_id: 2, // <-- Agrega esto
    });
    setEditingId(null);
    setError("");
  };

  // Crear empresa
  const createEmpresa = async () => {
    try {
      await axios.post(`${API_AUTH}/register`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmpresas();
      resetForm();
    } catch {
      setError("Error creando empresa");
    }
  };

  const updateEmpresa = async () => {
    try {
      const datosActualizados = {
        direccion: form.direccion,
        ciudad: form.ciudad,
        tipo_empresa: form.tipo_empresa,
      };

      await axios.put(
        `${API_EMPRESAS_URL}/actualizar-empresa/${editingId}`,
        datosActualizados,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchEmpresas();
      resetForm();
    } catch (error) {
      const msg = error.response?.data?.error || "Error actualizando empresa";
      setError(msg);
    }
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateEmpresa();
    } else {
      createEmpresa();
    }
  };

  // Editar empresa
  const handleEdit = (empresa) => {
    setForm({
      nombre: empresa.nombre || "",
      correo: empresa.correo || "",
      contraseña: "", // Nunca mostrar contraseña
      telefono: empresa.telefono || "",
      direccion: empresa.direccion || "",
      ciudad: empresa.ciudad || "",
      tipo_empresa: empresa.tipo_empresa || "",
      role_id: 2, // <-- Asegúrate de que sea 2 al editar
    });
    setEditingId(empresa.id);
  };

  // Eliminar empresa
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta empresa?")) return;
    try {
      await axios.delete(`${API_EMPRESAS_URL}/eliminar-empresa/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEmpresas();
    } catch {
      setError("Error eliminando empresa");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Gestión de Empresas
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded shadow-lg max-w-lg mx-auto"
      >
        <h3 className="text-xl mb-4">
          {editingId ? "Editar Empresa" : "Crear Nueva Empresa"}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <input
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
          {!editingId && (
            <input
              type="password"
              name="contraseña"
              placeholder="Contraseña"
              value={form.contraseña}
              onChange={handleChange}
              required
              className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
            />
          )}
          <input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="ciudad"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={handleChange}
            required
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          />
          {/* Selector de rol */}
          <select
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            required
            className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          >
            <option value={2}>Empresa</option>
            <option value={3}>Usuario</option>
          </select>
          {/* Solo muestra los campos de empresa si el rol es Empresa */}
          {Number(form.role_id) === 2 && (
            <>
              <input
                name="direccion"
                placeholder="Dirección"
                value={form.direccion}
                onChange={handleChange}
                required
                className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              />
              <input
                name="tipo_empresa"
                placeholder="Tipo de empresa"
                value={form.tipo_empresa}
                onChange={handleChange}
                required
                className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              />
            </>
          )}
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
          Cargando empresas...
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Correo</th>
                <th className="py-2 px-4">Teléfono</th>
                <th className="py-2 px-4">Dirección</th>
                <th className="py-2 px-4">Ciudad</th>
                <th className="py-2 px-4">Tipo Empresa</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr
                  key={empresa.id}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  <td className="py-2 px-4">{empresa.nombre}</td>
                  <td className="py-2 px-4">{empresa.correo}</td>
                  <td className="py-2 px-4">{empresa.telefono || "-"}</td>
                  <td className="py-2 px-4">{empresa.direccion || "-"}</td>
                  <td className="py-2 px-4">{empresa.ciudad || "-"}</td>
                  <td className="py-2 px-4">{empresa.tipo_empresa || "-"}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => handleEdit(empresa)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(empresa.id)}
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
          {empresas.length === 0 && (
            <p className="text-center mt-4 text-gray-600">No hay empresas.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmpresasPage;
