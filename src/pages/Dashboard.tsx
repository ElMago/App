import { useTruckerContext } from '../context/TruckerContext';
import { Truck, Navigation, Fuel, Coffee, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { data, endCurrentActivity, addActivity } = useTruckerContext();
  const navigate = useNavigate();

  const currentTrip = data.trips.find(t => t.id === data.currentTripId);
  const currentActivity = currentTrip?.activities.find(a => !a.endTime);

  const todayStr = new Date().toLocaleDateString();
  const todaysFuel = data.fuelLogs.filter(log => new Date(log.date).toLocaleDateString() === todayStr);
  const totalLitersToday = todaysFuel.reduce((acc, log) => acc + log.liters, 0);
  const totalCostToday = todaysFuel.reduce((acc, log) => acc + log.cost, 0);
  const currency = data.profile?.currency || '€';

  const handleQuickActivity = (type: 'descanso' | 'paseo') => {
    if (!currentTrip) {
      alert('Debes iniciar una ruta primero.');
      navigate('/trips');
      return;
    }

    if (currentActivity) {
      endCurrentActivity(new Date().toISOString());
    }

    if (currentActivity?.type !== type) {
      addActivity({
        type,
        startTime: new Date().toISOString(),
        location: { country: 'ES', town: 'Actual' }, // Simplified for quick actions
      });
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Resumen Diario</h2>
        <p className="text-gray-500 mb-6">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <Fuel size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Combustible</p>
              <p className="font-bold text-gray-900">{totalLitersToday} L</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Gasto</p>
              <p className="font-bold text-gray-900">{totalCostToday.toFixed(2)} {currency}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Ruta Actual</h3>
        {currentTrip ? (
          <div>
            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <Navigation className="text-blue-500" size={20} />
              <span>Desde: <strong>{currentTrip.startLocation.town}, {currentTrip.startLocation.country}</strong></span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-500">Estado de Actividad:</p>
              <p className="font-semibold text-lg capitalize text-blue-700">
                {currentActivity ? currentActivity.type : 'Sin actividad activa'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickActivity('descanso')}
                className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors ${currentActivity?.type === 'descanso' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'}`}
              >
                <Coffee size={24} />
                <span className="text-sm font-medium">Descanso</span>
              </button>

              <button
                onClick={() => handleQuickActivity('paseo')}
                className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors ${currentActivity?.type === 'paseo' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'}`}
              >
                <MapPin size={24} />
                <span className="text-sm font-medium">Paseo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">No hay ruta activa</p>
            <button
              onClick={() => navigate('/trips')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Iniciar Ruta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
