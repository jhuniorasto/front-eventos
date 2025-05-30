import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, Outlet } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  // Menús según rol
  const menus = {
    admin: [
      { path: "/dashboard/usuarios", label: "Gestionar Usuarios" },
      { path: "/dashboard/empresas", label: "Gestionar Empresas" },
    ],
    empresa: [
      { path: "/dashboard/mis-eventos", label: "Mis Eventos" },
      { path: "/dashboard/gestion-eventos", label: "Gestión de Eventos" },
      { path: "/dashboard/registro-eventos", label: "Registros a mis eventos" },
    ],
    usuario: [
      { path: "/dashboard/mis-inscripciones", label: "Mis Inscripciones" },
      { path: "/dashboard/registrar-evento", label: "Registrar a Evento" },
      { path: "/dashboard/perfil", label: "Mi Perfil" },
    ],
  };

  const menuItems = menus[user.role] || [];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-700 text-white w-full md:w-60 p-6">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          {menuItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="hover:bg-white hover:text-indigo-700 rounded px-3 py-2 transition"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-grow p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6">
          Bienvenido, {user.nombre}
        </h1>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;
