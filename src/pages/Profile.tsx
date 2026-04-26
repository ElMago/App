import React, { useState } from 'react';
import { useTruckerContext } from '../context/TruckerContext';
import { Save, Truck } from 'lucide-react';

export default function Profile() {
  const { data, updateProfile } = useTruckerContext();
  const [truckPlate, setTruckPlate] = useState(data.profile?.truckPlate || '');
  const [trailerPlate, setTrailerPlate] = useState(data.profile?.trailerPlate || '');
  const [currency, setCurrency] = useState(data.profile?.currency || '€');
  const [role, setRole] = useState<'chofer' | 'jefe'>(data.profile?.role || 'chofer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ truckPlate, trailerPlate, currency, role, isPremium: data.profile?.isPremium || false });
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
              Mi Rol
            </label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setRole('chofer')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'chofer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Chófer
              </button>
              <button
                type="button"
                onClick={() => setRole('jefe')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'jefe' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Jefe / Autónomo
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {role === 'jefe' ? 'El Jefe tiene acceso a la pestaña de Finanzas y Gastos Globales.' : 'El Chófer tiene una vista simplificada enfocada en la ruta y subida de documentos.'}
            </p>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moneda
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="€">Euros (€)</option>
              <option value="$">Dólares ($)</option>
              <option value="£">Libras (£)</option>
              <option value="CHF">Francos Suizos (CHF)</option>
            </select>
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
