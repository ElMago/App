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

  // Nuevos campos para datos de carga
  const [pallets, setPallets] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [unloadTown, setUnloadTown] = useState('');

  const handleStartTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!town || !km) return alert('Por favor rellena pueblo origen y KM');

    startTrip(
      { country, town },
      Number(km),
      {
        pallets: pallets ? Number(pallets) : undefined,
        weight: weight ? Number(weight) : undefined,
        price: price ? Number(price) : undefined,
        loadLocation: { country, town },
        unloadLocation: unloadTown ? { country, town: unloadTown } : undefined
      }
    );
    setTown(''); setKm(''); setPallets(''); setWeight(''); setPrice(''); setUnloadTown('');
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
            <div className="border-b pb-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-3">Datos de Origen</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">País Origen</label>
                  <input value={country} onChange={e => setCountry(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Ej: ES, FR" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Pueblo Origen</label>
                  <input value={town} onChange={e => setTown(e.target.value)} className="w-full p-2 border rounded-lg" required />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm text-gray-600 mb-1">KM Iniciales</label>
                <input type="number" value={km} onChange={e => setKm(e.target.value)} className="w-full p-2 border rounded-lg" required />
              </div>
            </div>

            <div className="border-b pb-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-3">Datos de Carga</h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Palets</label>
                  <input type="number" value={pallets} onChange={e => setPallets(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Ej: 33" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Peso (kg)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Ej: 24000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Destino (Pueblo)</label>
                  <input value={unloadTown} onChange={e => setUnloadTown(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Pueblo destino" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Precio Pactado (€)</label>
                  <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border rounded-lg text-green-700 font-bold" placeholder="Ej: 800" />
                </div>
              </div>
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

            {currentTrip.load && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm grid grid-cols-2 gap-2">
                <div><span className="text-gray-500">Destino:</span> <strong>{currentTrip.load.unloadLocation?.town || '-'}</strong></div>
                <div><span className="text-gray-500">Precio:</span> <strong className="text-green-600">{currentTrip.load.price ? `${currentTrip.load.price}€` : '-'}</strong></div>
                <div><span className="text-gray-500">Palets:</span> <strong>{currentTrip.load.pallets || '-'}</strong></div>
                <div><span className="text-gray-500">Peso:</span> <strong>{currentTrip.load.weight ? `${currentTrip.load.weight}kg` : '-'}</strong></div>
              </div>
            )}

            <div className="mt-4 border-t pt-4">
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
                  {trip.load?.price && <p className="text-xs font-bold text-green-600 mt-1">Precio: {trip.load.price}€</p>}
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
