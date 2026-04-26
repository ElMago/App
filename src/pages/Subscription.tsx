import React from 'react';
import { useTruckerContext } from '../context/TruckerContext';
import { Star, CheckCircle, Lock, ShieldCheck } from 'lucide-react';

export const Subscription: React.FC = () => {
  const { data, updateProfile } = useTruckerContext();
  const { isPremium } = data.profile;

  const handleUpgrade = () => {
    // In a real app, this would redirect to a payment gateway (Stripe, etc.)
    // For now, we simulate a successful payment by instantly upgrading the user.
    updateProfile({ ...data.profile, isPremium: true });
    alert('¡Suscripción Pro activada con éxito!');
  };

  const handleCancel = () => {
    if (confirm('¿Estás seguro de que deseas cancelar tu suscripción Pro? Perderás acceso a las funciones avanzadas.')) {
      updateProfile({ ...data.profile, isPremium: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
        <div className="flex justify-center mb-4">
          <Star className={`w-12 h-12 ${isPremium ? 'text-yellow-500' : 'text-gray-300'}`} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isPremium ? 'Eres usuario PRO' : 'Mejora tu cuenta a PRO'}
        </h2>
        <p className="text-gray-600 mb-6">
          {isPremium
            ? 'Gracias por confiar en nosotros. Tienes acceso total a todas las herramientas de gestión.'
            : 'Desbloquea el "Modo Jefe", escáner de documentos, estadísticas avanzadas y lleva el control total de tu rentabilidad.'}
        </p>

        {isPremium && (
          <button
            onClick={handleCancel}
            className="text-red-500 hover:text-red-700 underline text-sm"
          >
            Cancelar suscripción
          </button>
        )}
      </div>

      {!isPremium && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Plan Básico</h3>
            <div className="text-3xl font-bold text-gray-900 mb-6">Gratis</div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Registro de Viajes y Cargas</span>
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Mapa y Rutas</span>
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span>Registro básico de Combustible</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Lock className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Finanzas y Gastos</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Lock className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Rentabilidad Mensual ("Modo Jefe")</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Lock className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Escáner de Documentos (CMR, Tickets)</span>
              </li>
            </ul>
            <button disabled className="w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg font-semibold cursor-not-allowed">
              Plan Actual
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-blue-50 rounded-xl shadow-md border-2 border-blue-500 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              RECOMENDADO
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Plan PRO</h3>
            <div className="text-3xl font-bold text-blue-900 mb-1">5,99 {data.profile.currency} <span className="text-sm font-normal text-blue-700">/ mes</span></div>
            <p className="text-sm text-blue-600 mb-6">Cancela cuando quieras</p>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center text-blue-800 font-medium">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Todo lo del Plan Básico, MÁS:</span>
              </li>
              <li className="flex items-center text-gray-700">
                <ShieldCheck className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Gestión de Gastos y Mantenimiento</span>
              </li>
              <li className="flex items-center text-gray-700">
                <ShieldCheck className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Analíticas de Rentabilidad y Beneficios</span>
              </li>
              <li className="flex items-center text-gray-700">
                <ShieldCheck className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Escáner y Archivo de Documentos</span>
              </li>
              <li className="flex items-center text-gray-700">
                <ShieldCheck className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Soporte prioritario</span>
              </li>
            </ul>

            <button
              onClick={handleUpgrade}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg transition-colors flex items-center justify-center"
            >
              <Star className="w-5 h-5 mr-2" />
              Actualizar a PRO
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
