/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { api } from '../utils/api';
import type { Event } from '../types';
import { Plus, Edit2, Trash2, Car as CarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({});
  const navigate = useNavigate();

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



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentEvent.id) {
        await api.put(`/events/${currentEvent.id}`, currentEvent);
      } else {
        await api.post('/events', currentEvent);
      }
      setShowModal(false);
      setCurrentEvent({});
      fetchEvents();
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este evento y todos sus coches asociados?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err: unknown) {
        console.error(err);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestión de Eventos</h1>
            <p className="text-gray-400">Administra las quedadas y exposiciones</p>
          </div>
          <button
            onClick={() => { setCurrentEvent({}); setShowModal(true); }}
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Nuevo Evento</span>
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-800 text-gray-400 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Ubicación</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No hay eventos registrados.</td></tr>
              ) : (
                events.map(event => (
                  <tr key={event.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-medium text-white">{event.name}</td>
                    <td className="px-6 py-4">{event.date}</td>
                    <td className="px-6 py-4">{event.location}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => navigate(`/admin/events/${event.id}/cars`)}
                        className="text-blue-400 hover:text-blue-300" title="Gestionar Coches"
                      >
                        <CarIcon size={20} className="inline" />
                      </button>
                      <button
                        onClick={() => { setCurrentEvent(event); setShowModal(true); }}
                        className="text-green-400 hover:text-green-300" title="Editar Evento"
                      >
                        <Edit2 size={20} className="inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-400 hover:text-red-300" title="Eliminar Evento"
                      >
                        <Trash2 size={20} className="inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{currentEvent.id ? 'Editar Evento' : 'Nuevo Evento'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del Evento</label>
                <input
                  type="text" required
                  value={currentEvent.name || ''}
                  onChange={e => setCurrentEvent({...currentEvent, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Fecha y Hora</label>
                <input
                  type="datetime-local" required
                  value={currentEvent.date || ''}
                  onChange={e => setCurrentEvent({...currentEvent, date: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Ubicación (Dirección exacta)</label>
                <input
                  type="text" required
                  value={currentEvent.location || ''}
                  onChange={e => setCurrentEvent({...currentEvent, location: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={currentEvent.description || ''}
                  onChange={e => setCurrentEvent({...currentEvent, description: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
