import axios from "axios";

const API_AUTH_URL = "https://api-eventos-445r.onrender.com/api/auth";

export const login = (correo, contraseña) => {
  return axios.post(`${API_AUTH_URL}/login`, { correo, contraseña });
};

export const register = (userData) => {
  return axios.post(`${API_AUTH_URL}/register`, userData);
};
export const logout = () => {
  // Aquí podrías hacer una llamada a la API para invalidar el token si es necesario
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
