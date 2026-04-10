import React, { Suspense, lazy, useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LogOut, Menu, X, Home, Package, ShoppingCart, BarChart3, Settings, 
    Sparkles, ChevronRight, Users, Truck, LineChart, User, Circle,
    Bell, Search, LifeBuoy, Database, LayoutDashboard, TrendingUp,
    HelpCircle, Shield, Award, Zap, Activity, Target, ChevronLeft,
    Wifi, Battery, Volume2, VolumeX, RefreshCw, Maximize2, Minimize2
} from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';

// Configuración de React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

// Contexts
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const Orders = lazy(() => import('./pages/Orders'));
const Analytics = lazy(() => import('./pages/Analytics'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const Customers = lazy(() => import('./pages/Customers'));
const Telemetry = lazy(() => import('./pages/Telemetry'));
const AssistantPage = lazy(() => import('./pages/AssistantPage'));

// Configuración de navegación
const NAVIGATION_CONFIG = [
    { id: 'dashboard', path: '/', name: 'Dashboard', icon: LayoutDashboard, description: 'Visión general', section: 'main' },
    { id: 'catalogo', path: '/productos', name: 'Catálogo', icon: Package, description: 'Gestión de inventario', section: 'main' },
    { id: 'ordenes', path: '/ordenes', name: 'Órdenes', icon: ShoppingCart, description: 'Seguimiento de pedidos', section: 'main' },
    { id: 'clientes', path: '/clientes', name: 'Clientes', icon: Users, description: 'Base de datos', section: 'crm', badge: 'Nuevo' },
    { id: 'telemetria', path: '/telemetria', name: 'Telemetría', icon: Activity, description: 'Métricas del sistema', section: 'analytics' },
    { id: 'assistant', path: '/assistant', name: 'AI Assistant', icon: Sparkles, description: 'Análisis inteligente', section: 'analytics', badge: 'AI' },
    { id: 'analytics', path: '/analytics', name: 'Analytics', icon: TrendingUp, description: 'Métricas y KPIs', section: 'analytics' },
    { id: 'configuracion', path: '/configuracion', name: 'Configuración', icon: Settings, description: 'Preferencias', section: 'system' },
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
            <p className="text-[#AFC8E6] text-sm font-medium mt-4">Iniciando NeumatiQ Enterprise...</p>
        </div>
    </div>
);

// Error Boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMsg: '' };
    }
    static getDerivedStateFromError(error) { 
        return { hasError: true, errorMsg: error?.message || '' }; 
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-[#050c1a] to-[#0B1E3A] flex items-center justify-center p-4">
                    <div className="bg-[#163A6B] rounded-2xl shadow-xl p-8 text-center max-w-md border border-[#1E90FF]/20">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <p className="text-red-400 font-semibold mb-2">Error inesperado</p>
                        <p className="text-[#AFC8E6] text-sm mb-4">No pudimos cargar la página</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// Componente de Perfil de Usuario - Estilo Desktop
const UserProfile = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="relative">
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
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-[#102A4C] rounded-xl shadow-2xl border border-[#1E90FF]/20 overflow-hidden z-30 backdrop-blur-xl"
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
                            {[
                                { icon: User, label: 'Mi perfil' },
                                { icon: Bell, label: 'Notificaciones' },
                                { icon: Settings, label: 'Preferencias' },
                            ].map((item, idx) => (
                                <button key={idx} className="w-full text-left px-3 py-2 rounded-lg text-[#AFC8E6] hover:bg-[#1E4D7A] transition-colors text-sm flex items-center gap-2">
                                    <item.icon size={14} /> {item.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Componente de Navegación - Estilo Desktop
const NavItem = ({ item, index, setMobileMenuOpen, isSidebarCollapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === item.path;
    
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Link to={item.path} onClick={() => setMobileMenuOpen(false)}>
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
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{item.name}</span>
                                    {item.badge && (
                                        <span className="text-[8px] font-bold px-1.5 py-0.5 bg-[#1E90FF] text-white rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-[#AFC8E6]/60">{item.description}</p>
                            </div>
                            {isActive && <ChevronRight size={14} className="text-[#1E90FF]" />}
                        </>
                    )}
                </motion.div>
            </Link>
        </motion.div>
    );
};

// Main Layout - Estilo Desktop Enterprise
const MainLayout = ({ children, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const location = useLocation();

    const menuGroups = useMemo(() => ({
        main: NAVIGATION_CONFIG.filter(item => item.section === 'main'),
        crm: NAVIGATION_CONFIG.filter(item => item.section === 'crm'),
        analytics: NAVIGATION_CONFIG.filter(item => item.section === 'analytics'),
        system: NAVIGATION_CONFIG.filter(item => item.section === 'system'),
    }), []);

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
                        {/* Indicadores de sistema */}
                        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg border border-[#1E90FF]/10">
                            <Wifi size={12} className="text-emerald-400" />
                            <Battery size={12} className="text-[#AFC8E6]" />
                            <Volume2 size={12} className="text-[#AFC8E6]" />
                        </div>
                        
                        {/* Botones de ventana */}
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => window.location.reload()}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                            >
                                <RefreshCw size={12} className="text-[#AFC8E6]" />
                            </button>
                            <button 
                                onClick={toggleFullscreen}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                            >
                                {isFullscreen ? <Minimize2 size={12} className="text-[#AFC8E6]" /> : <Maximize2 size={12} className="text-[#AFC8E6]" />}
                            </button>
                            <button 
                                onClick={onLogout}
                                className="p-1.5 rounded hover:bg-red-500/20 transition-colors ml-1"
                            >
                                <X size={12} className="text-[#AFC8E6] hover:text-red-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Estilo Desktop */}
                <aside className={`flex-shrink-0 ${sidebarWidth} bg-gradient-to-b from-[#0B1E3A] to-[#050c1a] border-r border-[#1E90FF]/10 transition-all duration-300 ease-in-out shadow-2xl overflow-y-auto custom-scrollbar ${
                    mobileMenuOpen ? 'fixed inset-y-0 left-0 z-30 translate-x-0' : 'hidden lg:block'
                }`}>
                    <nav className="p-3 space-y-3">
                        {Object.entries(menuGroups).map(([group, items]) => items.length > 0 && (
                            <div key={group}>
                                {!isSidebarCollapsed && (
                                    <p className="text-[9px] font-semibold text-[#AFC8E6]/40 uppercase tracking-wider px-3 mb-1">
                                        {group === 'main' ? 'Principal' : group === 'crm' ? 'Clientes' : group === 'analytics' ? 'Analytics' : 'Sistema'}
                                    </p>
                                )}
                                {items.map((item, index) => (
                                    <NavItem key={item.path} item={item} index={index} setMobileMenuOpen={setMobileMenuOpen} isSidebarCollapsed={isSidebarCollapsed} />
                                ))}
                            </div>
                        ))}
                        
                        {!isSidebarCollapsed && (
                            <div className="pt-3 mt-3 border-t border-[#1E90FF]/10">
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
                        )}
                    </nav>
                </aside>

                {/* Main Content - Con borde redondeado superior izquierdo */}
                <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="bg-gradient-to-br from-[#0B1E3A]/80 to-[#050c1a]/80 rounded-tl-3xl rounded-tr-xl rounded-br-xl rounded-bl-xl border border-[#1E90FF]/10 shadow-2xl min-h-full">
                        <div className="p-5">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    {children}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Protected route wrapper
const ProtectedRoute = ({ children, onLogout }) => {
    const token = localStorage.getItem('chvalue_token') || sessionStorage.getItem('chvalue_token');
    if (!token) return <Navigate to="/login" replace />;
    return <MainLayout onLogout={onLogout}>{children}</MainLayout>;
};

// App Routes
const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
    const handleLogout = useCallback(() => {
        localStorage.removeItem('chvalue_token');
        localStorage.removeItem('chvalue_user');
        sessionStorage.removeItem('chvalue_token');
        sessionStorage.removeItem('chvalue_user');
        setIsAuthenticated(false);
    }, [setIsAuthenticated]);

    const routes = useMemo(() => [
        { path: '/', component: Dashboard },
        { path: '/productos', component: Products },
        { path: '/ordenes', component: Orders },
        { path: '/clientes', component: Customers },
        { path: '/telemetria', component: Telemetry },
{ path: '/assistant', component: AssistantPage },
        { path: '/analytics', component: Analytics },
        { path: '/configuracion', component: SettingsPage },
    ], []);

    return (
        <Routes>
            <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={() => setIsAuthenticated(true)} />
            } />
            {routes.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={
                    <ProtectedRoute onLogout={handleLogout}>
                        <Suspense fallback={<PageLoader />}><Component /></Suspense>
                    </ProtectedRoute>
                } />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

// Main App component
function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('chvalue_token') || sessionStorage.getItem('chvalue_token');
        if (token) setIsAuthenticated(true);
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <SplashScreen onComplete={() => setIsLoading(false)} minDuration={2000} />;

    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
                        <AppRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                    </AuthContext.Provider>
                </Router>
            </ErrorBoundary>
        </QueryClientProvider>
    );
}

export default App;