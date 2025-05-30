import React, { useEffect, useState } from "react";
import { fetchEventos } from "../../api/eventos";

const EventosHomePage = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventos()
      .then((res) => {
        setEventos(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Cargando eventos...</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
        Eventos Disponibles
      </h2>

      {eventos.length === 0 ? (
        <p className="text-center text-gray-700">No hay eventos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="border rounded-lg shadow hover:shadow-xl transition p-5 flex flex-col"
            >
              <img
                src="https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=600&q=80"
                alt={evento.titulo}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{evento.titulo}</h3>
              <p className="text-gray-600 flex-grow">{evento.descripcion}</p>
              <p className="mt-4 text-sm text-gray-500">
                Tipo: {evento.tipo_evento}
              </p>
              <p className="text-sm text-gray-500">
                Fecha: {new Date(evento.fecha_inicio).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventosHomePage;
