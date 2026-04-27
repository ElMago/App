/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import { LogOut, Home, Calendar, Settings } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  const NavLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          isActive ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <Icon size={20} />
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <Logo className="w-10 h-10" />
              <span className="text-xl font-bold text-white tracking-wider">
                DE LA RIBERA <span className="text-orange-500">RACING</span>
              </span>
            </Link>
          </div>

          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/" icon={Home}>Inicio</NavLink>
              <NavLink to="/events" icon={Calendar}>Eventos</NavLink>

              {isAdmin && (
                <>
                  <div className="w-px h-6 bg-gray-700 mx-2"></div>
                  <NavLink to="/admin/events" icon={Settings}>Admin Eventos</NavLink>
                </>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">
                  {user.username} <span className="text-xs bg-gray-800 px-2 py-1 rounded-full text-orange-400 ml-1">{user.role}</span>
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-orange-500 hover:text-orange-400 font-medium">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
