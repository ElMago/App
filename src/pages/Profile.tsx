import React, { useState } from 'react';
import { useTruckerContext } from '../context/TruckerContext';
import { Save, Truck } from 'lucide-react';

export default function Profile() {
  const { data, updateProfile } = useTruckerContext();
  const [truckPlate, setTruckPlate] = useState(data.profile?.truckPlate || '');
  const [trailerPlate, setTrailerPlate] = useState(data.profile?.trailerPlate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ truckPlate, trailerPlate });
    alert('Perfil guardado exitosamente.');
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Truck className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Mi Vehículo</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula del Camión
            </label>
            <input
              type="text"
              value={truckPlate}
              onChange={(e) => setTruckPlate(e.target.value.toUpperCase())}
              placeholder="Ej: 1234 ABC"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula del Remolque (opcional)
            </label>
            <input
              type="text"
              value={trailerPlate}
              onChange={(e) => setTrailerPlate(e.target.value.toUpperCase())}
              placeholder="Ej: R 1234 AB"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Save size={20} />
            <span>Guardar Perfil</span>
          </button>
        </form>
      </div>
    </div>
  );
}
