import axios from "axios";

const API_EVENTOS_URL = "http://localhost:3000/api/eventos";

export const fetchEventos = () => {
  return axios.get(`${API_EVENTOS_URL}/listar-eventos`);
};
