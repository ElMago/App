import React, { useState } from 'react';
import { useTruckerContext } from '../context/TruckerContext';
import { Truck, Save } from 'lucide-react';

export default function Profile() {
  const { data, updateVehicle } = useTruckerContext();
  const [truckPlate, setTruckPlate] = useState(data.vehicle?.truckPlate || '');
  const [trailerPlate, setTrailerPlate] = useState(data.vehicle?.trailerPlate || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVehicle(truckPlate, trailerPlate);
    alert('Datos del vehículo guardados correctamente.');
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
          <Truck className="mr-2 text-blue-600" /> Perfil y Vehículo
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Matrícula del Camión (Tractora)</label>
            <input
              value={truckPlate}
              onChange={e => setTruckPlate(e.target.value)}
              className="w-full p-2 border rounded-lg uppercase"
              placeholder="Ej: 1234 ABC"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Matrícula del Remolque</label>
            <input
              value={trailerPlate}
              onChange={e => setTrailerPlate(e.target.value)}
              className="w-full p-2 border rounded-lg uppercase"
              placeholder="Ej: R 5678 BCD"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 flex justify-center items-center mt-4">
            <Save size={20} className="mr-2"/> Guardar Datos
          </button>
        </form>
      </div>
    </div>
  );
}
