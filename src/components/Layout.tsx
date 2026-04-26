import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Truck, Fuel, Map, Receipt, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 pb-16">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center">
          <Truck size={24} className="mr-2" />
          <h1 className="text-xl font-bold">TruckerApp</h1>
        </div>
        <Link to="/profile" className="p-2 rounded-full hover:bg-blue-700 transition-colors">
          <User size={24} />
        </Link>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>

      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full z-10 flex justify-around p-2 pb-safe">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Home size={22} />
          <span className="text-[10px] mt-1">Inicio</span>
        </NavLink>
        <NavLink to="/trips" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Truck size={22} />
          <span className="text-[10px] mt-1">Rutas</span>
        </NavLink>
        <NavLink to="/fuel" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Fuel size={22} />
          <span className="text-[10px] mt-1">Gasoil</span>
        </NavLink>
        <NavLink to="/expenses" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Receipt size={22} />
          <span className="text-[10px] mt-1">Gastos</span>
        </NavLink>
        <NavLink to="/map" className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Map size={22} />
          <span className="text-[10px] mt-1">Mapa</span>
        </NavLink>
      </nav>
    </div>
  );
}
