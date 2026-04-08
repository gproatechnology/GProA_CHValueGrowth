import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, Home, Package, ShoppingCart, BarChart3, Settings } from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import Login from './pages/Login';

const queryClient = new QueryClient();

// Lazy load pages for better performance
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Products   = lazy(() => import('./pages/Products'));
const Orders     = lazy(() => import('./pages/Orders'));
const Analytics  = lazy(() => import('./pages/Analytics'));
const SettingsPage = lazy(() => import('./pages/Settings'));

// Loading fallback component
const PageLoader = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] to-[#0d0e11] flex items-center justify-center">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Cargando...</p>
        </div>
    </div>
);

// Simple error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMsg: '' };
    }
    static getDerivedStateFromError(error) { return { hasError: true, errorMsg: error?.message || '' }; }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] to-[#0d0e11] flex items-center justify-center p-4">
                    <div className="bg-red-900/20 backdrop-blur-md border border-red-500 rounded-2xl p-8 text-center max-w-md">
                        <p className="text-red-400 mb-2">Algo salió mal al cargar esta página.</p>
                        {this.state.errorMsg && <p className="text-red-300/60 text-xs mb-4 font-mono">{this.state.errorMsg}</p>}
                        <button onClick={() => window.location.reload()} className="bg-red-600/20 text-red-400 px-6 py-2 rounded-xl hover:bg-red-600/30 border border-red-500/30">
                            Reintentar
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// Main layout with sidebar and top bar — must be used INSIDE <Router>
const MainLayout = ({ children, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/',             name: 'Dashboard',     icon: Home },
        { path: '/productos',    name: 'Productos',     icon: Package },
        { path: '/ordenes',      name: 'Órdenes',       icon: ShoppingCart },
        { path: '/analytics',    name: 'Analytics',     icon: BarChart3 },
        { path: '/configuracion',name: 'Configuración', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] via-[#15171c] to-[#0d0e11] relative overflow-x-hidden">
            {/* Fondo animado global */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Top Bar */}
            <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#1a1b1e]/80 border-b border-gray-800/50 shadow-lg">
                <div className="h-16 flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-full bg-gray-800/60">
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-sm">🛞</span>
                            </div>
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold text-lg hidden sm:inline">CHValueGrowth</span>
                        </Link>
                    </div>
                    <button onClick={onLogout} className="p-2 rounded-full bg-gray-800/60 hover:text-red-400 transition flex items-center gap-2">
                        <LogOut size={18} />
                        <span className="hidden sm:inline text-sm">Salir</span>
                    </button>
                </div>
            </header>

            <div className="flex relative">
                {/* Sidebar */}
                <aside className={`fixed md:sticky top-16 left-0 z-20 w-64 min-h-[calc(100vh-4rem)] bg-[#1a1b1e]/90 backdrop-blur-md border-r border-gray-800/50 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map(item => (
                            <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                                <motion.div whileHover={{ x: 4 }} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${location.pathname === item.path ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border-l-2 border-blue-500' : 'hover:bg-white/5'}`}>
                                    <item.icon size={18} />
                                    <span className="text-sm font-medium">{item.name}</span>
                                </motion.div>
                            </Link>
                        ))}
                        <div className="pt-8 text-center text-[10px] text-gray-600 border-t border-gray-800 mt-4">
                            devoryn02 · 2026<br />#CHValueGrowth
                        </div>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-4 md:p-6 relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

// Protected route wrapper — must be used INSIDE <Router>
const ProtectedRoute = ({ children, onLogout }) => {
    const token = localStorage.getItem('chvalue_token') || sessionStorage.getItem('chvalue_token');
    if (!token) return <Navigate to="/login" replace />;
    return <MainLayout onLogout={onLogout}>{children}</MainLayout>;
};

// Inner app that lives inside <Router>
const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
    const handleLogout = () => {
        localStorage.removeItem('chvalue_token');
        localStorage.removeItem('chvalue_user');
        sessionStorage.removeItem('chvalue_token');
        sessionStorage.removeItem('chvalue_user');
        setIsAuthenticated(false);
    };

    return (
        <Routes>
            <Route path="/login" element={
                isAuthenticated
                    ? <Navigate to="/" replace />
                    : <Login onLogin={() => setIsAuthenticated(true)} />
            } />

            <Route path="/" element={
                <ProtectedRoute onLogout={handleLogout}>
                    <Suspense fallback={<PageLoader />}><Dashboard /></Suspense>
                </ProtectedRoute>
            } />
            <Route path="/productos" element={
                <ProtectedRoute onLogout={handleLogout}>
                    <Suspense fallback={<PageLoader />}><Products /></Suspense>
                </ProtectedRoute>
            } />
            <Route path="/ordenes" element={
                <ProtectedRoute onLogout={handleLogout}>
                    <Suspense fallback={<PageLoader />}><Orders /></Suspense>
                </ProtectedRoute>
            } />
            <Route path="/analytics" element={
                <ProtectedRoute onLogout={handleLogout}>
                    <Suspense fallback={<PageLoader />}><Analytics /></Suspense>
                </ProtectedRoute>
            } />
            <Route path="/configuracion" element={
                <ProtectedRoute onLogout={handleLogout}>
                    <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>
                </ProtectedRoute>
            } />
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

        // Splash screen duration
        const timer = setTimeout(() => setIsLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <SplashScreen onComplete={() => setIsLoading(false)} minDuration={2500} />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <AppRoutes
                        isAuthenticated={isAuthenticated}
                        setIsAuthenticated={setIsAuthenticated}
                    />
                </Router>
            </ErrorBoundary>
        </QueryClientProvider>
    );
}

export default App;