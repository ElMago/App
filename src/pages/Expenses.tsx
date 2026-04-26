import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTruckerContext } from '../context/TruckerContext';
import { Plus, Trash2, Receipt, Calendar, Tag, FileText, Lock, Star } from 'lucide-react';

export default function Expenses() {
  const { data, addExpense, deleteExpense } = useTruckerContext();
  const currency = data.profile?.currency || '€';

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'mantenimiento' | 'peaje' | 'dietas' | 'otros'>('mantenimiento');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return alert('Por favor rellena importe y descripción');

    addExpense({
      date: new Date().toISOString(),
      amount: Number(amount),
      category,
      description
    });

    setAmount('');
    setDescription('');
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'mantenimiento': return 'bg-red-100 text-red-700 border-red-200';
      case 'peaje': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'dietas': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const navigate = useNavigate();

  if (!data.profile.isPremium) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Función Exclusiva PRO</h2>
        <p className="text-gray-600 max-w-md">
          El registro de gastos, mantenimientos, peajes y dietas está reservado para usuarios PRO.
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center text-purple-800">
          <Receipt className="mr-2 text-purple-600" /> Nuevo Gasto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Importe ({currency})</label>
              <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50" required placeholder="Ej: 45.50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Categoría</label>
              <select value={category} onChange={e => setCategory(e.target.value as 'mantenimiento' | 'peaje' | 'dietas' | 'otros')} className="w-full p-2 border rounded-lg bg-gray-50">
                <option value="mantenimiento">Mantenimiento</option>
                <option value="peaje">Peaje</option>
                <option value="dietas">Dietas</option>
                <option value="otros">Otros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Descripción</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-lg" required placeholder="Ej: Cambio de aceite, Peaje AP-7..." />
          </div>

          <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded-lg font-medium hover:bg-purple-700 flex justify-center items-center mt-2">
            <Plus size={20} className="mr-2"/> Añadir Gasto
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-800">Historial de Gastos</h3>
        {!data.expenses || data.expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay gastos registrados.</p>
        ) : (
          <div className="space-y-3">
            {data.expenses.map(exp => (
              <div key={exp.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryColor(exp.category)} flex items-center`}>
                      <Tag size={10} className="mr-1"/> {exp.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center"><Calendar size={12} className="mr-1"/> {new Date(exp.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 flex items-center mt-2">
                    <FileText size={14} className="mr-2 text-gray-400"/> {exp.description}
                  </p>
                </div>
                <div className="flex items-center flex-col justify-between">
                  <span className="font-bold text-lg text-gray-900 mb-2">{exp.amount}{currency}</span>
                  <button onClick={() => deleteExpense(exp.id)} className="text-gray-400 hover:text-red-600 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
