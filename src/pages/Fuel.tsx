import React, { useState } from 'react';
import { useTruckerContext } from '../context/TruckerContext';
import { Fuel as FuelIcon, Plus, Trash2, MapPin, Calendar, Euro, Droplets } from 'lucide-react';

export default function Fuel() {
  const { data, addFuelLog, deleteFuelLog } = useTruckerContext();

  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');
  const [km, setKm] = useState('');
  const [country, setCountry] = useState('ES');
  const [town, setTown] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liters || !cost || !km || !town) return alert('Por favor rellena los campos obligatorios');

    addFuelLog({
      date: new Date().toISOString(),
      liters: Number(liters),
      cost: Number(cost),
      km: Number(km),
      location: { country, town }
    });

    setLiters(''); setCost(''); setKm(''); setTown('');
  };

  // Calculate average consumption based on fuel logs
  const calculateConsumption = () => {
    if (data.fuelLogs.length < 2) return null;

    // Sort logs ascending by KM to calculate diffs properly
    const sortedLogs = [...data.fuelLogs].sort((a, b) => a.km - b.km);

    const firstLog = sortedLogs[0];
    const lastLog = sortedLogs[sortedLogs.length - 1];

    const totalKm = lastLog.km - firstLog.km;

    // Total liters between the first and last log
    // We don't include the first log's liters since they were used before the first KM reading
    let totalLiters = 0;
    for (let i = 1; i < sortedLogs.length; i++) {
      totalLiters += sortedLogs[i].liters;
    }

    if (totalKm <= 0 || totalLiters <= 0) return null;

    const avgLitersPer100Km = (totalLiters / totalKm) * 100;

    return {
      avg: avgLitersPer100Km.toFixed(2),
      totalKm,
      totalLiters
    };
  };

  const consumptionStats = calculateConsumption();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {consumptionStats && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-500 font-medium">Consumo Medio</h3>
            <p className="text-3xl font-bold text-blue-600">{consumptionStats.avg} <span className="text-sm font-normal text-gray-500">L/100km</span></p>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p>Basado en:</p>
            <p>{consumptionStats.totalKm} km</p>
            <p>{consumptionStats.totalLiters} L</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center text-blue-800">
          <FuelIcon className="mr-2 text-blue-600" /> Repostaje
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1 flex items-center"><Droplets size={14} className="mr-1"/> Litros</label>
              <input type="number" step="0.01" value={liters} onChange={e => setLiters(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50" required placeholder="Ej: 500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1 flex items-center"><Euro size={14} className="mr-1"/> Coste (€)</label>
              <input type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50" required placeholder="Ej: 750.50" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Kilómetros actuales</label>
            <input type="number" value={km} onChange={e => setKm(e.target.value)} className="w-full p-2 border rounded-lg" required />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-sm text-gray-600 mb-1">País</label>
              <input value={country} onChange={e => setCountry(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="ES" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Pueblo/Ciudad</label>
              <input value={town} onChange={e => setTown(e.target.value)} className="w-full p-2 border rounded-lg" required />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 flex justify-center items-center mt-2">
            <Plus size={20} className="mr-2"/> Añadir Repostaje
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-800">Historial de Consumo</h3>
        {data.fuelLogs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay repostajes registrados.</p>
        ) : (
          <div className="space-y-3">
            {data.fuelLogs.map(log => (
              <div key={log.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center text-sm font-semibold text-gray-800">
                    <MapPin size={16} className="text-red-500 mr-1"/> {log.location.town}, {log.location.country}
                  </div>
                  <button onClick={() => deleteFuelLog(log.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <span className="block text-xs text-blue-600">Litros</span>
                    <span className="font-bold">{log.liters}L</span>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <span className="block text-xs text-green-600">Coste</span>
                    <span className="font-bold">{log.cost}€</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <span className="block text-xs text-gray-600">Precio/L</span>
                    <span className="font-bold">{(log.cost / log.liters).toFixed(2)}€</span>
                  </div>
                </div>

                <div className="flex justify-between mt-3 text-xs text-gray-500">
                  <span className="flex items-center"><Calendar size={12} className="mr-1"/> {new Date(log.date).toLocaleDateString()}</span>
                  <span className="font-mono">{log.km} km</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
