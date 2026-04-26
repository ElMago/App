import React, { useState } from 'react';
import { useTruckerContext } from '../context/TruckerContext';
import type { ActivityType } from '../context/TruckerContext';
import { Play, Square, Plus, Trash2, MapPin, Clock } from 'lucide-react';

export default function Trips() {
  const { data, startTrip, endTrip, addActivity, endCurrentActivity, deleteTrip } = useTruckerContext();
  const currentTrip = data.trips.find(t => t.id === data.currentTripId);
  const currentActivity = currentTrip?.activities.find(a => !a.endTime);

  const [country, setCountry] = useState('ES');
  const [town, setTown] = useState('');
  const [km, setKm] = useState('');
  const [actType, setActType] = useState<ActivityType>('conduccion');
  const [notes, setNotes] = useState('');

  const handleStartTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!town || !km) return alert('Por favor rellena pueblo y KM');
    startTrip({ country, town }, Number(km));
    setTown(''); setKm('');
  };

  const handleEndTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!town || !km) return alert('Por favor rellena pueblo y KM finales');
    if (currentActivity) endCurrentActivity(new Date().toISOString());
    endTrip({ country, town }, Number(km));
    setTown(''); setKm('');
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTrip) return alert('Inicia una ruta primero');
    if (!town) return alert('Por favor rellena el pueblo');

    if (currentActivity) {
      endCurrentActivity(new Date().toISOString());
    }

    addActivity({
      type: actType,
      startTime: new Date().toISOString(),
      location: { country, town },
      notes
    });
    setTown(''); setNotes('');
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">

      {!currentTrip ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Play className="mr-2 text-green-500" /> Iniciar Nueva Ruta</h2>
          <form onSubmit={handleStartTrip} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">País</label>
                <input value={country} onChange={e => setCountry(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Ej: ES, FR" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Pueblo/Ciudad</label>
                <input value={town} onChange={e => setTown(e.target.value)} className="w-full p-2 border rounded-lg" required />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">KM Iniciales</label>
              <input type="number" value={km} onChange={e => setKm(e.target.value)} className="w-full p-2 border rounded-lg" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700">Comenzar Ruta</button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Ruta en Curso</h2>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin size={14} className="mr-1"/> {currentTrip.startLocation.town}, {currentTrip.startLocation.country}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Inicio</p>
                <p className="font-mono">{currentTrip.startKm} km</p>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center"><Clock size={18} className="mr-2"/> Registrar Actividad</h3>
              <form onSubmit={handleAddActivity} className="space-y-3">
                <select value={actType} onChange={e => setActType(e.target.value as ActivityType)} className="w-full p-2 border rounded-lg bg-gray-50">
                  <option value="conduccion">Conducción</option>
                  <option value="descanso">Descanso</option>
                  <option value="carga">Carga</option>
                  <option value="descarga">Descarga</option>
                  <option value="paseo">Paseo</option>
                </select>
                <div className="grid grid-cols-3 gap-2">
                  <input value={country} onChange={e => setCountry(e.target.value)} className="col-span-1 p-2 border rounded-lg" placeholder="País" />
                  <input value={town} onChange={e => setTown(e.target.value)} className="col-span-2 p-2 border rounded-lg" placeholder="Pueblo/Ciudad" required />
                </div>
                <input value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Notas (opcional)" />
                <button type="submit" className="w-full bg-gray-100 text-gray-800 p-2 rounded-lg font-medium hover:bg-gray-200 flex justify-center items-center">
                  <Plus size={18} className="mr-1"/> Cambiar Actividad
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
            <h2 className="text-lg font-bold mb-4 flex items-center text-red-700"><Square className="mr-2" size={20}/> Finalizar Ruta</h2>
            <form onSubmit={handleEndTrip} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">País Final</label>
                  <input value={country} onChange={e => setCountry(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Ej: ES, FR" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Pueblo Final</label>
                  <input value={town} onChange={e => setTown(e.target.value)} className="w-full p-2 border rounded-lg" required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">KM Finales</label>
                <input type="number" value={km} onChange={e => setKm(e.target.value)} className="w-full p-2 border rounded-lg" required />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white p-3 rounded-lg font-medium hover:bg-red-700">Terminar Ruta</button>
            </form>
          </div>
        </div>
      )}

      {/* History */}
      {data.trips.filter(t => t.status === 'completado').length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Historial de Rutas</h3>
          <div className="space-y-3">
            {data.trips.filter(t => t.status === 'completado').reverse().map(trip => (
              <div key={trip.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">
                    {trip.startLocation.town} → {trip.endLocation?.town}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(trip.startDate).toLocaleDateString()} | Recorrido: {(trip.endKm || 0) - trip.startKm} km
                  </p>
                </div>
                <button onClick={() => deleteTrip(trip.id)} className="text-red-400 hover:text-red-600 p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
