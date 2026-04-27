/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { api } from '../utils/api';
import type { Car, Event } from '../types';
import { Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export const AdminCars: React.FC = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCar, setCurrentCar] = useState<Partial<Car>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const fetchEventDetails = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);
    } catch (err: unknown) {
      console.error(err);
    }
  };

const fetchCars = async () => {
    try {
      const res = await api.get(`/events/${eventId}/cars`);
      setCars(res.data);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('makeModel', currentCar.makeModel || '');
    formData.append('owner', currentCar.owner || '');
    formData.append('participantNumber', currentCar.participantNumber || '');
    formData.append('category', currentCar.category || '');
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      if (currentCar.id) {
        await api.put(`/cars/${currentCar.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post(`/events/${eventId}/cars`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      setCurrentCar({});
      setPhotoFile(null);
      fetchCars();
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este coche?')) {
      try {
        await api.delete(`/cars/${id}`);
        fetchCars();
      } catch (err: unknown) {
        console.error(err);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link to="/admin/events" className="text-gray-400 hover:text-white flex items-center space-x-2">
            <ArrowLeft size={20} />
            <span>Volver a Eventos</span>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Coches Inscritos</h1>
            <p className="text-gray-400">Evento: <span className="text-orange-500 font-semibold">{event?.name}</span></p>
          </div>
          <button
            onClick={() => { setCurrentCar({ category: 'Exposición' }); setPhotoFile(null); setShowModal(true); }}
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Añadir Coche</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.length === 0 ? (
            <div className="col-span-full bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
              No hay coches registrados en este evento aún.
            </div>
          ) : (
            cars.map(car => (
              <div key={car.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">
                <div className="h-48 bg-gray-800 flex items-center justify-center relative">
                  {car.photoUrl ? (
                    <img src={`http://localhost:3001${car.photoUrl}`} alt={car.makeModel} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={48} className="text-gray-600" />
                  )}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold border border-white/10">
                    #{car.participantNumber}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white leading-tight">{car.makeModel}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${car.category === 'Competición' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                      {car.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">Propietario: <span className="text-gray-300">{car.owner}</span></p>

                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-800">
                    <button
                      onClick={() => { setCurrentCar(car); setPhotoFile(null); setShowModal(true); }}
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded" title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded" title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-700 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{currentCar.id ? 'Editar Coche' : 'Añadir Coche'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Marca y Modelo</label>
                <input
                  type="text" required
                  value={currentCar.makeModel || ''}
                  onChange={e => setCurrentCar({...currentCar, makeModel: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del Propietario</label>
                <input
                  type="text" required
                  value={currentCar.owner || ''}
                  onChange={e => setCurrentCar({...currentCar, owner: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Número</label>
                  <input
                    type="text" required
                    value={currentCar.participantNumber || ''}
                    onChange={e => setCurrentCar({...currentCar, participantNumber: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                  <select
                    value={currentCar.category || 'Exposición'}
                    onChange={e => setCurrentCar({...currentCar, category: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Exposición">Exposición</option>
                    <option value="Competición">Competición</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Foto del Coche</label>
                <input
                  type="file" accept="image/*"
                  onChange={e => setPhotoFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                />
                {currentCar.photoUrl && !photoFile && (
                  <p className="text-xs text-gray-500 mt-2">Ya hay una foto subida. Sube una nueva para reemplazarla.</p>
                )}
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
