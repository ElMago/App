import React from 'react';
import { Layout } from '../components/Layout';
import { Logo } from '../components/Logo';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Users } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <Layout>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/20 to-gray-950 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
                LA PASIÓN DEL MOTOR EN <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">LA RIBERA</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-lg">
                Únete a la comunidad de amantes del automovilismo. Descubre eventos, expón tu coche y participa en las mejores quedadas de la zona.
              </p>
              <div className="flex space-x-4">
                <Link to="/events" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-orange-600/20 transition-all hover:scale-105">
                  Ver Eventos
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full"></div>
                <Logo className="w-80 h-80 relative z-10 filter drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center">
            <div className="bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
              <Calendar size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Quedadas Únicas</h3>
            <p className="text-gray-400">Organizamos y compartimos los mejores eventos de motor de la región. No te pierdas ni uno.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center">
            <div className="bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
              <Trophy size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Exposiciones</h3>
            <p className="text-gray-400">Trae tu joya. Registra tu vehículo para las exposiciones y compite por ser el favorito del público.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center">
            <div className="bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Comunidad</h3>
            <p className="text-gray-400">Conoce a otros apasionados del mundo del motor. Comparte experiencias, fotos y afición.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
