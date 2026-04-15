import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, LogOut, User, ChevronDown, ChevronRight, 
  Warehouse, Truck, Clock, Bell, Settings, Maximize2, Minimize2, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const USER_DATA = {
  name: 'Carlos Rafael Heredia Loperena',
  role: 'Administrador',
  avatar: 'CH'
};

const Header = ({ isMobile, mobileMenuOpen, setMobileMenuOpen, isFullscreen, toggleFullscreen }) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleExit = () => {
    if (window.electron) {
      window.electron.ipcRenderer.send('close-app');
    } else {
      window.close();
    }
  };

  return (
    <div className="relative z-[10000] flex-shrink-0 bg-[#020617] backdrop-blur-md border-b border-blue-900/50 shadow-2xl shadow-blue-900/20 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="p-2 rounded-xl hover:bg-blue-900/50 transition-all lg:hidden"
            aria-label="Menú"
          >
            <Menu size={20} className="text-white" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/20">
            <span className="text-xl font-bold text-white drop-shadow-lg">🛞</span>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent tracking-tight">NeumatiQ</h1>
              <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-md border border-blue-500/50">Enterprise</span>
            </div>
            <p className="text-xs text-blue-200/70 font-medium">High-Tech Logistics</p>
          </div>
        </div>
      </div>

      {/* Search - PC */}
      {!isMobile && (
        <div className="flex-1 max-w-lg mx-6 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por medida, modelo o SKU..." 
              className="w-full pl-12 pr-12 py-3 bg-white/5 border border-blue-900/50 rounded-2xl text-white placeholder-blue-300/70 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm shadow-inner"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 text-xs">
              <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-blue-200">⌘</kbd>
              <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-blue-200">K</kbd>
            </div>
          </div>
        </div>
      )}

      {/* Search - Mobile */}
      {isMobile && (
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-3 rounded-2xl hover:bg-blue-900/50 transition-all"
          aria-label="Buscar"
        >
          <Search size={22} className="text-blue-300" />
        </button>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Status Indicators */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur rounded-xl border border-blue-900/50">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-200 font-medium">Live</span>
          </div>
          <div className="w-px h-4 bg-blue-900/50"></div>
          <Warehouse size={14} className="text-blue-400" />
          <span className="text-xs text-blue-200">Cloud</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => window.location.reload()}
            className="p-2.5 rounded-xl hover:bg-blue-900/50 transition-all group"
            title="Sincronizar"
          >
            <RefreshCw size={16} className="text-blue-300 group-hover:text-cyan-400 transition-colors" />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl hover:bg-blue-900/50 transition-all group"
            title="Pantalla completa"
          >
            {isFullscreen ? 
              <Minimize2 size={16} className="text-blue-300 group-hover:text-cyan-400 transition-colors" /> : 
              <Maximize2 size={16} className="text-blue-300 group-hover:text-cyan-400 transition-colors" />
            }
          </button>
        </div>

        {/* User Profile */}
        <div className="relative z-[9999]">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-900/50 transition-all group border border-blue-900/50 z-[9999]"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/20">
              {USER_DATA.avatar}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-white truncate max-w-32">{USER_DATA.name.split(' ')[0]}</p>
              <p className="text-xs text-blue-200">{USER_DATA.role}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-blue-300 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {userDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-72 bg-[#020617] rounded-2xl shadow-2xl border border-blue-900/50 backdrop-blur-xl overflow-hidden z-[10000] pointer-events-auto"
              >
                {/* Header */}
                <div className="p-5 border-b border-blue-900/50 bg-gradient-to-b from-blue-900/50 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {USER_DATA.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{USER_DATA.name}</p>
                      <p className="text-xs text-blue-200">carlos@neumatiq.com</p>
                    </div>
                  </div>
                </div>

                {/* Menu */}
                <div className="p-2 space-y-1">
                  <button onClick={() => { setUserDropdownOpen(false); navigate('/profile'); }} className="w-full text-left px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-900/50 hover:text-white transition-all flex items-center gap-3">
                    <User size={16} />
                    Mi Perfil
                  </button>
                  <button onClick={() => { setUserDropdownOpen(false); navigate('/notifications'); }} className="w-full text-left px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-900/50 hover:text-white transition-all flex items-center gap-3">
                    <Bell size={16} />
                    Notificaciones
                  </button>
                  <button onClick={() => { setUserDropdownOpen(false); navigate('/settings'); }} className="w-full text-left px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-900/50 hover:text-white transition-all flex items-center gap-3">
                    <Settings size={16} />
                    Configuración
                  </button>
                  <div className="border-t border-blue-900/50 my-1 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-xl text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 transition-all flex items-center gap-3 font-medium"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                    <button 
                      onClick={handleExit}
                      className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all flex items-center gap-3 font-medium"
                    >
                      <X size={16} />
                      Salir del Sistema
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Header;
