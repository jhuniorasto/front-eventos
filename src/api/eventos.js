import axios from "axios";

const API_EVENTOS_URL = "https://api-eventos-445r.onrender.com/api/eventos";

export const fetchEventos = () => {
  return axios.get(`${API_EVENTOS_URL}/listar-eventos`);
};
