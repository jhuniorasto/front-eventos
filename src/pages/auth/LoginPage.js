import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = "https://api-eventos-445r.onrender.com/auth/login";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(API_URL, { correo, contraseña: password });

      const { token, user } = res.data;
      login(user, token); // actualiza contexto global

      // Redirección automática según el rol
      if (user.role === "admin") {
        navigate("/dashboard/usuarios");
      } else if (user.role === "empresa") {
        navigate("/dashboard/mis-eventos");
      } else if (user.role === "usuario") {
        navigate("/dashboard/mis-inscripciones");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Credenciales inválidas.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">
        Iniciar Sesión
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
