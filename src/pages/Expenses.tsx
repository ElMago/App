import React, { useState } from 'react';
import { useTruckerContext } from '../context/TruckerContext';
import type { ExpenseCategory } from '../context/TruckerContext';
import { Receipt, Plus, Trash2, Calendar, Euro } from 'lucide-react';

export default function Expenses() {
  const { data, addExpense, deleteExpense } = useTruckerContext();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('mantenimiento');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return alert('Por favor rellena cantidad y descripción');

    addExpense({
      date: new Date().toISOString(),
      amount: Number(amount),
      category,
      description
    });

    setAmount(''); setDescription('');
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'mantenimiento': return 'Mantenimiento';
      case 'peaje': return 'Peajes';
      case 'dieta': return 'Dietas';
      default: return 'Otros';
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center text-blue-800">
          <Receipt className="mr-2 text-blue-600" /> Añadir Gasto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1 flex items-center"><Euro size={14} className="mr-1"/> Importe (€)</label>
              <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50" required placeholder="Ej: 150.00" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Categoría</label>
              <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} className="w-full p-2 border rounded-lg bg-gray-50">
                <option value="mantenimiento">Mantenimiento</option>
                <option value="peaje">Peajes</option>
                <option value="dieta">Dietas</option>
                <option value="otros">Otros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Descripción / Notas</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Ej: Ruedas nuevas, comida, etc." required />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 flex justify-center items-center mt-2">
            <Plus size={20} className="mr-2"/> Añadir Gasto
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-800">Historial de Gastos</h3>
        {(!data.expenses || data.expenses.length === 0) ? (
          <p className="text-gray-500 text-center py-4">No hay gastos registrados.</p>
        ) : (
          <div className="space-y-3">
            {data.expenses.map(exp => (
              <div key={exp.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{exp.description}</span>
                    <span className="text-xs text-blue-600 font-medium uppercase tracking-wider">{getCategoryLabel(exp.category)}</span>
                  </div>
                  <button onClick={() => deleteExpense(exp.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-3 border-t pt-2">
                  <span className="flex items-center text-xs text-gray-500"><Calendar size={12} className="mr-1"/> {new Date(exp.date).toLocaleDateString()}</span>
                  <span className="font-bold text-red-600 text-lg">-{exp.amount.toFixed(2)}€</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
