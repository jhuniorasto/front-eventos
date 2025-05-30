import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/home/DashboardPage";
import PrivateRoute from "../components/PrivateRoute";

// Importa componentes de gestión (los crearemos luego)
import UsuariosPage from "../pages/admin/UsuariosPage";
import EmpresasPage from "../pages/admin/EmpresasPage";
import EventosEmpresaPage from "../pages/empresa/EventosPage";
import EventosHomePage from "../pages/home/EventosPage";

import RegistroEventosPage from "../pages/empresa/RegistroEventosPage";
import MisInscripcionesPage from "../pages/usuario/MisInscripcionesPage";
import PerfilPage from "../pages/usuario/PerfilPage";
import RegistrarEventoPage from "../pages/usuario/RegistrarEventoPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Dashboard protegido */}
    <Route
      path="/dashboard"
      element={
        <PrivateRoute roles={["admin", "empresa", "usuario"]}>
          <DashboardPage />
        </PrivateRoute>
      }
    >
      {/* Rutas anidadas por rol */}
      <Route
        path="usuarios"
        element={
          <PrivateRoute roles={["admin"]}>
            <UsuariosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="empresas"
        element={
          <PrivateRoute roles={["admin"]}>
            <EmpresasPage />
          </PrivateRoute>
        }
      />
      <Route
        path="mis-eventos"
        element={
          <PrivateRoute roles={["empresa"]}>
            <EventosHomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="gestion-eventos"
        element={
          <PrivateRoute roles={["empresa"]}>
            <EventosEmpresaPage />
          </PrivateRoute>
        }
      />
      <Route
        path="registro-eventos"
        element={
          <PrivateRoute roles={["empresa"]}>
            <RegistroEventosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="mis-inscripciones"
        element={
          <PrivateRoute roles={["usuario"]}>
            <MisInscripcionesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="registrar-evento"
        element={
          <PrivateRoute roles={["usuario"]}>
            <RegistrarEventoPage />
          </PrivateRoute>
        }
      />
      <Route
        path="perfil"
        element={
          <PrivateRoute roles={["usuario"]}>
            <PerfilPage />
          </PrivateRoute>
        }
      />
    </Route>
  </Routes>
);

export default AppRoutes;
