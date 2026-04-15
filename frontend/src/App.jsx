import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Menu, X, Home, Package, ShoppingCart, BarChart3, Settings, 
  Sparkles, ChevronRight, Users, Truck, LineChart, User, Circle,
  Bell, Search, LifeBuoy, LayoutDashboard, TrendingUp, Activity,
  Target, ChevronLeft, Maximize2, Minimize2, Wifi, Battery,
  Volume2, VolumeX, RefreshCw, Globe, AlertCircle, CheckCircle
} from 'lucide-react';
import SplashScreen from './components/SplashScreen.jsx';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Products = lazy(() => import('./pages/Products.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const Customers = lazy(() => import('./pages/Customers.jsx'));
const AssistantPage = lazy(() => import('./pages/AssistantPage.jsx'));
// const Logistic = lazy(() => import('./pages/Logistic.jsx'));
const Analytics = lazy(() => import('./pages/Analytics.jsx'));
const SettingsPage = lazy(() => import('./pages/Settings.jsx'));

// Loading fallback
const PageLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-[#050c1a] to-[#0B1E3A] flex items-center justify-center z-50">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#1E90FF]/30 border-t-[#1E90FF] rounded-full animate-spin mx-auto mb-4"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-[#AFC8E6] text-sm font-medium mt-4">Cargando NeumatiQ...</p>
    </div>
  </div>
);

// Configuración de navegación
const NAVIGATION_CONFIG = [
  { id: 'dashboard', path: '/', name: 'Dashboard', icon: LayoutDashboard, description: 'Visión general' },
  { id: 'products', path: '/products', name: 'Productos', icon: Package, description: 'Gestión de inventario' },
  { id: 'orders', path: '/orders', name: 'Órdenes', icon: ShoppingCart, description: 'Seguimiento de pedidos' },
  { id: 'customers', path: '/customers', name: 'Clientes', icon: Users, description: 'Base de datos' },
  { id: 'logistica', path: '/logistica', name: 'Logística', icon: Truck, description: 'Envíos y tracking' },
  { id: 'analytics', path: '/analytics', name: 'Analytics', icon: TrendingUp, description: 'Métricas y KPIs' },
  { id: 'assistant', path: '/assistant', name: 'AI Assistant', icon: Sparkles, description: 'Análisis inteligente' },
  { id: 'settings', path: '/settings', name: 'Configuración', icon: Settings, description: 'Preferencias' },
];

// Datos del usuario
const USER_DATA = {
  name: 'Carlos Rafael Heredia Loperena',
  role: 'Administrador',
  email: 'carlos@neumatiq.com',
  avatar: 'NQ',
  status: 'online',
  lastActive: 'Ahora'
};

// Componente de Perfil de Usuario - CORREGIDO (z-index alto)
const UserProfile = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.user-profile-dropdown')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  return (
    <div className="relative user-profile-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all group border border-[#1E90FF]/10"
      >
        <div className="relative">
          <div className="w-9 h-9 bg-gradient-to-br from-[#1E90FF] to-[#3B82F6] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
            {USER_DATA.avatar}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5">
            <div className="relative">
              <Circle className="w-3 h-3 text-green-500 fill-green-500" />
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-[#EAF3FF]">{USER_DATA.name.split(' ')[0]} {USER_DATA.name.split(' ')[1]}</p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#AFC8E6]">{USER_DATA.role}</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#1E90FF]/20 text-[#1E90FF]">Admin</span>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-[#AFC8E6] transition-transform hidden lg:block ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-[#102A4C] rounded-xl shadow-2xl border border-[#1E90FF]/20 overflow-hidden z-[100] backdrop-blur-xl"
          >
            <div className="p-4 border-b border-[#1E90FF]/20 bg-gradient-to-r from-[#0B1E3A] to-[#102A4C]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1E90FF] to-[#3B82F6] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {USER_DATA.avatar}
                </div>
                <div>
                  <p className="font-bold text-[#EAF3FF] text-sm">{USER_DATA.name}</p>
                  <p className="text-xs text-[#AFC8E6]">{USER_DATA.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full w-fit">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Conectado</span>
              </div>
            </div>
            <div className="p-2">
              <button className="w-full text-left px-3 py-2 rounded-lg text-[#AFC8E6] hover:bg-[#1E4D7A] transition-colors text-sm flex items-center gap-2">
                <User size={14} /> Mi perfil
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-[#AFC8E6] hover:bg-[#1E4D7A] transition-colors text-sm flex items-center gap-2">
                <Bell size={14} /> Notificaciones
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-[#AFC8E6] hover:bg-[#1E4D7A] transition-colors text-sm flex items-center gap-2">
                <Settings size={14} /> Preferencias
              </button>
              <div className="border-t border-[#1E90FF]/20 my-2"></div>
              <button 
                onClick={onLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm flex items-center gap-2"
              >
                <LogOut size={14} /> Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente de Navegación
const NavItem = ({ item, isActive, onClick, isSidebarCollapsed }) => (
  <Link to={item.path} onClick={onClick}>
    <motion.div 
      whileHover={{ x: 4 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-[#1E90FF]/15 to-[#3B82F6]/5 text-[#1E90FF] border-l-2 border-[#1E90FF] shadow-lg shadow-[#1E90FF]/10' 
          : 'text-[#AFC8E6] hover:bg-white/5 hover:text-[#EAF3FF]'
      }`}
    >
      <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-[#1E90FF]/20' : ''}`}>
        <item.icon size={18} />
      </div>
      {!isSidebarCollapsed && (
        <>
          <div className="flex-1">
            <span className="text-sm font-medium">{item.name}</span>
            <p className="text-[10px] text-[#AFC8E6]/60">{item.description}</p>
          </div>
          {isActive && <ChevronRight size={14} className="text-[#1E90FF]" />}
        </>
      )}
    </motion.div>
  </Link>
);

// Layout principal
const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  const sidebarWidth = isSidebarCollapsed ? 'w-20' : 'w-64';
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('neumatiq_token');
    localStorage.removeItem('neumatiq_user');
    sessionStorage.removeItem('neumatiq_token');
    sessionStorage.removeItem('neumatiq_user');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-[#050c1a] to-[#0B1E3A] flex flex-col">
      {/* Title Bar - Estilo Windows/macOS */}
      <div className="flex-shrink-0 bg-[#050c1a]/95 backdrop-blur-md border-b border-[#1E90FF]/10 shadow-xl">
        <div className="h-12 flex items-center justify-between px-4">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-[#1E90FF] to-[#3B82F6] rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-sm">🛞</span>
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">NeumatiQ</span>
              <span className="text-[10px] text-[#AFC8E6]/50 border-l border-[#1E90FF]/20 pl-2 ml-1">Enterprise</span>
            </div>
          </div>
          
          {/* Barra de búsqueda central */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AFC8E6]/50" />
              <input 
                type="text" 
                placeholder="Buscar en toda la aplicación..." 
                className="w-full bg-white/5 border border-[#1E90FF]/15 rounded-lg py-1.5 pl-9 pr-3 text-sm text-[#EAF3FF] placeholder-[#AFC8E6]/40 focus:outline-none focus:border-[#1E90FF]/30 focus:bg-white/10 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-[#AFC8E6]/60">⌘</kbd>
                <kbd className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-[#AFC8E6]/60">K</kbd>
              </div>
            </div>
          </div>
          
          {/* Acciones de sistema */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg border border-[#1E90FF]/10">
              <Wifi size={12} className="text-emerald-400" />
              <Battery size={12} className="text-[#AFC8E6]" />
              <Volume2 size={12} className="text-[#AFC8E6]" />
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => window.location.reload()} className="p-1.5 rounded hover:bg-white/10 transition-colors">
                <RefreshCw size={12} className="text-[#AFC8E6]" />
              </button>
              <button onClick={toggleFullscreen} className="p-1.5 rounded hover:bg-white/10 transition-colors">
                {isFullscreen ? <Minimize2 size={12} className="text-[#AFC8E6]" /> : <Maximize2 size={12} className="text-[#AFC8E6]" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`flex-shrink-0 ${sidebarWidth} bg-gradient-to-b from-[#0B1E3A] to-[#050c1a] border-r border-[#1E90FF]/10 transition-all duration-300 ease-in-out shadow-2xl overflow-y-auto custom-scrollbar ${
          mobileMenuOpen ? 'fixed inset-y-0 left-0 z-30 translate-x-0' : 'hidden lg:block'
        }`}>
          <div className="sticky top-0 bg-gradient-to-b from-[#0B1E3A] to-[#050c1a] z-10">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center gap-2 mx-4 mt-3 mb-2 p-2 rounded-lg hover:bg-white/5 transition-all text-[#AFC8E6] hover:text-[#1E90FF] w-fit"
            >
              {isSidebarCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
              {!isSidebarCollapsed && <span className="text-xs">Colapsar menú</span>}
            </button>
          </div>
          
          <nav className="p-3 space-y-1">
            {NAVIGATION_CONFIG.map((item) => (
              <NavItem 
                key={item.path} 
                item={item} 
                isActive={location.pathname === item.path} 
                onClick={() => setMobileMenuOpen(false)}
                isSidebarCollapsed={isSidebarCollapsed}
              />
            ))}
            
            <div className="pt-4 mt-4 border-t border-[#1E90FF]/10">
              <div className="bg-gradient-to-r from-[#1E90FF]/5 to-[#3B82F6]/5 rounded-lg p-3 border border-[#1E90FF]/10">
                <div className="text-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#1E90FF] to-[#3B82F6] rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                    <LifeBuoy className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-[9px] font-semibold text-[#EAF3FF]">Soporte 24/7</p>
                  <p className="text-[7px] text-[#AFC8E6] mt-0.5">Asistencia prioritaria</p>
                </div>
              </div>
            </div>
          </nav>
        </aside>
        
        {/* Main Content - Con borde redondeado superior izquierdo */}
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="bg-gradient-to-br from-[#0B1E3A]/80 to-[#050c1a]/80 rounded-tl-3xl rounded-tr-xl rounded-br-xl rounded-bl-xl border border-[#1E90FF]/10 shadow-2xl min-h-full">
            <div className="p-5">
              <Suspense fallback={<PageLoader />}>
                {location.pathname === '/' && <Dashboard />}
                {location.pathname === '/products' && <Products />}
                {location.pathname === '/orders' && <Orders />}
                {location.pathname === '/customers' && <Customers />}
                {/* {location.pathname === '/logistica' && <Logistic />} */}
                {location.pathname === '/analytics' && <Analytics />}
                {location.pathname === '/assistant' && <AssistantPage />}
                {location.pathname === '/settings' && <SettingsPage />}
              </Suspense>
            </div>
          </div>
        </main>
      </div>
      
      {/* User Profile Dropdown - Fijo en esquina inferior derecha para fácil acceso */}
      <div className="fixed bottom-4 right-4 z-50">
        <UserProfile onLogout={handleLogout} />
      </div>
    </div>
  );
};

// Componente de Login (simplificado para este ejemplo)
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('neumatiq_token', 'demo_token');
      localStorage.setItem('neumatiq_user', JSON.stringify({ name: 'Admin' }));
      window.location.href = '/';
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050c1a] to-[#0B1E3A] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-8 w-full max-w-md border border-[#1E90FF]/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1E90FF] to-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-white text-2xl">🛞</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">NeumatiQ</h1>
          <p className="text-[#AFC8E6] text-sm mt-2">Sistema de Gestión Integral de Neumáticos</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Usuario</label>
            <input
              type="text"
              defaultValue="admin"
              className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Contraseña</label>
            <input
              type="password"
              defaultValue="admin123"
              className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar al sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};

// App principal
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen onComplete={() => setIsLoading(false)} minDuration={2000} />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
}

export default App;

{/* Estilos globales para scrollbar personalizado */}
<style jsx global>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(30, 144, 255, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(30, 144, 255, 0.4);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(30, 144, 255, 0.6);
  }
`}</style>