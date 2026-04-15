import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Maximize2, ChevronDown, User, Bell, Settings, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const USER_DATA = {
  name: 'Carlos Rafael Heredia Loperena',
  shortName: 'Carlos',
  role: 'Administrador',
  email: 'carlos@neumatiq.com',
  avatar: 'CH'
};

const NewHeader = ({ onLogout }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.header-user-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="relative z-[10000] flex-shrink-0 bg-[#020617] backdrop-blur-md border-b border-blue-900/50 shadow-2xl shadow-blue-900/20 h-16 flex items-center justify-between px-4 lg:px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/20 overflow-hidden">
            <img src="/assets/Logo_de_NeumatiQ-.png" alt="Usuario" className="w-full h-full object-contain rounded-full" />
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

      {/* Search */}
      <div className="flex-1 max-w-lg mx-6 relative">
        <div className="relative">
          <Search className="lucide lucide-search absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" aria-hidden="true" />
          <input 
            type="text" 
            placeholder="Buscar por medida, modelo o SKU..." 
            className="w-full pl-12 pr-12 py-3 bg-white/5 border border-blue-900/50 rounded-2xl text-white placeholder-blue-300/70 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm shadow-inner" 
            defaultValue=""
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 text-xs">
            <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-blue-200">⌘</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-blue-200">K</kbd>
          </div>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur rounded-xl border border-blue-900/50">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-200 font-medium">Live</span>
          </div>
          <div className="w-px h-4 bg-blue-900/50"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-warehouse text-blue-400" aria-hidden="true">
            <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"></path>
            <path d="M6 18h12"></path>
            <path d="M6 14h12"></path>
            <rect width="12" height="12" x="6" y="10"></rect>
          </svg>
          <span className="text-xs text-blue-200">Cloud</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="p-2.5 rounded-xl hover:bg-blue-900/50 transition-all group" title="Sincronizar">
            <RefreshCw className="lucide lucide-refresh-cw text-blue-300 group-hover:text-cyan-400 w-4 h-4 transition-colors" aria-hidden="true" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-blue-900/50 transition-all group" title="Pantalla completa">
            <Maximize2 className="lucide lucide-maximize2 lucide-maximize-2 text-blue-300 group-hover:text-cyan-400 w-4 h-4 transition-colors" aria-hidden="true" />
          </button>
        </div>

        {/* User Dropdown */}
        <div className="relative header-user-dropdown z-[9999]">
          <button 
            onClick={toggleDropdown}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-900/50 transition-all group border border-blue-900/50 z-[9999]"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/20 overflow-hidden">
              <img src="/assets/Logo_de_NeumatiQ-.png" alt="Usuario" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-white truncate max-w-32">{USER_DATA.shortName}</p>
              <p className="text-xs text-blue-200">{USER_DATA.role}</p>
            </div>
            <ChevronDown className="lucide lucide-chevron-down w-4 h-4 text-blue-300 transition-transform rotate-180" aria-hidden="true" />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full right-0 mt-2 w-72 bg-[#020617] rounded-2xl shadow-2xl border border-blue-900/50 backdrop-blur-xl overflow-hidden z-[10000]"
              >
                <div className="p-5 border-b border-blue-900/50 bg-gradient-to-b from-blue-900/50 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                      <img src="/assets/Logo_de_NeumatiQ-.png" alt="Usuario" className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{USER_DATA.name}</p>
                      <p className="text-xs text-blue-200">{USER_DATA.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <button onClick={() => { setDropdownOpen(false); navigate('/profile'); }} className="w-full text-left px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-900/50 hover:text-white transition-all flex items-center gap-3">
                    <User className="w-4 h-4" aria-hidden="true" /> Mi Perfil
                  </button>
                  <button onClick={() => { setDropdownOpen(false); navigate('/notifications'); }} className="w-full text-left px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-900/50 hover:text-white transition-all flex items-center gap-3">
                    <Bell className="w-4 h-4" aria-hidden="true" /> Notificaciones
                  </button>
                  <button onClick={() => { setDropdownOpen(false); navigate('/settings'); }} className="w-full text-left px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-900/50 hover:text-white transition-all flex items-center gap-3">
                    <Settings className="w-4 h-4" aria-hidden="true" /> Configuración
                  </button>
                  <div className="border-t border-blue-900/50 my-1 pt-2">
                    <button 
                      className="w-full text-left px-4 py-3 rounded-xl text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 transition-all flex items-center gap-3 font-medium"
                      onClick={() => {
                        setDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" /> Cerrar Sesión
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all flex items-center gap-3 font-medium">
                      <X className="w-4 h-4" aria-hidden="true" /> Salir del Sistema
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

export default NewHeader;

