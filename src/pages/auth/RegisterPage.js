import React, { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    telefono: "",
    fecha_nacimiento: "",
    ciudad: "",
    role_id: 3, // Siempre usuario al registrar desde frontend
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación básica
    if (!form.nombre || !form.correo || !form.contraseña || !form.ciudad) {
      setError("Por favor complete todos los campos obligatorios.");
      return;
    }

    try {
      await register(form);
      alert("Registro exitoso. Por favor inicia sesión.");
      navigate("/login");
    } catch {
      setError("Error al registrar. Verifica tus datos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-600 to-blue-700 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Registro de Usuario
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="nombre"
            placeholder="Nombre completo *"
            value={form.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico *"
            value={form.correo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña *"
            value={form.contraseña}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="ciudad"
            placeholder="Ciudad *"
            value={form.ciudad}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && (
            <p className="text-red-600 text-center font-semibold">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Registrarse
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
