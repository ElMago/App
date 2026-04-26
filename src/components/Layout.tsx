import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Truck, Fuel, Map, User, Receipt, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 pb-16">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10 flex items-center justify-center space-x-2">
        <Truck size={28} />
        <h1 className="text-xl font-bold">TruckerApp</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>

      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full z-10 flex justify-around p-2 pb-safe text-xs overflow-x-auto">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Home size={24} />
          <span className="mt-1">Inicio</span>
        </NavLink>
        <NavLink to="/trips" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Truck size={24} />
          <span className="mt-1">Rutas</span>
        </NavLink>
        <NavLink to="/fuel" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Fuel size={24} />
          <span className="mt-1">Gasoil</span>
        </NavLink>
        <NavLink to="/map" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Map size={24} />
          <span className="mt-1">Mapa</span>
        </NavLink>
        <NavLink to="/expenses" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Receipt size={24} />
          <span className="mt-1">Gastos</span>
        </NavLink>
        <NavLink to="/finances" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <BarChart3 size={24} />
          <span className="mt-1">Finanzas</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <User size={24} />
          <span className="mt-1">Perfil</span>
        </NavLink>
      </nav>
    </div>
  );
}
