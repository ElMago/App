/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { api } from '../utils/api';
import type { Event } from '../types';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);



  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Próximas Quedadas</h1>
          <p className="text-xl text-gray-400">Descubre los mejores eventos de la ribera y únete a la pasión.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.length === 0 ? (
            <div className="col-span-full bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
              No hay eventos programados en este momento.
            </div>
          ) : (
            events.map(event => (
              <div key={event.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-orange-500/50 transition-colors group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white group-hover:text-orange-500 transition-colors">{event.name}</h2>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-400">
                      <Calendar size={18} className="mr-3 text-orange-500" />
                      <span>{new Date(event.date).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MapPin size={18} className="mr-3 text-orange-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 mb-6 line-clamp-2">{event.description}</p>

                  <Link
                    to={`/events/${event.id}`}
                    className="inline-flex items-center text-white bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Ver Detalles y Coches
                    <ChevronRight size={20} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};
