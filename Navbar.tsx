import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-warm-card border-b border-warm-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-xl font-bold text-warm-text tracking-tight">HotelDesk</span>
          </div>
          
          {/* Menú Desktop */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-medium text-warm-text hover:text-primary transition-colors">Panel</a>
            <a href="#" className="text-sm font-medium text-warm-muted hover:text-primary transition-colors">Habitaciones</a>
            <a href="#" className="text-sm font-medium text-warm-muted hover:text-primary transition-colors">Reservas</a>
          </div>

          {/* Botón Móvil */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-warm-muted p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isOpen && (
        <div className="md:hidden bg-warm-card border-t border-warm-border px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-warm-text hover:bg-stone-100">Panel</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-warm-muted hover:bg-stone-100">Habitaciones</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-warm-muted hover:bg-stone-100">Reservas</a>
        </div>
      )}
    </nav>
  );
}