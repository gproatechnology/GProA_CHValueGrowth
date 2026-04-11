import React, { Suspense, lazy, useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LogOut, Menu, X, Home, Package, ShoppingCart, BarChart3, Settings, 
    Sparkles, ChevronRight, Users, Truck, LineChart, User, Circle,
    Bell, Search, LifeBuoy, Database, LayoutDashboard, TrendingUp,
    HelpCircle, Shield, Award, Zap, Activity, Target, ChevronLeft,
    Wifi, Battery, Volume2, VolumeX, RefreshCw, Maximize2, Minimize2,
    Boxes, Ship, Warehouse, ClipboardList, DollarSign, Percent,
    TrendingDown, AlertCircle, CheckCircle, Clock, Filter
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

// Lazy load pages - Actualizadas a nomenclatura logística
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Orders = lazy(() => import('./pages/Orders'));
const Analytics = lazy(() => import('./pages/Analytics'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const Customers = lazy(() => import('./pages/Customers'));
const Logistics = lazy(() => import('./pages/Logistics'));
const AssistantPage = lazy(() => import('./pages/AssistantPage'));

// Configuración de navegación - Enfoque logístico y comercial
const NAVIGATION_CONFIG = [
    { id: 'dashboard', path: '/', name: 'Dashboard', icon: LayoutDashboard, description: 'KPIs y métricas', section: 'main' },
    { id: 'inventario', path: '/inventario', name: 'Inventario', icon: Boxes, description: 'Stock y rotación', section: 'main', badge: 'En vivo' },
    { id: 'ordenes', path: '/ordenes', name: 'Órdenes', icon: ClipboardList, description: 'Gestión de pedidos', section: 'main' },
    { id: 'logistica', path: '/logistica', name: 'Logística', icon: Truck, description: 'Envíos y entregas', section: 'main' },
    { id: 'clientes', path: '/clientes', name: 'Clientes', icon: Users, description: 'Base de datos CRM', section: 'crm', badge: '+12' },
    { id: 'assistant', path: '/assistant', name: 'AI Assistant', icon: Sparkles, description: 'Análisis predictivo', section: 'analytics', badge: 'AI' },
    { id: 'analytics', path: '/analytics', name: 'Analytics', icon: TrendingUp, description: 'Márgenes y KPIs', section: 'analytics' },
    { id: 'configuracion', path: '/configuracion', name: 'Configuración', icon: Settings, description: 'Parámetros', section: 'system' },
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
    <div className="fixed inset-0 bg-gradient-to-br from-[#001529] to-[#0B1E3A] flex items-center justify-center z-50">
        <div className="text-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#1890FF]/30 border-t-[#1890FF] rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#1890FF] to-[#00D4FF] rounded-full animate-pulse"></div>
                </div>
            </div>
            <p className="text-[#AFC8E6] text-sm font-medium mt-4">Cargando NeumatiQ Enterprise...</p>
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
                <div className="min-h-screen bg-gradient-to-br from-[#001529] to-[#0B1E3A] flex items-center justify-center p-4">
                    <div className="bg-[#163A6B] rounded-2xl shadow-xl p-8 text-center max-w-md border border-[#1890FF]/20">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <p className="text-red-400 font-semibold mb-2">Error inesperado</p>
                        <p className="text-[#AFC8E6] text-sm mb-4">No pudimos cargar la página</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="bg-gradient-to-r from-[#1890FF] to-[#00D4FF] text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all"
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

// Componente de Búsqueda de Inventario - Mobile Optimized
const InventorySearch = ({ isMobile, onMobileSearchToggle, isSearchOpen }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (isMobile && !isSearchOpen) {
        return (
            <button 
                onClick={onMobileSearchToggle}
                className="p-2 rounded-lg bg-[#1890FF]/10 hover:bg-[#1890FF]/20 transition-all"
            >
                <Search size={18} className="text-[#1890FF]" />
            </button>
        );
    }

    return (
        <div className={`${isMobile ? 'absolute top-0 left-0 right-0 z-50 p-3 bg-[#001529] border-b border-[#1890FF]/20' : 'flex-1 max-w-2xl'}`}>
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AFC8E6]/50" />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por medida, modelo o SKU..." 
                    className="w-full bg-white/5 border border-[#1890FF]/20 rounded-xl py-2.5 pl-10 pr-20 text-sm text-[#EAF3FF] placeholder-[#AFC8E6]/40 focus:outline-none focus:border-[#1890FF]/40 focus:bg-white/10 transition-all"
                    autoFocus={isMobile}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <kbd className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-[#AFC8E6]/60 font-mono">⌘</kbd>
                    <kbd className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-[#AFC8E6]/60 font-mono">K</kbd>
                </div>
                {isMobile && (
                    <button 
                        onClick={onMobileSearchToggle}
                        className="absolute right-14 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
                    >
                        <X size={14} className="text-[#AFC8E6]" />
                    </button>
                )}
            </div>
        </div>
    );
};

// Componente de Estado Logístico - Indicadores visuales
const LogisticsStatus = () => {
    const statusItems = [
        { icon: Warehouse, label: 'Stock', value: '2,450', color: '#1890FF' },
        { icon: Truck, label: 'Envíos', value: '128', color: '#00D4FF' },
        { icon: Clock, label: 'Pendientes', value: '24', color: '#FAAD14' },
    ];

    return (
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-xl border border-[#1890FF]/10">
            {statusItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <item.icon size={14} style={{ color: item.color }} />
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-[#EAF3FF]">{item.value}</span>
                        <span className="text-[9px] text-[#AFC8E6]">{item.label}</span>
                    </div>
                    {idx < statusItems.length - 1 && <div className="w-px h-4 bg-[#1890FF]/20 mx-1" />}
                </div>
            ))}
        </div>
    );
};

// Componente de Sesión - Botones de Cerrar Sesión y Salir
const SessionControls = ({ onLogout, onExit, isMobile }) => {
    if (isMobile) {
        return null; // En móvil van dentro del perfil
    }

    return (
        <div className="flex items-center gap-2">
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1890FF]/10 hover:bg-[#1890FF]/20 transition-all border border-[#1890FF]/20 group"
            >
                <LogOut size={14} className="text-[#1890FF]" />
                <span className="text-xs font-medium text-[#1890FF] hidden lg:inline">Cerrar Sesión</span>
            </button>
            <button 
                onClick={onExit}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/20 group"
            >
                <X size={14} className="text-red-400" />
                <span className="text-xs font-medium text-red-400 hidden lg:inline">Salir</span>
            </button>
        </div>
    );
};

// Componente de Perfil de Usuario - Versión móvil con controles de sesión
const UserProfile = ({ onLogout, onExit, isMobile }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    if (isMobile) {
        return (
            <>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                    <User size={20} className="text-[#EAF3FF]" />
                </button>
                
                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 z-40"
                                onClick={() => setIsOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, x: '100%' }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: '100%' }}
                                className="fixed right-0 top-0 bottom-0 w-80 bg-[#0B1E3A] shadow-2xl z-50 border-l border-[#1890FF]/20"
                            >
                                <div className="p-4 border-b border-[#1890FF]/20 bg-gradient-to-r from-[#001529] to-[#0B1E3A]">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-[#EAF3FF]">Perfil</h3>
                                        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                                            <X size={20} className="text-[#AFC8E6]" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 bg-gradient-to-br from-[#1890FF] to-[#00D4FF] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                            {USER_DATA.avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#EAF3FF]">{USER_DATA.name}</p>
                                            <p className="text-xs text-[#AFC8E6]">{USER_DATA.email}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-xs text-green-400">Conectado</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 space-y-1">
                                    {[
                                        { icon: User, label: 'Mi perfil' },
                                        { icon: Bell, label: 'Notificaciones' },
                                        { icon: Settings, label: 'Preferencias' },
                                        { icon: Shield, label: 'Seguridad' },
                                    ].map((item, idx) => (
                                        <button key={idx} className="w-full text-left px-3 py-2.5 rounded-lg text-[#AFC8E6] hover:bg-[#1890FF]/10 transition-colors text-sm flex items-center gap-3">
                                            <item.icon size={16} /> {item.label}
                                        </button>
                                    ))}
                                    <div className="border-t border-[#1890FF]/20 my-2 pt-2">
                                        <button 
                                            onClick={onLogout}
                                            className="w-full text-left px-3 py-2.5 rounded-lg text-[#1890FF] hover:bg-[#1890FF]/10 transition-colors text-sm flex items-center gap-3"
                                        >
                                            <LogOut size={16} /> Cerrar Sesión
                                        </button>
                                        <button 
                                            onClick={onExit}
                                            className="w-full text-left px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm flex items-center gap-3"
                                        >
                                            <X size={16} /> Salir del Sistema
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        );
    }

    // Desktop version
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all group border border-[#1890FF]/10"
            >
                <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#1890FF] to-[#00D4FF] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {USER_DATA.avatar}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5">
                        <div className="relative">
                            <Circle className="w-3 h-3 text-green-500 fill-green-500" />
                            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                        </div>
                    </div>
                </div>
                <div className="hidden xl:block text-left">
                    <p className="text-sm font-semibold text-[#EAF3FF]">{USER_DATA.name.split(' ')[0]} {USER_DATA.name.split(' ')[1]}</p>
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-[#AFC8E6]">{USER_DATA.role}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#1890FF]/20 text-[#1890FF]">Admin</span>
                    </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-[#AFC8E6] transition-transform hidden xl:block ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-72 bg-[#102A4C] rounded-xl shadow-2xl border border-[#1890FF]/20 overflow-hidden z-30 backdrop-blur-xl"
                    >
                        <div className="p-4 border-b border-[#1890FF]/20 bg-gradient-to-r from-[#001529] to-[#102A4C]">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#1890FF] to-[#00D4FF] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
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
                                <button key={idx} className="w-full text-left px-3 py-2 rounded-lg text-[#AFC8E6] hover:bg-[#1890FF]/10 transition-colors text-sm flex items-center gap-2">
                                    <item.icon size={14} /> {item.label}
                                </button>
                            ))}
                            <div className="border-t border-[#1890FF]/20 my-1 pt-1">
                                <button 
                                    onClick={onLogout}
                                    className="w-full text-left px-3 py-2 rounded-lg text-[#1890FF] hover:bg-[#1890FF]/10 transition-colors text-sm flex items-center gap-2"
                                >
                                    <LogOut size={14} /> Cerrar Sesión
                                </button>
                                <button 
                                    onClick={onExit}
                                    className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm flex items-center gap-2"
                                >
                                    <X size={14} /> Salir del Sistema
                                </button>
                            </div>
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
                            ? 'bg-gradient-to-r from-[#1890FF]/15 to-[#00D4FF]/5 text-[#1890FF] border-l-2 border-[#1890FF] shadow-lg shadow-[#1890FF]/10' 
                            : 'text-[#AFC8E6] hover:bg-white/5 hover:text-[#EAF3FF]'
                    }`}
                >
                    <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-[#1890FF]/20' : ''}`}>
                        <item.icon size={18} />
                    </div>
                    {!isSidebarCollapsed && (
                        <>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{item.name}</span>
                                    {item.badge && (
                                        <span className="text-[8px] font-bold px-1.5 py-0.5 bg-[#1890FF] text-white rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-[#AFC8E6]/60">{item.description}</p>
                            </div>
                            {isActive && <ChevronRight size={14} className="text-[#1890FF]" />}
                        </>
                    )}
                </motion.div>
            </Link>
        </motion.div>
    );
};

// Main Layout - Estilo Enterprise Logistics
const MainLayout = ({ children, onLogout, onExit }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    // Detectar tamaño de pantalla
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

    const handleExit = () => {
        if (onExit) {
            onExit();
        } else {
            window.close();
            window.location.href = 'about:blank';
        }
    };

    return (
        <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-[#001529] to-[#0B1E3A] flex flex-col">
            {/* Title Bar - Estilo Enterprise */}
            <div className="flex-shrink-0 bg-[#001529]/95 backdrop-blur-md border-b border-[#1890FF]/10 shadow-xl">
                <div className="h-14 flex items-center justify-between px-4">
                    {/* Logo y branding */}
                    <div className="flex items-center gap-3">
                        {isMobile && (
                            <button 
                                onClick={() => setMobileMenuOpen(true)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-all lg:hidden"
                            >
                                <Menu size={20} className="text-[#EAF3FF]" />
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#1890FF] to-[#00D4FF] rounded-lg flex items-center justify-center shadow-md">
                                    <span className="text-white text-sm font-bold">🛞</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold text-base tracking-tight">NeumatiQ</span>
                                    <span className="text-[8px] font-bold px-1.5 py-0.5 bg-gradient-to-r from-[#1890FF] to-[#00D4FF] text-white rounded-full">Enterprise</span>
                                </div>
                                <span className="text-[8px] text-[#AFC8E6]/60">Logistics & Commerce</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Buscador de Inventario - Central */}
                    {!isMobile && <InventorySearch isMobile={false} />}
                    
                    {/* Panel de Control y Sesión */}
                    <div className="flex items-center gap-2">
                        {/* Indicadores de estado logístico */}
                        <LogisticsStatus />
                        
                        {/* Indicadores de sistema */}
                        <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-[#1890FF]/10">
                            <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] text-[#AFC8E6]">Sync</span>
                            </div>
                            <div className="w-px h-3 bg-[#1890FF]/20 mx-1" />
                            <Database size={10} className="text-[#1890FF]" />
                            <span className="text-[9px] text-[#AFC8E6]">Cloud</span>
                        </div>
                        
                        {/* Botones de ventana */}
                        <div className="hidden lg:flex items-center gap-1">
                            <button 
                                onClick={() => window.location.reload()}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                title="Sincronizar"
                            >
                                <RefreshCw size={12} className="text-[#AFC8E6]" />
                            </button>
                            <button 
                                onClick={toggleFullscreen}
                                className="p-1.5 rounded hover:bg-white/10 transition-colors"
                                title="Pantalla completa"
                            >
                                {isFullscreen ? <Minimize2 size={12} className="text-[#AFC8E6]" /> : <Maximize2 size={12} className="text-[#AFC8E6]" />}
                            </button>
                        </div>
                        
                        {/* Controles de sesión - Desktop */}
                        <SessionControls onLogout={onLogout} onExit={handleExit} isMobile={false} />
                        
                        {/* Perfil de usuario - Maneja móvil y desktop */}
                        <UserProfile onLogout={onLogout} onExit={handleExit} isMobile={isMobile} />
                    </div>
                </div>
                
                {/* Buscador móvil desplegable */}
                {isMobile && (
                    <InventorySearch 
                        isMobile={true} 
                        isSearchOpen={isMobileSearchOpen}
                        onMobileSearchToggle={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                    />
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Mobile Drawer */}
                <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-[#0B1E3A] to-[#001529] border-r border-[#1890FF]/10 transform transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:relative lg:w-auto'
                } ${sidebarWidth} hidden lg:block`}>
                    <div className="p-3">
                        <div className="flex items-center justify-between mb-4 lg:hidden">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#1890FF] to-[#00D4FF] rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm">🛞</span>
                                </div>
                                <span className="text-white font-bold">NeumatiQ</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded">
                                <X size={20} className="text-[#AFC8E6]" />
                            </button>
                        </div>
                        <nav className="space-y-3">
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
                                <div className="pt-3 mt-3 border-t border-[#1890FF]/10">
                                    <div className="bg-gradient-to-r from-[#1890FF]/5 to-[#00D4FF]/5 rounded-lg p-3 border border-[#1890FF]/10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-[#1890FF] to-[#00D4FF] rounded-lg flex items-center justify-center">
                                                <LifeBuoy className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-semibold text-[#EAF3FF]">Soporte 24/7</p>
                                                <p className="text-[7px] text-[#AFC8E6]">Asistencia prioritaria</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </nav>
                    </div>
                </aside>
                
                {/* Overlay para móvil */}
                {mobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Botón colapsar sidebar - Desktop */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden lg:flex absolute left-64 top-24 z-20 -ml-3 p-1.5 rounded-full bg-[#1890FF] shadow-lg hover:scale-110 transition-all"
                    style={{ left: isSidebarCollapsed ? '5rem' : '16rem' }}
                >
                    <ChevronLeft size={12} className={`text-white transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
                </button>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="bg-gradient-to-br from-[#0B1E3A]/80 to-[#001529]/80 rounded-tl-3xl rounded-tr-xl rounded-br-xl rounded-bl-xl border border-[#1890FF]/10 shadow-2xl min-h-full">
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
const ProtectedRoute = ({ children, onLogout, onExit }) => {
    const token = localStorage.getItem('chvalue_token') || sessionStorage.getItem('chvalue_token');
    if (!token) return <Navigate to="/login" replace />;
    return <MainLayout onLogout={onLogout} onExit={onExit}>{children}</MainLayout>;
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

    const handleExit = useCallback(() => {
        handleLogout();
        window.close();
        window.location.href = 'about:blank';
    }, [handleLogout]);

    const routes = useMemo(() => [
        { path: '/', component: Dashboard },
        { path: '/inventario', component: Inventory },
        { path: '/ordenes', component: Orders },
        { path: '/logistica', component: Logistics },
        { path: '/clientes', component: Customers },
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
                    <ProtectedRoute onLogout={handleLogout} onExit={handleExit}>
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
