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
import NewHeader from './components/NewHeader.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import { login } from './services/api';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Products = lazy(() => import('./pages/Products.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const Customers = lazy(() => import('./pages/Customers.jsx'));
const AssistantPage = lazy(() => import('./pages/AssistantPage.jsx'));
const Logistic = lazy(() => import('./pages/Logistic.jsx'));
const Analytics = lazy(() => import('./pages/Analytics.jsx'));
const SettingsPage = lazy(() => import('./pages/Settings.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Notification = lazy(() => import('./pages/Notification.jsx'));

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
{ id: 'logistica', path: '/logistic', name: 'Logística', icon: Truck, description: 'Envíos y tracking' },
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [ checkingAuth, setCheckingAuth ] = useState(true);
    
    // Verificar autenticación al montar
    useEffect(() => {
        const token = localStorage.getItem('chvalue_token') || sessionStorage.getItem('chvalue_token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            window.location.href = '/login';
        }
        setCheckingAuth(false);
    }, []);
    
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
     localStorage.removeItem('chvalue_token');
     localStorage.removeItem('chvalue_user');
     sessionStorage.removeItem('chvalue_token');
     sessionStorage.removeItem('chvalue_user');
     setIsAuthenticated(false);
     window.location.href = '/login';
   };
   
   // Mientras verifica autenticación, mostrar loader
   if (checkingAuth) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-[#050c1a]">
         <RefreshCw className="w-8 h-8 animate-spin text-[#1E90FF]" />
       </div>
     );
   }
   
   if (!isAuthenticated) {
     return <Navigate to="/login" replace />;
   }
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050c1a] to-[#0B1E3A] flex flex-col">
      <NewHeader onLogout={handleLogout} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex">
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
{location.pathname === '/logistic' && <Logistic />}
                {location.pathname === '/analytics' && <Analytics />}
                {location.pathname === '/assistant' && <AssistantPage />}
                {location.pathname === '/settings' && <SettingsPage />}
                {location.pathname === '/profile' && <Profile />}
                {location.pathname === '/notifications' && <Notification />}
              </Suspense>
            </div>
          </div>
        </main>
      </div>
      
    </div>
  );
};

// Componente de Login (integrado con API real)
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await login(username, password);
      
      // Guardar token en localStorage
      localStorage.setItem('chvalue_token', response.token);
      localStorage.setItem('chvalue_user', JSON.stringify(response.user));
      
      // Redirigir al dashboard
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/assets/fONDO lOGIN.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-8 w-full max-w-md border border-[#1E90FF]/20 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-transparent rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-white/20 overflow-hidden">
            <img src="/assets/Logo_de_NeumatiQ-.png" alt="NeumatiQ Logo" className="w-full h-full object-contain" />
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
             <label htmlFor="username" className="block text-sm font-semibold text-[#AFC8E6] mb-1">Usuario</label>
             <input
               id="username"
               name="username"
               type="text"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
             />
           </div>
           <div>
             <label htmlFor="password" className="block text-sm font-semibold text-[#AFC8E6] mb-1">Contraseña</label>
             <input
               id="password"
               name="password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
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
    const hasVisitedBefore = localStorage.getItem('neumatiq_visited');
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!hasVisitedBefore) {
        localStorage.setItem('neumatiq_visited', 'true');
      }
    }, hasVisitedBefore ? 500 : 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    const hasVisitedBefore = localStorage.getItem('neumatiq_visited');
    return <SplashScreen onComplete={() => setIsLoading(false)} minDuration={hasVisitedBefore ? 500 : 2000} />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
}

export default App;