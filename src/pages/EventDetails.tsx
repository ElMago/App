/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/Layout';
import { api } from '../utils/api';
import type { Event, Car } from '../types';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Heart, Image as ImageIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const EventDetails: React.FC = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [myVote, setMyVote] = useState<number | null>(null);

  const fetchEventDetails = useCallback(async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);
    } catch (err: unknown) { console.error(err); }
  }, [eventId]);

  const fetchCars = useCallback(async () => {
    try {
      const res = await api.get(`/events/${eventId}/cars`);
      setCars(res.data);
    } catch (err: unknown) { console.error(err); }
  }, [eventId]);

  const fetchVotes = useCallback(async () => {
    try {
      const res = await api.get(`/events/${eventId}/votes`);
      const voteMap: Record<number, number> = {};
      res.data.forEach((v: {carId: number, voteCount: number}) => voteMap[v.carId] = v.voteCount);
      setVotes(voteMap);
    } catch (err: unknown) { console.error(err); }
  }, [eventId]);

  const fetchMyVote = useCallback(async () => {
    try {
      const res = await api.get(`/events/${eventId}/myvote`);
      setMyVote(res.data.carId);
    } catch (err: unknown) { console.error(err); }
  }, [eventId]);

  useEffect(() => {
    fetchEventDetails();
    fetchCars();
    fetchVotes();
    fetchMyVote();
  }, [fetchEventDetails, fetchCars, fetchVotes, fetchMyVote]);

  const handleVote = async (carId: number) => {
    try {
      await api.post(`/events/${eventId}/vote`, { carId });
      fetchVotes();
      fetchMyVote();
    } catch (err: unknown) {
      alert(((err as any)?.response?.data?.error) || 'Error al votar');
    }
  };

  if (!event) return <Layout><div className="text-center py-20 text-white">Cargando...</div></Layout>;

  return (
    <Layout>
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Link to="/events" className="inline-flex items-center text-gray-400 hover:text-orange-500 mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Volver a eventos
          </Link>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">{event.name}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <p className="text-xl text-gray-300 mb-8">{event.description}</p>
              <div className="space-y-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center text-gray-300">
                  <div className="bg-orange-500/10 p-3 rounded-lg mr-4"><Calendar className="text-orange-500" /></div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Fecha y Hora</p>
                    <p className="font-semibold">{new Date(event.date).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-300">
                  <div className="bg-orange-500/10 p-3 rounded-lg mr-4"><MapPin className="text-orange-500" /></div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Ubicación</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[300px] rounded-xl overflow-hidden border border-gray-700 z-0">
               {/* Simplified static map representation if geocoding is complex, or generic view */}
               <MapContainer center={[40.4168, -3.7038]} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[40.4168, -3.7038]}>
                  <Popup>{event.location}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Galería de Coches</h2>
            <p className="text-gray-400">Vota por tu favorito. Solo puedes votar por un coche en este evento.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.length === 0 ? (
            <div className="col-span-full bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
              Aún no hay coches registrados para este evento.
            </div>
          ) : (
            cars.map(car => (
              <div key={car.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors group">
                <div className="h-64 bg-gray-800 flex items-center justify-center relative">
                  {car.photoUrl ? (
                    <img src={`http://localhost:3001${car.photoUrl}`} alt={car.makeModel} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={48} className="text-gray-600" />
                  )}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-white font-black border border-white/20 shadow-lg text-lg">
                    #{car.participantNumber}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white leading-tight mb-1">{car.makeModel}</h3>
                      <p className="text-gray-400">Dueño: {car.owner}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${car.category === 'Competición' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                      {car.category}
                    </span>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center">
                    <div className="flex items-center text-gray-300">
                      <Heart className={`mr-2 ${myVote === car.id ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                      <span className="font-bold text-lg">{votes[car.id] || 0}</span>
                      <span className="text-gray-500 ml-1">votos</span>
                    </div>

                    <button
                      onClick={() => handleVote(car.id)}
                      disabled={myVote !== null}
                      className={`px-4 py-2 rounded-lg font-bold transition-all ${
                        myVote === car.id
                          ? 'bg-red-500 text-white cursor-default'
                          : myVote !== null
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-red-500 hover:text-white border border-gray-700 hover:border-red-500'
                      }`}
                    >
                      {myVote === car.id ? 'Tu Favorito' : myVote !== null ? 'Ya votaste' : 'Votar'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};
