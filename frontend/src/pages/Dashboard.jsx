import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    TrendingUp, TrendingDown, DollarSign, ShoppingCart,
    Package, Zap, Shield, RefreshCw, Download, Filter
} from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import CircularProgress from '../components/CircularProgress';
// Settings loaded lazily to avoid heavy upfront import
const SettingsInline = lazy(() => import('./Settings'));
// import { getProducts } from '../services/api'; // Para integración real

// --------------------------------------------------------------
// 1. Datos estáticos (mock para demo)
// --------------------------------------------------------------
const BRANDS = [
    'Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Pirelli',
    'Hankook', 'Yokohama', 'Dunlop', 'Cooper', 'BFGoodrich'
];

const SIZES = [
    '205/55 R16', '195/65 R15', '225/45 R17', '215/60 R16', '235/55 R17',
    '205/50 R17', '245/40 R18', '255/35 R19', '225/55 R18', '265/70 R16'
];

const SOURCES = {
    ml: { name: 'MercadoLibre', isOfficialOnly: false },
    radial: { name: 'Radial Llantas', isOfficialOnly: true },
    serna: { name: 'Serna', isOfficialOnly: true },
    contishop: { name: 'ContiShop', isOfficialOnly: true }
};

// Generador de precios (mismo algoritmo)
const generatePrice = (brand, size, sourceKey) => {
    const basePrice = { Michelin: 2800, Bridgestone: 2600, Goodyear: 2400, Continental: 2700, Pirelli: 2650, Hankook: 2100, Yokohama: 2250, Dunlop: 2050, Cooper: 1950, BFGoodrich: 2300 }[brand] || 2200;
    const sizeMultiplier = { '205/55 R16': 1.0, '195/65 R15': 0.9, '225/45 R17': 1.1, '215/60 R16': 1.05, '235/55 R17': 1.15, '205/50 R17': 1.02, '245/40 R18': 1.25, '255/35 R19': 1.35, '225/55 R18': 1.2, '265/70 R16': 1.3 }[size] || 1.0;
    let finalPrice = basePrice * sizeMultiplier;
    if (sourceKey === 'ml') finalPrice *= 1.12;
    if (sourceKey === 'radial') finalPrice *= 0.95;
    if (sourceKey === 'serna') finalPrice *= 0.98;
    if (sourceKey === 'contishop') finalPrice *= 1.02;
    return Math.round(finalPrice / 10) * 10;
};

const buildMockData = () => {
    const data = [];
    let id = 1;
    for (const brand of BRANDS) {
        for (const size of SIZES) {
            for (const [sourceKey, sourceInfo] of Object.entries(SOURCES)) {
                data.push({
                    id: id++,
                    brand,
                    size,
                    source: sourceKey,
                    sourceName: sourceInfo.name,
                    price: generatePrice(brand, size, sourceKey),
                    isOfficial: sourceInfo.isOfficialOnly,
                    stock: Math.random() > 0.2 ? 'High' : 'Low',
                    scrapedAt: new Date().toISOString(),
                    model: `${brand} ${size.replace(/\s/g, '')}`
                });
            }
        }
    }
    return data;
};

const getScraperStatus = () => Object.entries(SOURCES).map(([key, source]) => ({
    name: source.name,
    status: Math.random() > 0.2 ? 'connected' : 'disconnected',
    lastSync: `${Math.floor(Math.random() * 10) + 1} min ago`,
    records: Math.floor(Math.random() * 200) + 20
}));

const trendData = [
    { date: '03/21', avgPrice: 2350, volume: 42 },
    { date: '03/22', avgPrice: 2380, volume: 45 },
    { date: '03/23', avgPrice: 2400, volume: 48 },
    { date: '03/24', avgPrice: 2390, volume: 52 },
    { date: '03/25', avgPrice: 2420, volume: 55 },
    { date: '03/26', avgPrice: 2450, volume: 58 },
    { date: '03/27', avgPrice: 2480, volume: 62 },
];

// --------------------------------------------------------------
// 2. Componente principal
// --------------------------------------------------------------
const Dashboard = () => {
    const [activeMenu, setActiveMenu] = useState('resumen');
    const [tireData, setTireData] = useState([]);
    const [scraperStatus, setScraperStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterOfficial, setFilterOfficial] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Cargar datos (simulado o real)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Simular delay de red
                await new Promise(resolve => setTimeout(resolve, 800));
                // Para API real: const products = await getProducts();
                const mockData = buildMockData();
                setTireData(mockData);
                setScraperStatus(getScraperStatus());
                setLastUpdated(new Date());
                setError(null);
            } catch (err) {
                setError('Error al cargar los datos del dashboard');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Agregación de productos (marca+medida)
    const aggregatedProducts = useMemo(() => {
        const map = new Map();
        tireData.forEach(item => {
            const key = `${item.brand}|${item.size}`;
            if (!map.has(key)) map.set(key, { brand: item.brand, size: item.size, prices: {}, hasStock: item.stock === 'High' });
            const product = map.get(key);
            product.prices[item.source] = item.price;
            if (item.stock === 'High') product.hasStock = true;
        });
        return Array.from(map.values()).map(product => {
            const mlPrice = product.prices.ml || Infinity;
            const directPrices = [product.prices.radial, product.prices.serna, product.prices.contishop].filter(p => p !== Infinity);
            const bestDirectPrice = directPrices.length ? Math.min(...directPrices) : Infinity;
            const bestSource = bestDirectPrice === product.prices.radial ? 'Radial Llantas' : bestDirectPrice === product.prices.serna ? 'Serna' : 'ContiShop';
            const savings = (mlPrice !== Infinity && bestDirectPrice !== Infinity) ? mlPrice - bestDirectPrice : 0;
            return { ...product, mlPrice: mlPrice !== Infinity ? mlPrice : null, bestDirectPrice: bestDirectPrice !== Infinity ? bestDirectPrice : null, bestSource, savings, hasStock: product.hasStock };
        }).filter(p => p.mlPrice && p.bestDirectPrice);
    }, [tireData]);

    // Métricas globales
    const filteredProducts = useMemo(() => filterOfficial ? aggregatedProducts.filter(p => ['Radial Llantas', 'Serna', 'ContiShop'].includes(p.bestSource)) : aggregatedProducts, [aggregatedProducts, filterOfficial]);
    const metrics = useMemo(() => {
        if (!filteredProducts.length) return null;
        const totalProducts = filteredProducts.length;
        const avgMl = filteredProducts.reduce((sum, p) => sum + p.mlPrice, 0) / totalProducts;
        const avgBest = filteredProducts.reduce((sum, p) => sum + p.bestDirectPrice, 0) / totalProducts;
        const totalSavings = filteredProducts.reduce((sum, p) => sum + p.savings, 0);
        const coverage = (totalProducts / (BRANDS.length * SIZES.length)) * 100;
        return { totalProducts, avgMl, avgBest, totalSavings, coverage };
    }, [filteredProducts]);

    // Top oportunidades
    const topArbitrage = useMemo(() => [...aggregatedProducts].sort((a, b) => b.savings - a.savings).slice(0, 3).map(p => ({ name: `${p.brand} ${p.size}`, direct: { source: p.bestSource, price: p.bestDirectPrice }, marketplace: { source: 'MercadoLibre', price: p.mlPrice }, arbitrage: p.savings })), [aggregatedProducts]);

    // Matriz de cobertura
    const coverageMatrix = useMemo(() => {
        const matrix = {};
        BRANDS.forEach(brand => {
            matrix[brand] = {};
            SIZES.forEach(size => {
                const product = aggregatedProducts.find(p => p.brand === brand && p.size === size);
                matrix[brand][size] = product ? { exists: true, savings: product.savings } : { exists: false, savings: 0 };
            });
        });
        return matrix;
    }, [aggregatedProducts]);

    // Exportar CSV
    const exportCurrentView = useCallback(() => {
        let dataToExport = [];
        switch (activeMenu) {
            case 'resumen':
                dataToExport = topArbitrage.map(item => ({ Producto: item.name, 'Precio Directo': item.direct.price, Fuente: item.direct.source, 'Precio ML': item.marketplace.price, Ahorro: item.arbitrage }));
                break;
            case 'medidas':
                dataToExport = SIZES.map(size => {
                    const productsInSize = aggregatedProducts.filter(p => p.size === size);
                    const avgPrice = productsInSize.reduce((s, p) => s + p.mlPrice, 0) / (productsInSize.length || 1);
                    return { Medida: size, 'Cantidad de Productos': productsInSize.length, 'Precio ML Promedio': Math.round(avgPrice) };
                });
                break;
            case 'marcas':
                dataToExport = BRANDS.map(brand => {
                    const productsInBrand = aggregatedProducts.filter(p => p.brand === brand);
                    const avgPrice = productsInBrand.reduce((s, p) => s + p.mlPrice, 0) / (productsInBrand.length || 1);
                    return { Marca: brand, 'Cantidad de Productos': productsInBrand.length, 'Precio ML Promedio': Math.round(avgPrice) };
                });
                break;
            case 'fuentes':
                dataToExport = scraperStatus;
                break;
            default: dataToExport = [{ message: 'No hay datos exportables' }];
        }
        const headers = Object.keys(dataToExport[0] || {});
        const escapeCSV = (value) => typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n')) ? `"${value.replace(/"/g, '""')}"` : value;
        const rows = dataToExport.map(item => headers.map(h => escapeCSV(item[h])));
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `${activeMenu}_${new Date().toISOString().slice(0, 19)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [activeMenu, topArbitrage, aggregatedProducts, scraperStatus]);

    // Estados de carga y error
    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;

    // Renderizado de vistas
    const renderContent = () => {
        switch (activeMenu) {
            case 'resumen': return <ResumenView metrics={metrics} topArbitrage={topArbitrage} quantity={quantity} coverageMatrix={coverageMatrix} scraperStatus={scraperStatus} />;
            case 'medidas': return <MedidasView aggregatedProducts={aggregatedProducts} />;
            case 'marcas': return <MarcasView aggregatedProducts={aggregatedProducts} />;
            case 'fuentes': return <FuentesView scraperStatus={scraperStatus} />;
            case 'alertas': return <AlertasView />;
            case 'settings': return <Suspense fallback={<div className="text-gray-400 p-8 text-center">Cargando configuración...</div>}><SettingsInline /></Suspense>;
            default: return <div>Selecciona una opción</div>;
        }
    };

    return (
        <div className="space-y-6 text-gray-300">
            {/* Submenú interno del Dashboard */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'resumen',  icon: '📊', text: 'Resumen' },
                    { id: 'medidas',  icon: '📏', text: 'Medidas' },
                    { id: 'marcas',   icon: '🏷️', text: 'Marcas' },
                    { id: 'fuentes',  icon: '📡', text: 'Fuentes' },
                    { id: 'alertas',  icon: '🔔', text: 'Alertas' },
                    { id: 'settings', icon: '⚙️', text: 'Config' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveMenu(item.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            activeMenu === item.id
                                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-transparent'
                        }`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                    </button>
                ))}
            </div>

            {/* Filtros globales */}
            {(activeMenu === 'resumen' || activeMenu === 'medidas' || activeMenu === 'marcas') && (
                <GlobalFilters filterOfficial={filterOfficial} setFilterOfficial={setFilterOfficial} quantity={quantity} setQuantity={setQuantity} exportCurrentView={exportCurrentView} />
            )}

            {/* Contenido de la vista activa */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeMenu}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>

            <Footer lastUpdated={lastUpdated} />
        </div>
    );
};

// --------------------------------------------------------------
// 3. Subcomponentes para mejor organización
// --------------------------------------------------------------
const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] to-[#0d0e11] flex items-center justify-center">
        <div className="text-center">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full animate-ping"></div>
                </div>
            </div>
            <p className="text-gray-400 font-mono text-sm">Cargando inteligencia de mercado...</p>
        </div>
    </div>
);

const ErrorScreen = ({ error, onRetry }) => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] to-[#0d0e11] flex items-center justify-center">
        <div className="bg-red-900/20 backdrop-blur-md border border-red-500 rounded-2xl p-8 text-center max-w-md">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={onRetry} className="neumorph-btn bg-red-600/20 text-red-400 px-6 py-2 rounded-xl hover:bg-red-600/30 transition">Reintentar</button>
        </div>
    </div>
);

const AnimatedBackground = () => (
    <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBmaWxsPSJub25lIiBzdHJva2U9IiMyZjMxMzgiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] bg-repeat opacity-20"></div>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
    </div>
);

const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#1a1b1e]/80 border-b border-gray-800/50 shadow-lg">
        <div className="h-16 flex items-center justify-between px-4 md:px-6">
            <div className="text-white font-bold text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-sm">🛞</span>
                </div>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CHValueGrowth</span>
                <span className="text-xs text-gray-500 hidden md:inline">| Sistema de Inteligencia de Mercado</span>
            </div>
            <div className="flex items-center space-x-3">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-full bg-[#1a1b1e] shadow-neumorph-inset">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <div className="hidden md:flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-[#1a1b1e] shadow-neumorph-inset cursor-pointer hover:text-white transition">👤</div>
                    <div className="p-2 rounded-full bg-[#1a1b1e] shadow-neumorph-inset cursor-pointer hover:text-white transition">🔔</div>
                    <div className="p-2 rounded-full bg-[#1a1b1e] shadow-neumorph-inset cursor-pointer hover:text-white transition">🚪</div>
                </div>
            </div>
        </div>
    </header>
);

const Sidebar = ({ activeMenu, setActiveMenu, mobileMenuOpen, setMobileMenuOpen }) => {
    const menuItems = [
        { id: 'resumen', icon: '📊', text: 'Resumen Ejecutivo' },
        { id: 'medidas', icon: '📏', text: 'Explorador de Medidas' },
        { id: 'marcas', icon: '🏷️', text: 'Análisis de Marcas' },
        { id: 'fuentes', icon: '📡', text: 'Fuentes Externas' },
        { id: 'alertas', icon: '🔔', text: 'Alertas de Precio' },
        { id: 'settings', icon: '⚙️', text: 'Configuración' }
    ];
    return (
        <aside className={`fixed md:sticky top-16 left-0 z-20 w-64 min-h-[calc(100vh-4rem)] bg-[#1a1b1e]/90 backdrop-blur-md border-r border-gray-800/50 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="p-4 space-y-2">
                {menuItems.map(item => (
                    <button key={item.id} onClick={() => { setActiveMenu(item.id); setMobileMenuOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${activeMenu === item.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 shadow-neumorph-inset text-blue-400 border-l-2 border-blue-500' : 'hover:bg-white/5 hover:shadow-neumorph-inset'}`}>
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium">{item.text}</span>
                    </button>
                ))}
                <div className="pt-8 text-center text-[10px] text-gray-600 border-t border-gray-800 mt-4">devoryn02 · 2026<br />#CHValueGrowth</div>
            </div>
        </aside>
    );
};

const GlobalFilters = ({ filterOfficial, setFilterOfficial, quantity, setQuantity, exportCurrentView }) => (
    <div className="rounded-2xl p-4 bg-[#1a1b1e]/70 backdrop-blur-sm shadow-neumorph-outset flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm">Solo Tiendas Oficiales</span>
                <button onClick={() => setFilterOfficial(!filterOfficial)} className={`w-11 h-6 rounded-full transition-all shadow-neumorph-inset ${filterOfficial ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${filterOfficial ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm">Cantidad:</span>
                <div className="flex gap-1">
                    {[1, 2, 4].map(q => (
                        <button key={q} onClick={() => setQuantity(q)} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${quantity === q ? 'bg-blue-600/30 shadow-neumorph-inset text-blue-400' : 'bg-[#1a1b1e] shadow-neumorph-outset'}`}>
                            {q === 1 ? 'Unidad' : q === 2 ? 'Par (2)' : 'Juego (4)'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        <button onClick={exportCurrentView} className="px-4 py-2 rounded-xl bg-[#1a1b1e] shadow-neumorph-outset hover:shadow-neumorph-inset transition text-sm flex items-center gap-2">
            <Download size={14} /> Exportar CSV
        </button>
    </div>
);

const Footer = ({ lastUpdated }) => (
    <div className="text-center text-[10px] text-gray-600 py-4 border-t border-gray-800/50">
        CHValueGrowth v1.0 · Pipeline de datos en tiempo real · {lastUpdated && `Última actualización: ${lastUpdated.toLocaleString()}`}
    </div>
);

// Vistas principales (extraídas para claridad)
const ResumenView = ({ metrics, topArbitrage, quantity, coverageMatrix, scraperStatus }) => (
    <div className="space-y-6">
        {/* KPIs */}
        {metrics && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: 'Cobertura de mercado', value: metrics.coverage, suffix: '%', color: 'blue', icon: <TrendingUp size={20} /> },
                    { label: 'Precio Promedio ML', value: metrics.avgMl, prefix: '$', color: 'orange', icon: <DollarSign size={20} /> },
                    { label: 'Mejor Precio Directo', value: metrics.avgBest, prefix: '$', color: 'green', icon: <Package size={20} /> },
                    { label: 'Ahorro Total', value: metrics.totalSavings, prefix: '$', color: 'purple', icon: <Zap size={20} /> }
                ].map((item, idx) => (
                    <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: 1.02, y: -5 }} className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset group">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10"><CircularProgress value={item.suffix ? metrics.coverage : 75} size={80} color={`#${item.color === 'blue' ? '3b82f6' : item.color === 'orange' ? 'f59e0b' : item.color === 'green' ? '10b981' : '8b5cf6'}`} /></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2"><p className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>{item.icon}</div>
                            <p className="text-3xl font-bold text-white mb-1">{item.prefix}<AnimatedCounter value={item.value} decimals={item.suffix ? 1 : 0} />{item.suffix}</p>
                            {item.label === 'Cobertura de mercado' && <p className="text-[10px] text-gray-500">{metrics.totalProducts} de {BRANDS.length * SIZES.length} productos</p>}
                        </div>
                        <div className={`absolute bottom-0 left-0 h-1 bg-${item.color}-500/50 transition-all duration-500 group-hover:h-1.5`} style={{ width: `${item.suffix ? metrics.coverage : 100}%` }}></div>
                    </motion.div>
                ))}
            </motion.div>
        )}

        {/* Gráfica de tendencia */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><TrendingUp size={18} /> Tendencia de Precios (últimos 7 días)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                    <defs><linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2f36" />
                    <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9ca3af" tickFormatter={(v) => `$${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1b1e', border: 'none', borderRadius: '0.75rem' }} formatter={(v) => `$${v}`} />
                    <Legend />
                    <Area type="monotone" dataKey="avgPrice" stroke="#3b82f6" fill="url(#priceGradient)" name="Precio Promedio (MXN)" strokeWidth={2} />
                    <Line type="monotone" dataKey="volume" stroke="#f59e0b" name="Volumen de ventas" strokeWidth={2} dot={{ r: 4 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>

        {/* Scrapers */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><Shield size={18} /> Estado de Scrapers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {scraperStatus.map((scraper, idx) => (
                    <motion.div key={scraper.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="rounded-xl p-4 bg-[#1a1b1e] shadow-neumorph-inset group hover:shadow-neumorph-outset transition-all duration-300">
                        <div className="flex items-center justify-between mb-3"><span className="font-semibold text-white text-sm">{scraper.name}</span><div className="relative"><div className={`w-3 h-3 rounded-full ${scraper.status === 'connected' ? 'bg-green-500' : 'bg-red-500'} shadow-lg`}></div>{scraper.status === 'connected' && <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>}</div></div>
                        <div className="space-y-1 text-xs text-gray-400"><div>Última sincro: {scraper.lastSync}</div><div className="flex items-center gap-1"><span>Registros:</span><span className="font-mono text-blue-400 font-semibold"><AnimatedCounter value={scraper.records} /></span></div></div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Matriz de cobertura */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">🗺️ Matriz de Cobertura (Heatmap)</h3>
            <table className="min-w-[800px] w-full">
                <thead><tr><th className="p-2 text-left text-xs text-gray-400 sticky left-0 bg-[#1f2125]">Marca / Medida</th>{SIZES.map(size => <th key={size} className="p-2 text-center text-[11px] text-gray-400">{size}</th>)}</tr></thead>
                <tbody>{BRANDS.map(brand => (<tr key={brand}><td className="p-2 font-medium text-white text-sm sticky left-0 bg-[#1f2125] z-10">{brand}</td>{SIZES.map(size => { const cell = coverageMatrix[brand]?.[size]; const exists = cell?.exists; const savings = cell?.savings || 0; const intensity = exists ? Math.min(0.3 + (savings / 1000) * 0.5, 0.8) : 0.1; return (<td key={`${brand}-${size}`} className="p-2"><div className="w-9 h-9 rounded-lg mx-auto transition-all duration-200 hover:scale-110 cursor-help" style={{ backgroundColor: exists ? `rgba(59, 130, 246, ${intensity})` : 'rgba(239, 68, 68, 0.15)', boxShadow: exists ? 'inset 0 0 0 1px rgba(59,130,246,0.3)' : 'none' }} title={exists ? `Ahorro potencial: $${savings} MXN` : 'Sin cobertura'}></div></td>); })}</tr>))}</tbody>
            </table>
            <div className="flex justify-end mt-3 gap-4 text-xs"><div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500/30 rounded"></div><span className="text-gray-400">Con datos</span></div><div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500/20 rounded"></div><span className="text-gray-400">Sin datos</span></div></div>
        </div>

        {/* Oportunidades */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">💰 Top Oportunidades de Arbitraje</h3>
            <div className="space-y-4">{topArbitrage.map((item, idx) => (<motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="rounded-xl p-4 bg-[#1a1b1e] shadow-neumorph-inset"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3"><span className="font-medium text-white">{item.name}</span><span className="text-red-400 font-bold text-sm bg-red-500/10 px-3 py-1 rounded-full">Ahorro: +${item.arbitrage * quantity} MXN</span></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10"><div className="text-xs text-gray-400">Mejor Precio Directo</div><div className="font-bold text-green-400 text-lg">${(item.direct.price * quantity).toLocaleString()} MXN</div><div className="text-[10px] text-gray-500">{item.direct.source}</div></div><div className="text-center p-3 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10"><div className="text-xs text-gray-400">Mercado Libre</div><div className="font-bold text-yellow-400 text-lg">${(item.marketplace.price * quantity).toLocaleString()} MXN</div><div className="text-[10px] text-gray-500">{item.marketplace.source}</div></div></div></motion.div>))}</div>
        </div>
    </div>
);

const MedidasView = ({ aggregatedProducts }) => (
    <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
        <h3 className="text-lg font-semibold mb-4 text-white">📏 Explorador de Medidas</h3>
        <div className="overflow-x-auto"><table className="w-full min-w-[600px]"><thead className="bg-[#1f2125]"><tr><th className="p-3 text-left text-xs font-bold">Medida</th><th className="p-3 text-left text-xs font-bold">Cantidad de productos</th><th className="p-3 text-left text-xs font-bold">Precio ML Promedio</th><th className="p-3 text-left text-xs font-bold">Mejor Precio Promedio</th></tr></thead><tbody>{SIZES.map(size => { const products = aggregatedProducts.filter(p => p.size === size); const avgMl = products.reduce((s, p) => s + p.mlPrice, 0) / (products.length || 1); const avgBest = products.reduce((s, p) => s + p.bestDirectPrice, 0) / (products.length || 1); return (<tr key={size} className="border-t border-gray-800 hover:bg-[#232529] transition"><td className="p-3 text-white font-mono text-sm">{size}</td><td className="p-3">{products.length}</td><td className="p-3 font-mono">${Math.round(avgMl).toLocaleString()}</td><td className="p-3 font-mono text-green-400">${Math.round(avgBest).toLocaleString()}</td></tr>); })}</tbody></table></div>
    </div>
);

const MarcasView = ({ aggregatedProducts }) => (
    <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
        <h3 className="text-lg font-semibold mb-4 text-white">🏷️ Análisis de Marcas</h3>
        <div className="overflow-x-auto"><table className="w-full min-w-[600px]"><thead className="bg-[#1f2125]"><tr><th className="p-3 text-left text-xs font-bold">Marca</th><th className="p-3 text-left text-xs font-bold">Cantidad de productos</th><th className="p-3 text-left text-xs font-bold">Precio ML Promedio</th><th className="p-3 text-left text-xs font-bold">Mejor Precio Promedio</th></tr></thead><tbody>{BRANDS.map(brand => { const products = aggregatedProducts.filter(p => p.brand === brand); const avgMl = products.reduce((s, p) => s + p.mlPrice, 0) / (products.length || 1); const avgBest = products.reduce((s, p) => s + p.bestDirectPrice, 0) / (products.length || 1); return (<tr key={brand} className="border-t border-gray-800 hover:bg-[#232529] transition"><td className="p-3 text-white font-semibold">{brand}</td><td className="p-3">{products.length}</td><td className="p-3 font-mono">${Math.round(avgMl).toLocaleString()}</td><td className="p-3 font-mono text-green-400">${Math.round(avgBest).toLocaleString()}</td></tr>); })}</tbody></table></div>
    </div>
);

const FuentesView = ({ scraperStatus }) => (
    <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
        <h3 className="text-lg font-semibold mb-4 text-white">📡 Fuentes Externas - Detalle</h3>
        <div className="grid gap-4 md:grid-cols-2">{scraperStatus.map(scraper => (<div key={scraper.name} className="rounded-xl p-4 bg-[#1a1b1e] shadow-neumorph-inset"><div className="flex justify-between items-start"><div><h4 className="font-bold text-white">{scraper.name}</h4><p className="text-xs text-gray-400 mt-1">Última sincronización: {scraper.lastSync}</p><p className="text-xs text-gray-400">Registros activos: <span className="font-mono text-blue-400"><AnimatedCounter value={scraper.records} /></span></p></div><div className={`px-2 py-1 rounded-full text-xs font-semibold ${scraper.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{scraper.status === 'connected' ? 'Conectado' : 'Desconectado'}</div></div></div>))}</div>
    </div>
);

const AlertasView = () => (
    <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset text-center">
        <h3 className="text-lg font-semibold mb-4 text-white">🔔 Alertas de Precio</h3>
        <p className="text-gray-400">Módulo en construcción. Próximamente podrás configurar alertas personalizadas.</p>
        <div className="mt-6 p-4 rounded-xl bg-[#1a1b1e] shadow-neumorph-inset"><p className="text-sm text-gray-300">Ejemplo: Recibir notificación cuando el precio de <strong>Michelin 205/55 R16</strong> baje de $2,300 MXN.</p></div>
    </div>
);

export default Dashboard;