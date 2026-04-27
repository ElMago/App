import React from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-900 border-t border-gray-800 py-6 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} De la Ribera Racing. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};
