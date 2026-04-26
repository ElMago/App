import { useTruckerContext } from '../context/TruckerContext';
import { Navigation, Coffee, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { data, endCurrentActivity, addActivity } = useTruckerContext();
  const navigate = useNavigate();

  const currentTrip = data.trips.find(t => t.id === data.currentTripId);
  const currentActivity = currentTrip?.activities.find(a => !a.endTime);

  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Calculate Monthly Financials
  const monthlyTrips = data.trips.filter(t => t.status === 'completado' && t.endDate?.startsWith(currentMonthStr));
  const totalRevenue = monthlyTrips.reduce((acc, trip) => acc + (trip.load?.price || 0), 0);

  const monthlyFuelLogs = data.fuelLogs.filter(log => log.date.startsWith(currentMonthStr));
  const totalFuelCost = monthlyFuelLogs.reduce((acc, log) => acc + log.cost, 0);

  const monthlyExpenses = (data.expenses || []).filter(exp => exp.date.startsWith(currentMonthStr));
  const totalOtherExpenses = monthlyExpenses.reduce((acc, exp) => acc + exp.amount, 0);

  const totalExpenses = totalFuelCost + totalOtherExpenses;
  const netProfit = totalRevenue - totalExpenses;

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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Resumen Mensual</h2>
        <p className="text-gray-500 mb-6 capitalize">{new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Ingresos</p>
            <p className="text-xl font-bold text-green-700">{totalRevenue.toFixed(2)} €</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Gastos Totales</p>
            <p className="text-xl font-bold text-red-700">{totalExpenses.toFixed(2)} €</p>
          </div>
        </div>

        <div className={`p-4 rounded-lg flex justify-between items-center ${netProfit >= 0 ? 'bg-blue-50 border border-blue-200' : 'bg-orange-50 border border-orange-200'}`}>
          <span className="font-semibold text-gray-700">Beneficio Neto:</span>
          <span className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            {netProfit.toFixed(2)} €
          </span>
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
