import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, LineChart as LineChartIcon, Filter, Search, CheckCircle, GitCompare, X, Package, DollarSign, Zap, AlertCircle, TrendingUp, Database } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// --------------------------------------------------------------
const BRANDS = ['Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Pirelli', 'Hankook', 'Yokohama'];
const TIRE_SIZES = [
    { size: '205/55 R16', range: 'R16', width: 205, profile: 55 },
    { size: '195/65 R15', range: 'R15', width: 195, profile: 65 },
    { size: '225/45 R17', range: 'R17', width: 225, profile: 45 },
    { size: '215/60 R16', range: 'R16', width: 215, profile: 60 },
    { size: '235/55 R17', range: 'R17', width: 235, profile: 55 },
    { size: '245/40 R18', range: 'R18', width: 245, profile: 40 },
    { size: '255/35 R19', range: 'R19', width: 255, profile: 35 },
    { size: '225/55 R18', range: 'R18', width: 225, profile: 55 },
];

const SOURCES = {
    ml: { name: 'MercadoLibre', icon: '🛒', isOfficial: false },
    radial: { name: 'Radial Llantas', icon: '🏪', isOfficial: true },
    serna: { name: 'Serna', icon: '🏭', isOfficial: true },
    contishop: { name: 'ContiShop', icon: '🌐', isOfficial: true },
};

const generateTireData = () => {
    const data = [];
    let id = 1;
    for (const brand of BRANDS) {
        for (const tireSize of TIRE_SIZES) {
            for (const [sourceKey, sourceInfo] of Object.entries(SOURCES)) {
                const basePrice = { Michelin: 320, Bridgestone: 290, Goodyear: 270, Continental: 310, Pirelli: 300, Hankook: 240, Yokohama: 260 }[brand] || 250;
                const sizeMultiplier = tireSize.width / 200;
                let finalPrice = basePrice * sizeMultiplier * (sourceKey === 'ml' ? 1.15 : 0.95);
                finalPrice = Math.round(finalPrice / 5) * 5;
                data.push({
                    id: id++,
                    brand,
                    size: tireSize.size,
                    range: tireSize.range,
                    width: tireSize.width,
                    profile: tireSize.profile,
                    source: sourceKey,
                    sourceName: sourceInfo.name,
                    price: finalPrice,
                    isOfficial: sourceInfo.isOfficial,
                    stock: Math.random() > 0.3 ? 'Alto' : Math.random() > 0.5 ? 'Medio' : 'Crítico',
                    demand: Math.floor(Math.random() * 100) + 20,
                    scrapedAt: new Date().toISOString(),
                });
            }
        }
    }
    return data;
};

// --------------------------------------------------------------
// 2. CUSTOM HOOKS (Clean Architecture)
// --------------------------------------------------------------
const useTireData = () => {
    const [state, setState] = useState({
        data: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setState(prev => ({ ...prev, loading: true }));
                await new Promise(resolve => setTimeout(resolve, 1200));
                const mockData = generateTireData();
                setState({ data: mockData, loading: false, error: null });
            } catch (err) {
                setState({ data: [], loading: false, error: 'Error al cargar datos' });
            }
        };
        fetchData();
    }, []);

    return state;
};

const useFilters = (data) => {
    const [filters, setFilters] = useState({
        searchTerm: '',
        range: '',
        widthMin: '',
        widthMax: '',
        profileMin: '',
        profileMax: '',
        onlyOfficial: false,
    });

    const filteredData = useMemo(() => {
        if (!data.length) return [];

        return data.filter(item => {
            // Búsqueda por texto
            if (filters.searchTerm && !`${item.brand} ${item.size}`.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
                return false;
            }
            // Filtro por rango
            if (filters.range && item.range !== filters.range) return false;
            // Filtro por ancho
            if (filters.widthMin && item.width < parseInt(filters.widthMin)) return false;
            if (filters.widthMax && item.width > parseInt(filters.widthMax)) return false;
            // Filtro por perfil
            if (filters.profileMin && item.profile < parseInt(filters.profileMin)) return false;
            if (filters.profileMax && item.profile > parseInt(filters.profileMax)) return false;
            // Filtro solo oficiales
            if (filters.onlyOfficial && !item.isOfficial) return false;

            return true;
        });
    }, [data, filters]);

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            range: '',
            widthMin: '',
            widthMax: '',
            profileMin: '',
            profileMax: '',
            onlyOfficial: false,
        });
    };

    return { filters, filteredData, updateFilter, clearFilters };
};

const useComparison = () => {
    const [comparisonList, setComparisonList] = useState([]);

    const addToComparison = (tire) => {
        if (comparisonList.length >= 3) {
            alert('Solo puedes comparar hasta 3 neumáticos');
            return;
        }
        if (!comparisonList.find(t => t.id === tire.id)) {
            setComparisonList(prev => [...prev, tire]);
        }
    };

    const removeFromComparison = (tireId) => {
        setComparisonList(prev => prev.filter(t => t.id !== tireId));
    };

    const clearComparison = () => {
        setComparisonList([]);
    };

    return { comparisonList, addToComparison, removeFromComparison, clearComparison };
};

// --------------------------------------------------------------
// 3. COMPONENTES REUTILIZABLES
// --------------------------------------------------------------
const SkeletonCard = () => (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 shadow-soft animate-pulse">
        <div className="h-4 bg-sky-200 rounded w-3/4 mb-3"></div>
        <div className="h-6 bg-sky-200 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-sky-100 rounded w-full"></div>
    </div>
);

const SearchBar = ({ value, onChange }) => (
    <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
        <input
            type="text"
            placeholder="Buscar por marca o medida (ej: Michelin R17)..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-sky-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent shadow-soft text-gray-700 placeholder-gray-400 transition-all"
        />
    </div>
);

const FilterChip = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active
            ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md shadow-sky-200'
            : 'bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-soft border border-sky-100'
        }`}
    >
        {label}
    </button>
);

const AdvancedFilters = ({ filters, updateFilter, clearFilters }) => {
    const ranges = ['R15', 'R16', 'R17', 'R18', 'R19'];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-soft border border-white/50 space-y-4"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-sky-500" />
                    <h3 className="text-sm font-semibold text-gray-700">Filtros Avanzados</h3>
                </div>
                <button onClick={clearFilters} className="text-xs text-sky-500 hover:text-sky-700 transition-colors">
                    Limpiar todo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="text-xs text-gray-500 block mb-1">Rango</label>
                    <select
                        value={filters.range}
                        onChange={(e) => updateFilter('range', e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    >
                        <option value="">Todos</option>
                        {ranges.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-gray-500 block mb-1">Ancho (mm)</label>
                    <div className="flex gap-2">
                        <input type="number" placeholder="Mín" value={filters.widthMin} onChange={(e) => updateFilter('widthMin', e.target.value)} className="w-full px-3 py-2 bg-white rounded-lg border border-sky-100 text-sm" />
                        <input type="number" placeholder="Máx" value={filters.widthMax} onChange={(e) => updateFilter('widthMax', e.target.value)} className="w-full px-3 py-2 bg-white rounded-lg border border-sky-100 text-sm" />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-500 block mb-1">Perfil (%)</label>
                    <div className="flex gap-2">
                        <input type="number" placeholder="Mín" value={filters.profileMin} onChange={(e) => updateFilter('profileMin', e.target.value)} className="w-full px-3 py-2 bg-white rounded-lg border border-sky-100 text-sm" />
                        <input type="number" placeholder="Máx" value={filters.profileMax} onChange={(e) => updateFilter('profileMax', e.target.value)} className="w-full px-3 py-2 bg-white rounded-lg border border-sky-100 text-sm" />
                    </div>
                </div>
                <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.onlyOfficial}
                            onChange={(e) => updateFilter('onlyOfficial', e.target.checked)}
                            className="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"
                        />
                        <span className="text-sm text-gray-600">Solo tiendas oficiales</span>
                    </label>
                </div>
            </div>
        </motion.div>
    );
};

const TireCard = ({ tire, onCompare, isComparing }) => {
    const stockColors = {
        Alto: 'text-green-600 bg-green-50',
        Medio: 'text-yellow-600 bg-yellow-50',
        Crítico: 'text-red-600 bg-red-50',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -4 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-soft hover:shadow-xl transition-all border border-white/50 group"
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-gray-800">{tire.brand}</h3>
                    <p className="text-xs text-gray-500">{tire.size}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${stockColors[tire.stock]}`}>
                    Stock {tire.stock}
                </span>
            </div>

            <div className="mb-4">
                <p className="text-2xl font-bold text-sky-600">${tire.price.toLocaleString()} <span className="text-xs font-normal text-gray-400">MXN</span></p>
                <p className="text-xs text-gray-400">{tire.sourceName}</p>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onCompare(tire)}
                    disabled={isComparing}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${isComparing
                        ? 'bg-green-100 text-green-600 cursor-default'
                        : 'bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200'
                    }`}
                >
                    {isComparing ? <CheckCircle className="w-4 h-4" /> : <GitCompare className="w-4 h-4" />}
                    {isComparing ? 'En comparación' : 'Comparar'}
                </button>
            </div>
        </motion.div>
    );
};

const ComparisonPanel = ({ items, onRemove, onClear }) => {
    if (items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-4 top-24 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-sky-100 z-50 overflow-hidden"
        >
            <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <GitCompare className="w-4 h-4 text-sky-500" />
                        Comparación ({items.length}/3)
                    </h3>
                    <button onClick={onClear} className="text-xs text-red-400 hover:text-red-600">Limpiar</button>
                </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {items.map(item => (
                    <div key={item.id} className="p-4 border-b border-sky-50 hover:bg-sky-50/30 transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-800 text-sm">{item.brand}</p>
                                <p className="text-xs text-gray-500">{item.size}</p>
                                <p className="text-sm font-bold text-sky-600 mt-1">${item.price}</p>
                                <p className="text-xs text-gray-400">{item.sourceName}</p>
                            </div>
                            <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// --------------------------------------------------------------
// 4. GRÁFICAS CON CHART.JS
// --------------------------------------------------------------
const DemandChart = ({ data }) => {
    const demandBySize = useMemo(() => {
        const demandMap = new Map();
        data.forEach(item => {
            const current = demandMap.get(item.size) || 0;
            demandMap.set(item.size, current + item.demand);
        });
        return Array.from(demandMap.entries()).map(([size, demand]) => ({ size, demand }));
    }, [data]);

    const chartData = {
        labels: demandBySize.map(d => d.size),
        datasets: [
            {
                label: 'Demanda (puntuación)',
                data: demandBySize.map(d => d.demand),
                backgroundColor: 'rgba(14, 165, 233, 0.6)',
                borderColor: 'rgba(2, 132, 199, 1)',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 12 } } },
            tooltip: { backgroundColor: 'white', titleColor: '#1e293b', bodyColor: '#475569', borderColor: '#e2e8f0', borderWidth: 1 },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#e2e8f0' }, title: { display: true, text: 'Nivel de Demanda', color: '#64748b' } },
            x: { ticks: { rotation: 45, autoSkip: true, maxRotation: 45, minRotation: 45 }, grid: { display: false } },
        },
    };

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-500" />
                Demanda por Medida
            </h3>
            <div className="h-80">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

const CriticalStockChart = ({ data }) => {
    const criticalByBrand = useMemo(() => {
        const criticalMap = new Map();
        data.forEach(item => {
            if (item.stock === 'Crítico') {
                const current = criticalMap.get(item.brand) || 0;
                criticalMap.set(item.brand, current + 1);
            }
        });
        return Array.from(criticalMap.entries()).map(([brand, count]) => ({ brand, count }));
    }, [data]);

    const chartData = {
        labels: criticalByBrand.map(c => c.brand),
        datasets: [
            {
                label: 'Productos con stock crítico',
                data: criticalByBrand.map(c => c.count),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: 'rgb(239, 68, 68)',
                pointBorderColor: 'white',
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            tooltip: { backgroundColor: 'white', titleColor: '#1e293b', bodyColor: '#475569' },
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Cantidad de productos', color: '#64748b' }, grid: { color: '#e2e8f0' } },
            x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        },
    };

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-red-400" />
                Stock Crítico por Marca
            </h3>
            <div className="h-80">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

// --------------------------------------------------------------
// 5. COMPONENTE PRINCIPAL DASHBOARD
// --------------------------------------------------------------
const Dashboard = () => {
    const { data: tireData, loading, error } = useTireData();
    const { filters, filteredData, updateFilter, clearFilters } = useFilters(tireData);
    const { comparisonList, addToComparison, removeFromComparison, clearComparison } = useComparison();
    const [activeTab, setActiveTab] = useState('explorer');

    // Métricas globales
    const metrics = useMemo(() => {
        if (!filteredData.length) return null;
        const uniqueProducts = new Set(filteredData.map(p => `${p.brand}|${p.size}`)).size;
        const avgPrice = filteredData.reduce((sum, p) => sum + p.price, 0) / filteredData.length;
        const totalSavings = filteredData.filter(p => !p.isOfficial).reduce((sum, p) => {
            const officialPrice = filteredData.find(op => op.brand === p.brand && op.size === p.size && op.isOfficial)?.price || p.price;
            return sum + (officialPrice - p.price);
        }, 0);
        const criticalStock = filteredData.filter(p => p.stock === 'Crítico').length;
        return { uniqueProducts, avgPrice, totalSavings, criticalStock };
    }, [filteredData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="h-12 w-48 bg-sky-200 rounded-lg animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                    </div>
                    <div className="h-96 bg-white/50 rounded-2xl animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
                <div className="text-center bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-soft">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-600">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition">Reintentar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">NeoDashboard Tyres</h1>
                        <p className="text-gray-500 text-sm">Inteligencia de mercado en tiempo real</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl shadow-soft">
                            <Database className="w-4 h-4 text-sky-500" />
                            <span className="text-sm text-gray-600">{filteredData.length} productos</span>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-sky-100">
                    {[
                        { id: 'explorer', label: 'Explorador', icon: <Search className="w-4 h-4" /> },
                        { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-medium transition-all ${activeTab === tab.id
                                ? 'bg-white text-sky-600 shadow-soft'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Métricas */}
                {metrics && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { label: 'Productos Únicos', value: metrics.uniqueProducts, icon: <Package className="w-5 h-5" />, color: 'from-sky-500 to-blue-500' },
                            { label: 'Precio Promedio', value: `$${Math.round(metrics.avgPrice).toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'from-emerald-500 to-teal-500' },
                            { label: 'Ahorro Potencial', value: `$${Math.round(metrics.totalSavings).toLocaleString()}`, icon: <Zap className="w-5 h-5" />, color: 'from-amber-500 to-orange-500' },
                            { label: 'Stock Crítico', value: metrics.criticalStock, icon: <AlertCircle className="w-5 h-5" />, color: 'from-red-500 to-rose-500' },
                        ].map((metric, idx) => (
                            <motion.div key={metric.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-soft hover:shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm text-gray-500">{metric.label}</p>
                                    <div className={`p-2 bg-gradient-to-br ${metric.color} rounded-xl text-white shadow-md`}>{metric.icon}</div>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Búsqueda y Filtros */}
                <div className="space-y-4">
                    <SearchBar value={filters.searchTerm} onChange={(val) => updateFilter('searchTerm', val)} />
                    <AdvancedFilters filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} />
                </div>

                {/* Contenido Principal */}
                <AnimatePresence mode="wait">
                    {activeTab === 'explorer' && (
                        <motion.div key="explorer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredData.slice(0, 12).map(tire => (
                                    <TireCard
                                        key={tire.id}
                                        tire={tire}
                                        onCompare={addToComparison}
                                        isComparing={comparisonList.some(t => t.id === tire.id)}
                                    />
                                ))}
                            </div>
                            {filteredData.length === 0 && (
                                <div className="text-center py-12 bg-white/40 backdrop-blur-sm rounded-2xl">
                                    <p className="text-gray-500">No se encontraron neumáticos con los filtros aplicados</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                            <DemandChart data={filteredData} />
                            <CriticalStockChart data={filteredData} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Panel de Comparación Flotante */}
                <AnimatePresence>
                    {comparisonList.length > 0 && (
                        <ComparisonPanel
                            items={comparisonList}
                            onRemove={removeFromComparison}
                            onClear={clearComparison}
                        />
                    )}
                </AnimatePresence>

                {/* Footer */}
                <div className="text-center pt-8 border-t border-sky-100">
                    <p className="text-xs text-gray-400">CHValueGrowth v2.0 · Sistema de Inteligencia de Mercado · Datos actualizados en tiempo real</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;