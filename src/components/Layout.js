import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const handleRedirect = () => {
    if (!user) return;

    if (location.pathname.startsWith("/dashboard")) {
      navigate("/");
    } else {
      if (user.role === "admin") {
        navigate("/dashboard/usuarios");
      } else if (user.role === "empresa") {
        navigate("/dashboard/eventos");
      } else if (user.role === "usuario") {
        navigate("/dashboard/mis-inscripciones");
      } else {
        navigate("/dashboard");
      }
    }
    setMenuOpen(false);
  };

  const isOnDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Eventos Colombia
        </Link>

        {/* Botón hamburguesa */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Menú en pantallas grandes */}
        <nav className="hidden md:flex space-x-4 items-center">
          {!user ? (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <span>
                Hola, {user.nombre} ({user.role})
              </span>
              <button
                onClick={handleRedirect}
                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
              >
                {isOnDashboard ? "Ir a Home" : "Ir al Dashboard"}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Menú móvil animado */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-indigo-600 text-white md:hidden px-4 pb-4 space-y-3 overflow-hidden"
          >
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="block"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block"
                  onClick={() => setMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <>
                <div>
                  Hola, {user.nombre} ({user.role})
                </div>
                <button
                  onClick={handleRedirect}
                  className="block bg-green-500 hover:bg-green-600 px-3 py-1 rounded w-full text-left"
                >
                  {isOnDashboard ? "Ir a Home" : "Ir al Dashboard"}
                </button>
                <button
                  onClick={handleLogout}
                  className="block bg-red-500 hover:bg-red-600 px-3 py-1 rounded w-full text-left mt-2"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow container mx-auto p-6">{children}</main>

      <footer className="bg-gray-100 text-center p-4 text-gray-600">
        © 2025 Eventos Colombia
      </footer>
    </div>
  );
};

export default Layout;
