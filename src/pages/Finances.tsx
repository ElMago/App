import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTruckerContext } from '../context/TruckerContext';
import { PieChart, TrendingUp, TrendingDown, Calendar as CalendarIcon, DollarSign, Lock, Star } from 'lucide-react';

export default function Finances() {
  const { data } = useTruckerContext();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Filter data by selected month and year
  const filterByDate = (item: { date?: string, startDate?: string }) => {
    const d = new Date(item.date || item.startDate || '');
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  };

  const currentTrips = data.trips.filter(filterByDate);
  const currentFuel = data.fuelLogs.filter(filterByDate);
  const currentExpenses = (data.expenses || []).filter(filterByDate);

  // Calculate totals
  const totalRevenue = currentTrips.reduce((acc, trip) => acc + (trip.revenue || 0), 0);
  const totalFuelCost = currentFuel.reduce((acc, log) => acc + log.cost, 0);
  const totalOtherExpenses = currentExpenses.reduce((acc, exp) => acc + exp.amount, 0);
  const totalExpenses = totalFuelCost + totalOtherExpenses;

  const profit = totalRevenue - totalExpenses;
  const currency = data.profile?.currency || '€';

  // Expense breakdown
  const expensesByCategory = currentExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const navigate = useNavigate();

  if (!data.profile.isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Función Exclusiva PRO</h2>
        <p className="text-gray-600 max-w-md">
          El análisis de rentabilidad, cálculo de beneficios netos y gráficas financieras están reservados para usuarios PRO.
        </p>
        <button
          onClick={() => navigate('/subscription')}
          className="mt-6 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
        >
          <Star className="w-5 h-5 mr-2" />
          Ver Planes Premium
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">

      {/* Month Selector */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3">
        <CalendarIcon className="text-gray-400" />
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="p-2 border-0 bg-transparent font-medium text-gray-800 focus:ring-0"
        >
          {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border-0 bg-transparent font-medium text-gray-800 focus:ring-0"
        >
          {[...Array(5)].map((_, i) => {
            const y = new Date().getFullYear() - i;
            return <option key={y} value={y}>{y}</option>;
          })}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
          <PieChart className="mr-2 text-blue-600" /> Resumen Mensual
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center text-green-700">
              <TrendingUp className="mr-2" size={20}/>
              <span className="font-semibold">Ingresos (Viajes)</span>
            </div>
            <span className="font-bold text-lg text-green-800">{totalRevenue.toFixed(2)} {currency}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center text-red-700">
              <TrendingDown className="mr-2" size={20}/>
              <span className="font-semibold">Gastos Totales</span>
            </div>
            <span className="font-bold text-lg text-red-800">{totalExpenses.toFixed(2)} {currency}</span>
          </div>

          <div className={`flex justify-between items-center p-5 rounded-lg border ${profit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
            <div className={`flex items-center ${profit >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              <DollarSign className="mr-2" size={24}/>
              <span className="font-bold text-lg">Beneficio Neto</span>
            </div>
            <span className={`font-black text-2xl ${profit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
              {profit.toFixed(2)} {currency}
            </span>
          </div>
        </div>
      </div>

      {/* Expenses Breakdown */}
      {totalExpenses > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Desglose de Gastos</h3>
          <div className="space-y-3">
            {totalFuelCost > 0 && (
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-gray-600">Gasoil</span>
                <span className="font-medium">{totalFuelCost.toFixed(2)} {currency}</span>
              </div>
            )}
            {Object.entries(expensesByCategory).map(([cat, amount]) => (
              <div key={cat} className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-gray-600 capitalize">{cat}</span>
                <span className="font-medium">{amount.toFixed(2)} {currency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Summary */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500 mb-1">Viajes Realizados</p>
          <p className="text-2xl font-bold text-gray-800">{currentTrips.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Repostajes</p>
          <p className="text-2xl font-bold text-gray-800">{currentFuel.length}</p>
        </div>
      </div>

    </div>
  );
}
