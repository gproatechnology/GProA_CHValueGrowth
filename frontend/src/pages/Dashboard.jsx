// =============================================
// DASHBOARD.JSX – NEUMATIQ (VERSIÓN MEJORADA)
// Sistema de Gestión Integral de Neumáticos
// Desarrollado por GProA Technology
// Comercializado por CH ValueGrowth
// =============================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Filter, Search, CheckCircle, GitCompare, X, Package, DollarSign, 
  TrendingUp, AlertCircle, Globe, Save, Bookmark, Download, Grid3x3, List, 
  ArrowUpDown, Clock as ClockIcon, Award, Calendar, Sun, Truck, CloudRain,
  Info, ShoppingCart, Plus, Minus, PanelLeftClose, PanelLeftOpen, Eye, Activity,
  TrendingDown, ChevronRight, RefreshCw
} from 'lucide-react';
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
    Filler,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { getProductStats, getGroupedProducts, getProducts } from '../services/api';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement,
    Title, Tooltip, Legend, Filler, ArcElement
);

// --------------------------------------------------------------
// 1. ESTADO Y CARGA DE DATOS REALES
// =============================================
// DASHBOARD.JSX – NEUMATIQ (INTEGRADO CON API)
// Sistema de Gestión Integral de Neumáticos
// Desarrollado por GProA Technology - Comercializado por CH ValueGrowth
// =============================================

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, DollarSign, TrendingUp, BarChart3, RefreshCw, AlertCircle
} from 'lucide-react';
import { getProductStats, getGroupedProducts, getProducts } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [groupedByBrand, setGroupedByBrand] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Stats generales
                const statsData = await getProductStats();
                setStats(statsData);
                
                // Marcas agrupadas
                const brands = await getGroupedProducts({ group_by: 'brand', limit: 10 });
                setGroupedByBrand(brands.data || []);
                
                setLastUpdate(new Date());
            } catch (err) {
                setError(err.message || 'Error cargando datos');
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
        const interval = setInterval(() => setLastUpdate(new Date()), 30000);
        return () => clearInterval(interval);
    }, []);
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#1E90FF] mx-auto mb-2" />
                    <p className="text-[#AFC8E6]">Cargando dashboard...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="p-6 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
                <AlertCircle className="w-6 h-6 inline mr-2" />
                Error: {error}
            </div>
        );
    }
    
    // Calcular totalValue (precio promedio * cantidad)
    const totalValue = stats?.stats?.avg_price ? stats.stats.avg_price * stats.total_products : 0;
    
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#EAF3FF]">Dashboard</h1>
                    <p className="text-[#AFC8E6] text-sm">
                        Actualizado: {lastUpdate.toLocaleTimeString()}
                    </p>
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="p-2 rounded-lg bg-[#0B1E3A]/80 hover:bg-[#1E4D7A] transition-colors"
                >
                    <RefreshCw className="w-5 h-5 text-[#1E90FF]" />
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 border border-[#1E90FF]/20"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Package className="w-8 h-8 text-[#1E90FF]" />
                        <span className="text-xs text-emerald-400 font-semibold">+12.5%</span>
                    </div>
                    <p className="text-[#AFC8E6] text-sm">Total Productos</p>
                    <p className="text-2xl font-bold text-[#EAF3FF]">{stats?.total_products || 0}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 border border-[#1E90FF]/20"
                >
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="w-8 h-8 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-semibold">+5.2%</span>
                    </div>
                    <p className="text-[#AFC8E6] text-sm">Precio Promedio</p>
                    <p className="text-2xl font-bold text-[#EAF3FF]">
                        ${(stats?.stats?.avg_price || 0).toLocaleString()}
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 border border-[#1E90FF]/20"
                >
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-8 h-8 text-amber-400" />
                        <span className="text-xs text-emerald-400 font-semibold">+8.1%</span>
                    </div>
                    <p className="text-[#AFC8E6] text-sm">Valor Total Inventario</p>
                    <p className="text-2xl font-bold text-[#EAF3FF]">
                        ${Math.round(totalValue).toLocaleString()}
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 border border-[#1E90FF]/20"
                >
                    <div className="flex items-center justify-between mb-2">
                        <BarChart3 className="w-8 h-8 text-purple-400" />
                        <span className="text-xs text-amber-400 font-semibold">+3</span>
                    </div>
                    <p className="text-[#AFC8E6] text-sm">Marcas Registradas</p>
                    <p className="text-2xl font-bold text-[#EAF3FF]">{groupedByBrand.length}</p>
                </motion.div>
            </div>

            {/* Gráficos y tablas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Marcas */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-6 border border-[#1E90FF]/20"
                >
                    <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#1E90FF]" />
                        Productos por Marca
                    </h3>
                    {groupedByBrand.length > 0 ? (
                        <div className="space-y-3">
                            {groupedByBrand.slice(0, 10).map((brand, idx) => (
                                <div key={brand.name || idx} className="flex items-center justify-between">
                                    <span className="text-[#AFC8E6] text-sm">{brand.name}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-[#0B1E3A] rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-[#1E90FF] to-[#3B82F6]"
                                                style={{ width: `${(brand.count / (stats?.total_products || 1)) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-[#EAF3FF] font-semibold w-12 text-right">
                                            {brand.count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#AFC8E6] text-sm">No hay datos de marcas</p>
                    )}
                </motion.div>

                {/* Estadísticas */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-6 border border-[#1E90FF]/20"
                >
                    <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Estadísticas de Precios
                    </h3>
                    {stats?.stats ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-[#0B1E3A]/60 rounded-lg">
                                <p className="text-[9px] text-[#AFC8E6] uppercase tracking-wide">Mínimo</p>
                                <p className="text-xl font-bold text-emerald-400">
                                    ${stats.stats.min_price.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-[#0B1E3A]/60 rounded-lg">
                                <p className="text-[9px] text-[#AFC8E6] uppercase tracking-wide">Máximo</p>
                                <p className="text-xl font-bold text-red-400">
                                    ${stats.stats.max_price.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-[#0B1E3A]/60 rounded-lg col-span-2">
                                <p className="text-[9px] text-[#AFC8E6] uppercase tracking-wide">Promedio</p>
                                <p className="text-2xl font-bold text-[#1E90FF]">
                                    ${stats.stats.avg_price.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[#AFC8E6]">Sin estadísticas disponibles</p>
                    )}
                </motion.div>
            </div>

            {/* Últimos productos (tabla simple) */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-6 border border-[#1E90FF]/20"
            >
                <h3 className="text-lg font-bold text-[#EAF3FF] mb-4">Últimos Productos</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#1E90FF]/20">
                                <th className="text-left py-2 px-3 text-[#AFC8E6]">Marca</th>
                                <th className="text-left py-2 px-3 text-[#AFC8E6]">Tamaño</th>
                                <th className="text-right py-2 px-3 text-[#AFC8E6]">Precio</th>
                                <th className="text-left py-2 px-3 text-[#AFC8E6]">Fuente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allProducts.slice(0, 10).map((product) => (
                                <tr key={product.id} className="border-b border-[#1E90FF]/10 hover:bg-[#0B1E3A]/30">
                                    <td className="py-2 px-3 text-[#EAF3FF]">{product.brand}</td>
                                    <td className="py-2 px-3 text-[#AFC8E6]">{product.size}</td>
                                    <td className="py-2 px-3 text-right text-emerald-400 font-semibold">
                                        ${(product.price || 0).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-3 text-[#AFC8E6]">{product.source}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {allProducts.length === 0 && (
                        <p className="text-center py-4 text-[#AFC8E6]">No hay productos cargados</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
        'Firestone': 2050, 'BF Goodrich': 2100, 'Cooper': 2000, 'General Tire': 1950,
        'Kumho': 1900, 'Nexen': 1850, 'Toyo': 1950, 'Maxxis': 1800,
        'Nokian': 2200, 'Uniroyal': 1750, 'Falken': 1850, 'GT Radial': 1700
    };
    
    for (const brand of BRANDS) {
        const models = BRAND_MODELS[brand] || ['Estándar'];
        const basePrice = basePriceMap[brand] || 2000;
        
        const assignedSizes = [];
        for (const model of models) {
            const numSizes = Math.floor(Math.random() * 3) + 1;
            const shuffled = [...ALL_SIZES].sort(() => 0.5 - Math.random());
            const modelSizes = shuffled.slice(0, numSizes);
            assignedSizes.push(...modelSizes.map(size => ({ model, size })));
        }
        
        for (const { model, size } of assignedSizes) {
            const sizeMultiplier = parseInt(size.split('/')[0]) / 200;
            for (const country of COUNTRIES) {
                const countryInfo = COUNTRY_INFO[country];
                let priceMXN = basePrice * sizeMultiplier;
                const modelFactor = 0.9 + Math.random() * 0.3;
                priceMXN = priceMXN * modelFactor;
                priceMXN = Math.round(priceMXN / 5) * 5;
                
                let price = priceMXN;
                if (country === 'CO') price = Math.round(priceMXN * 110);
                if (country === 'PA') price = Math.round(priceMXN / 18.5);
                price = Math.round(price / 5) * 5;
                
                let stock;
                const rand = Math.random();
                if (rand < 0.1) stock = Math.floor(Math.random() * 5) + 1;
                else if (rand < 0.3) stock = Math.floor(Math.random() * 20) + 5;
                else if (rand < 0.7) stock = Math.floor(Math.random() * 80) + 20;
                else stock = Math.floor(Math.random() * 200) + 80;
                
                let demand = 30 + Math.random() * 60;
                if (brand === 'Michelin' || brand === 'Pirelli') demand += 15;
                if (stock < 20) demand = Math.min(100, demand + 20);
                
                const salesLastMonth = Math.floor(demand / 10 + Math.random() * 15) + 5;
                let margin = 18 + Math.random() * 12;
                if (brand === 'Michelin') margin += 5;
                if (country === 'PA') margin += 3;
                margin = Math.min(35, Math.max(15, margin));
                const rotation = Math.floor(90 - demand * 0.5 + Math.random() * 20);
                const isOfficial = Math.random() < 0.7;
                
                data.push({
                    id: id++,
                    brand,
                    model,
                    logo: BRAND_LOGOS[brand] || '/assets/default-tire.png',
                    size,
                    range: size.split(' ')[1],
                    width: parseInt(size.split('/')[0]),
                    profile: parseInt(size.split('/')[1].split(' ')[0]),
                    loadIndex: Math.floor(Math.random() * 20) + 80,
                    speedRating: ['H', 'V', 'W', 'Y'][Math.floor(Math.random() * 4)],
                    type: size.includes('R16') ? 'Todo tiempo' : (size.includes('R15') ? 'Verano' : 'Invierno'),
                    country,
                    countryFlag: countryInfo.flagImage,
                    currency: countryInfo.symbol,
                    currencyName: countryInfo.currency,
                    price,
                    stock,
                    demand: Math.floor(demand),
                    salesLastMonth,
                    margin: Math.floor(margin),
                    rotation,
                    isOfficial,
                    sourceName: isOfficial ? (country === 'MX' ? 'Radial Llantas' : 'Distribuidor Oficial') : 'Mercado Libre',
                    scrapedAt: new Date().toISOString()
                });
            }
        }
    }
    return data;
};

// --------------------------------------------------------------
// 3. COMPONENTES REUTILIZABLES
// --------------------------------------------------------------

// Componente de sugerencias en tiempo real
const SearchSuggestions = ({ searchTerm, data, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    
    useEffect(() => {
        if (searchTerm.length < 2) {
            setSuggestions([]);
            return;
        }
        const term = searchTerm.toLowerCase();
        const matches = data
            .filter(item => `${item.brand} ${item.model} ${item.size}`.toLowerCase().includes(term))
            .slice(0, 8);
        setSuggestions(matches);
    }, [searchTerm, data]);
    
    if (suggestions.length === 0) return null;
    
    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#102A4C] rounded-lg border border-[#1E90FF]/30 shadow-xl z-50 max-h-64 overflow-y-auto">
            {suggestions.map(s => (
                <button
                    key={s.id}
                    onClick={() => onSelect(`${s.brand} ${s.model} ${s.size}`)}
                    className="w-full text-left px-3 py-2 text-xs text-[#EAF3FF] hover:bg-[#1E4D7A] transition-colors flex items-center gap-2"
                >
                    <img src={s.logo} alt={s.brand} className="w-5 h-5 object-contain" />
                    <span>{s.brand}</span>
                    <span className="text-[#AFC8E6]">{s.model}</span>
                    <span className="text-[#AFC8E6]">{s.size}</span>
                    <span className="ml-auto text-[10px] text-[#AFC8E6]">⭐ {s.demand}% demanda</span>
                </button>
            ))}
        </div>
    );
};

// Tarjeta de inteligencia de marca (Brand Hub)
const BrandIntelligenceCard = ({ brand, stats, onSelectBrand }) => {
    const seasonal = seasonalData[brand] || { forecast: '+5%', season: 'Normal', recommendation: 'Monitorear', color: 'sky' };
    const marketShare = ((stats.units / stats.totalUnits) * 100).toFixed(1);
    const stockHealth = stats.criticalCount > 0 ? 'critical' : stats.lowCount > 0 ? 'warning' : 'healthy';
    const healthConfig = {
        healthy: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Stock óptimo' },
        warning: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Stock bajo' },
        critical: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Stock crítico' }
    };
    const health = healthConfig[stockHealth];
    
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => onSelectBrand(brand)}
            className="flex-shrink-0 w-36 sm:w-40 min-h-[180px] bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20 cursor-pointer group transition-all h-full flex flex-col justify-between"
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 rounded-xl flex items-center justify-center p-2 mb-2 border border-[#1E90FF]/30">
                    <img src={BRAND_LOGOS[brand]} alt={brand} className="w-12 h-12 object-contain" />
                </div>
                <h4 className="font-bold text-[#EAF3FF] text-sm truncate w-full">{brand}</h4>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-[#AFC8E6]">Market Share:</span>
                    <span className="text-xs font-bold text-[#1E90FF]">{marketShare}%</span>
                </div>
                <div className={`mt-2 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-opacity-20 border ${health.bg} ${health.text} ${stockHealth === 'healthy' ? 'border-emerald-500/30' : stockHealth === 'warning' ? 'border-amber-500/30' : 'border-red-500/30'}`}>
                    {health.label}
                </div>
                <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-[#1E90FF]/20">
                    <div className="flex items-center gap-1">
                        {seasonal.forecast.startsWith('+') ? <TrendingUp size={10} className="text-emerald-400" /> : <TrendingUp size={10} className="text-red-400 rotate-180" />}
                        <span className={`text-[10px] font-semibold ${seasonal.forecast.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                            {seasonal.forecast}
                        </span>
                    </div>
                    <div className="text-[9px] text-[#AFC8E6]">{seasonal.season}</div>
                </div>
            </div>
        </motion.div>
    );
};

// Predictor Estacional (PAE)
const SeasonalPredictor = ({ selectedBrand, onClose }) => {
    const info = seasonalData[selectedBrand] || { forecast: '+5%', season: 'Normal', recommendation: 'Monitorear demanda', color: 'sky' };
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20 mb-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#EAF3FF] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1E90FF]" />
                    Predictor de Abastecimiento Estacional (PAE) - {selectedBrand}
                </h3>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A]"><X className="w-4 h-4 text-[#AFC8E6]" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-[#0B1E3A]/60 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1"><TrendingUp size={12} className="text-emerald-400" /><span className="text-[10px] text-[#AFC8E6]">Pronóstico</span></div>
                    <p className={`text-base font-bold ${info.forecast.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{info.forecast}</p>
                </div>
                <div className="bg-[#0B1E3A]/60 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1"><Sun size={12} className="text-amber-400" /><span className="text-[10px] text-[#AFC8E6]">Temporada</span></div>
                    <p className="text-base font-bold text-[#EAF3FF]">{info.season}</p>
                </div>
                <div className="bg-[#0B1E3A]/60 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1"><Truck size={12} className="text-[#1E90FF]" /><span className="text-[10px] text-[#AFC8E6]">Recomendación</span></div>
                    <p className="text-xs font-semibold text-[#1E90FF]">{info.recommendation}</p>
                </div>
                <div className="bg-gradient-to-r from-[#1E90FF]/20 to-[#3B82F6]/20 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1"><CloudRain size={12} className="text-sky-400" /><span className="text-[10px] text-[#AFC8E6]">Acción sugerida</span></div>
                    <button className="text-xs font-semibold text-white bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] px-3 py-1 rounded-lg">Generar Orden</button>
                </div>
            </div>
            <div className="mt-3 p-2 bg-[#0B1E3A]/40 rounded-lg">
                <p className="text-[10px] text-[#AFC8E6] text-center">💡 Basado en datos históricos y tendencias estacionales.</p>
            </div>
        </motion.div>
    );
};

// Tarjeta de neumático (vista grid)
const TireCard = ({ tire, onCompare, isComparing, onAddToCart, onClick }) => {
    const stockLevel = tire.stock > 80 ? 'Alto' : tire.stock > 20 ? 'Medio' : 'Crítico';
    const stockColorClass = stockLevel === 'Alto' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : stockLevel === 'Medio' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30';
    return (
        <motion.div layout whileHover={{ y: -4, scale: 1.02 }} onClick={onClick}
            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-[#1E90FF]/20 cursor-pointer">
            <div className="relative h-32 bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 flex items-center justify-center">
                <img src={tire.logo} alt={tire.brand} className="h-16 w-16 object-contain" onError={(e) => e.target.style.display = 'none'} />
                <div className="absolute top-2 right-2"><span className={`text-[10px] px-2 py-0.5 rounded-full border ${stockColorClass}`}>Stock {stockLevel}</span></div>
                <div className="absolute top-2 left-2"><img src={tire.countryFlag} alt={tire.country} className="w-5 h-5 rounded-full object-cover" /></div>
            </div>
            <div className="p-3">
                <h3 className="font-bold text-[#EAF3FF] text-sm truncate">{tire.brand}</h3>
                <p className="text-xs text-[#AFC8E6]">{tire.model} · {tire.size}</p>
                <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-xl font-bold text-[#1E90FF]">{tire.currency}{tire.price.toLocaleString()}</span>
                    <span className="text-[10px] text-[#AFC8E6]">{tire.currencyName}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-[#AFC8E6]">
                    <span>📊 Demanda {tire.demand}%</span>
                    <span>💰 Margen {tire.margin}%</span>
                </div>
                <div className="flex gap-2 mt-3">
                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(tire); }} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white rounded-lg text-xs font-medium">🛒 Agregar</button>
                    <button onClick={(e) => { e.stopPropagation(); onCompare(tire); }} disabled={isComparing} className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${isComparing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#0B1E3A]/80 text-[#AFC8E6] border border-[#1E90FF]/30'}`}>
                        <GitCompare size={12} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Vista de lista
const TireListItem = ({ tire, onCompare, isComparing, onAddToCart, onClick }) => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ x: 4 }} onClick={onClick}
        className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-lg p-3 shadow-lg hover:shadow-xl transition-all border border-[#1E90FF]/20 flex items-center gap-3 cursor-pointer">
        <img src={tire.logo} alt={tire.brand} className="w-10 h-10 object-contain" />
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2"><span className="font-semibold text-[#EAF3FF] text-sm">{tire.brand}</span><span className="text-xs text-[#AFC8E6]">{tire.model}</span><span className="text-xs">{tire.size}</span><img src={tire.countryFlag} className="w-4 h-4 rounded-full" alt="flag" /></div>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-[#AFC8E6]"><span>Stock: {tire.stock}</span><span>Demanda: {tire.demand}%</span><span>Margen: {tire.margin}%</span></div>
        </div>
        <div className="text-right"><div className="text-lg font-bold text-[#1E90FF]">{tire.currency}{tire.price.toLocaleString()}</div>
            <div className="flex gap-1 mt-1"><button onClick={(e) => { e.stopPropagation(); onAddToCart(tire); }} className="p-1 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded text-white"><ShoppingCart size={12} /></button>
            <button onClick={(e) => { e.stopPropagation(); onCompare(tire); }} className="p-1 bg-[#0B1E3A]/80 rounded border border-[#1E90FF]/30"><GitCompare size={12} className="text-[#AFC8E6]" /></button></div>
        </div>
    </motion.div>
);

// Panel de comparación
const ComparisonPanel = ({ items, onRemove, onClear }) => {
    if (items.length === 0) return null;
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-4 right-4 bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-3 shadow-2xl border border-[#1E90FF]/30 max-w-sm w-80 z-40">
            <div className="flex items-center justify-between mb-2"><h4 className="font-bold text-[#EAF3FF] flex items-center gap-1"><GitCompare size={16} className="text-[#1E90FF]" /> Comparación ({items.length}/4)</h4><button onClick={onClear} className="text-red-400 text-sm">Limpiar</button></div>
            <div className="space-y-2 max-h-32 overflow-y-auto">{items.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-[#0B1E3A]/50 rounded-lg"><img src={item.logo} alt={item.brand} className="w-8 h-8 rounded" /><div className="flex-1"><p className="text-xs font-medium text-[#EAF3FF] truncate">{item.brand} {item.size}</p><p className="text-[10px] text-[#1E90FF]">{item.currency}{item.price}</p></div><button onClick={() => onRemove(item.id)} className="p-1 text-red-400"><X size={14} /></button></div>))}</div>
        </motion.div>
    );
};

// Gráficos mejorados con efectos 3D y sombras
const SalesByBrandChart = ({ data }) => {
    const salesMap = useMemo(() => {
        const map = new Map();
        data.forEach(item => map.set(item.brand, (map.get(item.brand) || 0) + item.salesLastMonth));
        return Array.from(map.entries()).map(([brand, sales]) => ({ brand, sales })).slice(0, 10);
    }, [data]);
    
    const gradient = (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#1E90FF');
        gradient.addColorStop(1, '#3B82F6');
        return gradient;
    };
    
    const chartData = {
        labels: salesMap.map(s => s.brand),
        datasets: [{
            label: 'Ventas (unidades)',
            data: salesMap.map(s => s.sales),
            backgroundColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) return '#1E90FF';
                return gradient(ctx);
            },
            borderColor: '#FFFFFF',
            borderWidth: 1,
            borderRadius: 12,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
            shadowOffsetX: 2,
            shadowOffsetY: 4,
            shadowBlur: 8,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
        }],
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000, easing: 'easeOutQuart' },
        plugins: {
            legend: { labels: { color: '#AFC8E6', font: { size: 11, weight: 'bold' } } },
            tooltip: { 
                backgroundColor: '#0B1E3A', 
                titleColor: '#EAF3FF', 
                bodyColor: '#AFC8E6',
                borderColor: '#1E90FF',
                borderWidth: 1,
                cornerRadius: 8,
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowBlur: 4,
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toLocaleString()} unidades`
                }
            }
        },
        scales: {
            y: { 
                grid: { color: 'rgba(30, 144, 255, 0.1)', drawBorder: false },
                ticks: { color: '#AFC8E6', stepSize: 20 },
                title: { display: true, text: 'Unidades vendidas', color: '#AFC8E6', font: { size: 10 } }
            },
            x: { 
                ticks: { color: '#AFC8E6', rotation: 45, autoSkip: true },
                grid: { display: false }
            }
        },
        elements: { bar: { backgroundColor: '#1E90FF', hoverBackgroundColor: '#3B82F6' } }
    };
    
    return (
        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-xl border border-[#1E90FF]/20 transform transition-all hover:shadow-2xl">
            <h3 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#1E90FF]" /> Ventas por Marca</h3>
            <div className="h-64"><Bar data={chartData} options={options} /></div>
        </div>
    );
};

const TypeDistributionChart = ({ data }) => {
    const typeMap = useMemo(() => {
        const map = new Map();
        data.forEach(item => map.set(item.type, (map.get(item.type) || 0) + 1));
        return Array.from(map.entries()).map(([type, count]) => ({ type, count }));
    }, [data]);
    
    const chartData = {
        labels: typeMap.map(t => t.type),
        datasets: [{
            data: typeMap.map(t => t.count),
            backgroundColor: ['#1E90FF', '#3B82F6', '#06B6D4'],
            borderWidth: 0,
            hoverOffset: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 4,
            shadowBlur: 8
        }],
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000, easing: 'easeOutQuart' },
        plugins: {
            legend: { position: 'bottom', labels: { color: '#AFC8E6', font: { size: 10 }, usePointStyle: true } },
            tooltip: { 
                backgroundColor: '#0B1E3A', 
                titleColor: '#EAF3FF', 
                bodyColor: '#AFC8E6',
                borderColor: '#1E90FF',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: (ctx) => `${ctx.label}: ${ctx.raw} productos (${((ctx.raw / typeMap.reduce((a,b)=>a+b.count,0))*100).toFixed(1)}%)`
                }
            }
        },
    };
    
    return (
        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-xl border border-[#1E90FF]/20 transform transition-all hover:shadow-2xl">
            <h3 className="text-sm font-semibold text-[#EAF3FF] mb-3">Distribución por Tipo</h3>
            <div className="h-64"><Doughnut data={chartData} options={options} /></div>
        </div>
    );
};

const DemandHeatmap = ({ data }) => {
    const demandBySize = useMemo(() => {
        const map = new Map();
        data.forEach(item => map.set(item.size, (map.get(item.size) || 0) + item.demand));
        return Array.from(map.entries()).map(([size, demand]) => ({ size, demand })).sort((a,b) => b.demand - a.demand).slice(0, 8);
    }, [data]);
    const maxDemand = Math.max(...demandBySize.map(d => d.demand));
    return (
        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-xl border border-[#1E90FF]/20">
            <h3 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-[#1E90FF]" /> Medidas Más Demandadas</h3>
            <div className="space-y-3">
                {demandBySize.map(({size, demand}) => (
                    <div key={size} className="flex items-center gap-3">
                        <span className="text-xs text-[#AFC8E6] w-24 font-mono">{size}</span>
                        <div className="flex-1 h-8 bg-[#0B1E3A] rounded-xl overflow-hidden shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(demand/maxDemand)*100}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-xl flex items-center justify-end px-3 shadow-md"
                            >
                                <span className="text-[11px] text-white font-bold">{demand}%</span>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Modal "Ver todas las marcas"
const AllBrandsModal = ({ brands, onClose, onSelectBrand }) => {
    const [search, setSearch] = useState('');
    const filteredBrands = brands.filter(b => b.brand.toLowerCase().includes(search.toLowerCase()));
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-5 w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-[#1E90FF]/30 shadow-2xl"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#102A4C]/90 backdrop-blur p-2 -mt-2 rounded-lg">
                    <h2 className="text-lg font-bold text-[#EAF3FF] flex items-center gap-2"><Award className="w-5 h-5 text-[#1E90FF]" /> Todas las Marcas ({brands.length})</h2>
                    <div className="flex gap-2">
                        <input id="brand-search" name="brand-search" type="text" placeholder="Buscar marca..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF] w-48" />
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#1E4D7A]"><X className="w-4 h-4 text-[#AFC8E6]" /></button>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {filteredBrands.map(brand => (
                        <div key={brand.brand} onClick={() => { onSelectBrand(brand.brand); onClose(); }} className="bg-[#0B1E3A]/60 rounded-xl p-3 cursor-pointer hover:bg-[#1E4D7A] transition-all group">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 rounded-full flex items-center justify-center p-2 border border-[#1E90FF]/30">
                                <img src={BRAND_LOGOS[brand.brand]} alt={brand.brand} className="w-12 h-12 object-contain" />
                            </div>
                            <p className="text-center font-semibold text-[#EAF3FF] text-xs mt-2 truncate">{brand.brand}</p>
                            <div className="flex justify-between text-[9px] text-[#AFC8E6] mt-1">
                                <span>📊 {((brand.units / brand.totalUnits) * 100).toFixed(1)}%</span>
                                <span className={brand.criticalCount > 0 ? 'text-red-400' : ''}>⚠️ {brand.criticalCount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

// --------------------------------------------------------------
// 4. DASHBOARD PRINCIPAL
// --------------------------------------------------------------
const Dashboard = () => {
    const [tireData, setTireData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedSearches, setSavedSearches] = useState([]);
    
    const [filters, setFilters] = useState({
        searchTerm: '', brands: [], sizes: [], types: [], priceMin: '', priceMax: '',
        stockMin: '', stockMax: '', marginMin: '', marginMax: '', country: 'all', onlyOfficial: false
    });
    const [sortBy, setSortBy] = useState('price');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState(() => localStorage.getItem('neumatiq_viewmode') || 'grid');
    const [activeTab, setActiveTab] = useState('explorer');
    const [showFilters, setShowFilters] = useState(true);
    const [selectedTire, setSelectedTire] = useState(null);
    const [comparisonList, setComparisonList] = useState([]);
    const [cart, setCart] = useState([]);
    const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedRim, setSelectedRim] = useState('');
    const [showAllBrandsModal, setShowAllBrandsModal] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // Reloj en tiempo real para el explorador
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    // Cargar datos mock
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 800));
            const mock = generateTireData();
            setTireData(mock);
            const saved = localStorage.getItem('neumatiq_saved_searches');
            if (saved) setSavedSearches(JSON.parse(saved));
            setLoading(false);
        };
        loadData();
    }, []);
    
    useEffect(() => {
        localStorage.setItem('neumatiq_viewmode', viewMode);
    }, [viewMode]);
    
    // Filtrar y ordenar datos (ahora con soporte para 'sales')
    const filteredData = useMemo(() => {
        let filtered = [...tireData];
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(item => `${item.brand} ${item.model} ${item.size}`.toLowerCase().includes(term));
        }
        if (filters.brands.length) filtered = filtered.filter(item => filters.brands.includes(item.brand));
        if (filters.sizes.length) filtered = filtered.filter(item => filters.sizes.includes(item.size));
        if (filters.types.length) filtered = filtered.filter(item => filters.types.includes(item.type));
        if (filters.priceMin) filtered = filtered.filter(item => item.price >= parseInt(filters.priceMin));
        if (filters.priceMax) filtered = filtered.filter(item => item.price <= parseInt(filters.priceMax));
        if (filters.stockMin) filtered = filtered.filter(item => item.stock >= parseInt(filters.stockMin));
        if (filters.stockMax) filtered = filtered.filter(item => item.stock <= parseInt(filters.stockMax));
        if (filters.marginMin) filtered = filtered.filter(item => item.margin >= parseInt(filters.marginMin));
        if (filters.marginMax) filtered = filtered.filter(item => item.margin <= parseInt(filters.marginMax));
        if (filters.country !== 'all') filtered = filtered.filter(item => item.country === filters.country);
        if (filters.onlyOfficial) filtered = filtered.filter(item => item.isOfficial);
        
        filtered.sort((a,b) => {
            let valA, valB;
            if (sortBy === 'price') { valA = a.price; valB = b.price; }
            else if (sortBy === 'stock') { valA = a.stock; valB = b.stock; }
            else if (sortBy === 'demand') { valA = a.demand; valB = b.demand; }
            else if (sortBy === 'margin') { valA = a.margin; valB = b.margin; }
            else if (sortBy === 'sales') { valA = a.salesLastMonth; valB = b.salesLastMonth; }
            else { valA = a.price; valB = b.price; }
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        });
        return filtered;
    }, [tireData, filters, sortBy, sortOrder]);
    
    // KPIs
    const kpis = useMemo(() => {
        const totalStock = filteredData.reduce((sum, p) => sum + p.stock, 0);
        const totalValue = filteredData.reduce((sum, p) => sum + (p.price * p.stock), 0);
        const avgMargin = filteredData.reduce((sum, p) => sum + p.margin, 0) / (filteredData.length || 1);
        const avgRotation = filteredData.reduce((sum, p) => sum + p.rotation, 0) / (filteredData.length || 1);
        const lowStockCount = filteredData.filter(p => p.stock < 10).length;
        return { totalStock, totalValue, avgMargin, avgRotation, lowStockCount };
    }, [filteredData]);
    
    const brandStats = useMemo(() => {
        const map = new Map();
        let totalUnits = 0;
        filteredData.forEach(item => {
            totalUnits += item.stock;
            if (!map.has(item.brand)) map.set(item.brand, { units: 0, margin: 0, count: 0, criticalCount: 0, lowCount: 0 });
            const stats = map.get(item.brand);
            stats.units += item.stock;
            stats.margin += item.margin;
            stats.count++;
            if (item.stock < 5) stats.criticalCount++;
            else if (item.stock < 20) stats.lowCount++;
        });
        return Array.from(map.entries()).map(([brand, data]) => ({
            brand, units: data.units, avgMargin: data.margin / data.count,
            criticalCount: data.criticalCount, lowCount: data.lowCount, totalUnits
        })).sort((a,b) => b.units - a.units);
    }, [filteredData]);
    
    const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
    const clearFilters = () => setFilters({ searchTerm: '', brands: [], sizes: [], types: [], priceMin: '', priceMax: '', stockMin: '', stockMax: '', marginMin: '', marginMax: '', country: 'all', onlyOfficial: false });
    const addToComparison = (tire) => { if (!comparisonList.some(t => t.id === tire.id) && comparisonList.length < 4) setComparisonList([...comparisonList, tire]); };
    const removeFromComparison = (id) => setComparisonList(prev => prev.filter(t => t.id !== id));
    const clearComparison = () => setComparisonList([]);
    const addToCart = (tire) => setCart(prev => { const existing = prev.find(t => t.id === tire.id); if (existing) return prev.map(t => t.id === tire.id ? { ...t, quantity: t.quantity+1 } : t); return [...prev, { ...tire, quantity: 1 }]; });
    
    const saveSearch = () => {
        if (!searchName.trim()) return;
        const newSearch = { id: Date.now(), name: searchName, filters, sortBy, sortOrder, createdAt: new Date().toISOString() };
        const updated = [newSearch, ...savedSearches].slice(0, 10);
        setSavedSearches(updated);
        localStorage.setItem('neumatiq_saved_searches', JSON.stringify(updated));
        setSearchName('');
        setShowSaveSearchModal(false);
    };
    
    const loadSavedSearch = (search) => {
        setFilters(search.filters);
        setSortBy(search.sortBy);
        setSortOrder(search.sortOrder);
    };
    
    const handleSelectBrand = (brand) => {
        setSelectedBrand(brand);
        updateFilter('brands', [brand]);
        setActiveTab('explorer');
        setTimeout(() => document.getElementById('explorer-tab')?.click(), 100);
    };
    
    const exportToCSV = () => {
        const headers = ['Marca', 'Modelo', 'Medida', 'País', 'Precio', 'Stock', 'Demanda(%)', 'Margen(%)', 'Rotación(días)', 'Oficial'];
        const rows = filteredData.map(item => [item.brand, item.model, item.size, item.country, `${item.currency}${item.price}`, item.stock, item.demand, item.margin, item.rotation, item.isOfficial ? 'Sí' : 'No']);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `neumatiq_export_${new Date().toISOString().slice(0,19)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };
    
    const handleStockCritical = () => {
        updateFilter('stockMax', '10');
        updateFilter('stockMin', '1');
    };
    
    if (loading) return <div className="h-screen bg-[#0B1E3A] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#1E90FF]/30 border-t-[#1E90FF] rounded-full animate-spin"></div><p className="text-[#AFC8E6] ml-3">Cargando NeumatiQ...</p></div>;
    
    return (
        <div className="h-screen w-full overflow-hidden bg-[#0B1E3A]">
            <div className="h-full w-full flex flex-col p-2 sm:p-3 md:p-4 min-h-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0B1E3A]/90 to-[#102A4C]/90 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-[#1E90FF]/20 mb-3 flex-shrink-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <img src="/assets/Logo_de_NeumatiQ-.png" alt="NeumatiQ" className="w-9 h-9 rounded-full" />
                            <div><h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] bg-clip-text text-transparent">NeumatiQ</h1><p className="text-[9px] text-[#AFC8E6] hidden sm:block">Gestión Integral de Neumáticos</p></div>
                        </div>
                        <div className="flex-1 max-w-md relative z-50">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1E90FF]" />
                            <input id="tire-search" name="tire-search" type="text" placeholder="Buscar marca, modelo o medida..." value={filters.searchTerm} onChange={(e) => updateFilter('searchTerm', e.target.value)} className="w-full pl-9 pr-3 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF] placeholder-[#AFC8E6]/50 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]" />
                            <SearchSuggestions searchTerm={filters.searchTerm} data={tireData} onSelect={(val) => updateFilter('searchTerm', val)} />
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-1.5 rounded-lg bg-[#102A4C] border border-[#1E90FF]/30"><PanelLeftClose size={16} className="text-[#1E90FF]" /></button>
                            <div className="flex gap-1 bg-[#102A4C]/80 rounded-lg p-0.5">
                                {['MX', 'CO', 'PA'].map(c => (<button key={c} onClick={() => updateFilter('country', c)} className={`px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 ${filters.country === c ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white' : 'text-[#AFC8E6]'}`}><img src={COUNTRY_INFO[c].flagImage} className="w-3.5 h-3.5 rounded-full object-cover" alt={c} />{c}</button>))}
                                <button onClick={() => updateFilter('country', 'all')} className={`px-2 py-1 rounded-md text-[10px] ${filters.country === 'all' ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white' : 'text-[#AFC8E6]'}`}>🌎 Todos</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                    {[
                        { label: 'Total Stock', value: kpis.totalStock.toLocaleString(), icon: Package, tooltip: 'Total de neumáticos en inventario' },
                        { label: 'Valor Inventario', value: `$${kpis.totalValue.toLocaleString()}`, icon: DollarSign, tooltip: 'Valor total del inventario' },
                        { label: 'Margen Promedio', value: `${kpis.avgMargin.toFixed(1)}%`, icon: TrendingUp, tooltip: 'Margen de ganancia promedio' },
                        { label: 'Rotación (días)', value: `${kpis.avgRotation.toFixed(0)} días`, icon: ClockIcon, tooltip: 'Días promedio de rotación' },
                        { label: 'Stock Crítico', value: kpis.lowStockCount, icon: AlertCircle, tooltip: 'Productos con stock <10 unidades' }
                    ].map((kpi, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-lg p-2 shadow-lg border border-[#1E90FF]/20 group relative">
                            <div className="flex items-center justify-between"><div className="p-1 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg"><kpi.icon size={12} className="text-white" /></div><Info size={10} className="text-[#AFC8E6] cursor-help" /><div className="absolute bottom-full right-0 mb-1 hidden group-hover:block bg-[#0B1E3A] text-[10px] text-[#AFC8E6] px-2 py-1 rounded whitespace-nowrap z-10 border border-[#1E90FF]/30">{kpi.tooltip}</div></div>
                            <p className="text-lg font-bold text-[#EAF3FF] mt-1">{kpi.value}</p>
                            <p className="text-[9px] text-[#AFC8E6]">{kpi.label}</p>
                        </div>
                    ))}
                </div>
                
                {/* Brand Hub con botón "Ver todas" */}
                <div className="mb-4 min-h-[140px]">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-semibold text-[#EAF3FF] flex items-center gap-2"><Award className="w-4 h-4 text-[#1E90FF]" /> Marcas Detectadas en Sistema <span className="text-[10px] text-[#AFC8E6]">({brandStats.length} marcas activas)</span></h2>
                        <button onClick={() => setShowAllBrandsModal(true)} className="text-[10px] text-[#1E90FF] hover:text-[#3B82F6] transition-colors flex items-center gap-1">Ver todas <ChevronRight size={10} /></button>
                    </div>
                    <div className="overflow-x-auto pb-2 h-full"><div className="flex gap-3">{brandStats.slice(0, 12).map(brand => <BrandIntelligenceCard key={brand.brand} brand={brand.brand} stats={brand} onSelectBrand={handleSelectBrand} />)}</div></div>
                </div>
                
                {/* Predictor Estacional */}
                <AnimatePresence>{selectedBrand && <SeasonalPredictor selectedBrand={selectedBrand} onClose={() => setSelectedBrand(null)} />}</AnimatePresence>
                
                {/* Contenido principal */}
                <div className="flex-1 flex gap-3 overflow-hidden min-h-0">
                    <AnimatePresence>{showFilters && (<motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="lg:w-80 flex-shrink-0 overflow-hidden"><div className="h-full overflow-y-auto space-y-3 pr-1">
                        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-3 shadow-lg border border-[#1E90FF]/20">
                            <div className="flex items-center justify-between mb-2"><h3 className="text-xs font-semibold text-[#EAF3FF] flex items-center gap-1"><Filter className="w-3 h-3 text-[#1E90FF]" /> Filtros Avanzados</h3><button onClick={clearFilters} className="text-[10px] text-[#1E90FF]">Limpiar</button></div>
                            <div className="space-y-2">
                                <div><label htmlFor="filter-brand" className="text-[10px] text-[#AFC8E6]">Marca</label><select id="filter-brand" name="filter-brand" onChange={(e) => updateFilter('brands', e.target.value ? [e.target.value] : [])} className="w-full px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs"><option value="">Todas</option>{BRANDS.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                                <div><label htmlFor="filter-rim" className="text-[10px] text-[#AFC8E6]">Rin</label><select id="filter-rim" name="filter-rim" value={selectedRim} onChange={(e) => setSelectedRim(e.target.value)} className="w-full px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs"><option value="">Seleccionar rin</option>{Object.keys(TIRE_SIZES_BY_RIM).map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                                {selectedRim && (<div><label htmlFor="filter-size" className="text-[10px] text-[#AFC8E6]">Medida</label><select id="filter-size" name="filter-size" onChange={(e) => updateFilter('sizes', e.target.value ? [e.target.value] : [])} className="w-full px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs"><option value="">Todas</option>{TIRE_SIZES_BY_RIM[selectedRim].map(s => <option key={s} value={s}>{s}</option>)}</select></div>)}
                                <div><label htmlFor="filter-type" className="text-[10px] text-[#AFC8E6]">Tipo</label><select id="filter-type" name="filter-type" onChange={(e) => updateFilter('types', e.target.value ? [e.target.value] : [])} className="w-full px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs"><option value="">Todos</option><option>Verano</option><option>Invierno</option><option>Todo tiempo</option></select></div>
                                <div className="grid grid-cols-2 gap-2"><input id="price-min" name="price-min" type="number" placeholder="Precio min" value={filters.priceMin} onChange={(e) => updateFilter('priceMin', e.target.value)} className="px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs" /><input id="price-max" name="price-max" type="number" placeholder="Precio max" value={filters.priceMax} onChange={(e) => updateFilter('priceMax', e.target.value)} className="px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs" /></div>
                                <div className="grid grid-cols-2 gap-2"><input id="stock-min" name="stock-min" type="number" placeholder="Stock min" value={filters.stockMin} onChange={(e) => updateFilter('stockMin', e.target.value)} className="px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs" /><input id="stock-max" name="stock-max" type="number" placeholder="Stock max" value={filters.stockMax} onChange={(e) => updateFilter('stockMax', e.target.value)} className="px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs" /></div>
                                <label htmlFor="only-official" className="flex items-center gap-2"><input id="only-official" name="only-official" type="checkbox" checked={filters.onlyOfficial} onChange={(e) => updateFilter('onlyOfficial', e.target.checked)} className="w-3 h-3" /><span className="text-[10px] text-[#AFC8E6]">Solo tiendas oficiales</span></label>
                                <div className="flex gap-2 mt-2"><button onClick={handleStockCritical} className="flex-1 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs border border-red-500/30">⚠️ Stock Crítico</button><button onClick={exportToCSV} className="flex-1 py-1 bg-[#0B1E3A]/80 text-[#1E90FF] rounded-lg text-xs border border-[#1E90FF]/30 flex items-center justify-center gap-1"><Download size={10} /> Exportar</button></div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-3"><button onClick={() => setShowSaveSearchModal(true)} className="w-full py-1.5 bg-[#0B1E3A]/80 rounded-lg text-xs text-[#1E90FF] border border-[#1E90FF]/30 flex items-center justify-center gap-1"><Save size={12} /> Guardar búsqueda</button></div>
                        {savedSearches.length > 0 && (<div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-3"><h3 className="text-xs font-semibold text-[#EAF3FF] mb-2 flex items-center gap-1"><Bookmark className="w-3 h-3 text-[#1E90FF]" /> Búsquedas Guardadas</h3><div className="space-y-1">{savedSearches.map(s => (<button key={s.id} onClick={() => loadSavedSearch(s)} className="w-full text-left px-2 py-1 rounded-lg text-[10px] text-[#AFC8E6] hover:bg-[#1E4D7A] truncate">{s.name}</button>))}</div></div>)}
                    </div></motion.div>)}</AnimatePresence>
                    
                    {/* Área central con tabs mejorados y hora */}
                    <div className="flex-1 min-w-0 flex flex-col bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl shadow-lg border border-[#1E90FF]/20 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-[#1E90FF]/20 px-3 pt-2 pb-1 flex-shrink-0">
                            <div className="flex gap-1">
                                <button id="explorer-tab" onClick={() => setActiveTab('explorer')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium transition-all ${activeTab === 'explorer' ? 'bg-[#0B1E3A] text-[#1E90FF] shadow-sm border-t border-x border-[#1E90FF]/30' : 'text-[#AFC8E6] hover:text-[#EAF3FF] hover:bg-[#1E4D7A]/50'}`}><Search size={12} />Explorador</button>
                                <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium transition-all ${activeTab === 'analytics' ? 'bg-[#0B1E3A] text-[#1E90FF] shadow-sm border-t border-x border-[#1E90FF]/30' : 'text-[#AFC8E6] hover:text-[#EAF3FF] hover:bg-[#1E4D7A]/50'}`}><BarChart3 size={12} />Analytics</button>
                                <button onClick={() => setActiveTab('markets')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium transition-all ${activeTab === 'markets' ? 'bg-[#0B1E3A] text-[#1E90FF] shadow-sm border-t border-x border-[#1E90FF]/30' : 'text-[#AFC8E6] hover:text-[#EAF3FF] hover:bg-[#1E4D7A]/50'}`}><Globe size={12} />Mercados</button>
                            </div>
                            <div className="flex items-center gap-3">
                                {activeTab === 'explorer' && (
                                    <div className="text-[9px] text-[#AFC8E6] flex items-center gap-1 bg-[#0B1E3A]/40 px-2 py-0.5 rounded-full">
                                        <ClockIcon size={10} /> {currentTime.toLocaleTimeString()}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <div className="flex gap-1 bg-[#0B1E3A]/60 rounded-lg p-0.5">
                                        <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#1E90FF] text-white shadow-md' : 'text-[#AFC8E6]'}`}><Grid3x3 size={12} /></button>
                                        <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-[#1E90FF] text-white shadow-md' : 'text-[#AFC8E6]'}`}><List size={12} /></button>
                                    </div>
                                    <select id="sort-by" name="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[10px] bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg px-2 py-1 text-[#EAF3FF]">
                                        <option value="price">Precio</option>
                                        <option value="stock">Stock</option>
                                        <option value="demand">Demanda</option>
                                        <option value="margin">Margen</option>
                                        <option value="sales">Ventas</option>
                                    </select>
                                    <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="p-1 rounded bg-[#0B1E3A]/80 border border-[#1E90FF]/30"><ArrowUpDown size={12} className="text-[#AFC8E6]" /></button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3">
                            <AnimatePresence mode="popLayout">
                                {activeTab === 'explorer' && (<motion.div key="explorer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{viewMode === 'grid' ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-stretch">{filteredData.slice(0, 48).map(tire => <TireCard key={tire.id} tire={tire} onCompare={addToComparison} isComparing={comparisonList.some(t => t.id === tire.id)} onAddToCart={addToCart} onClick={() => setSelectedTire(tire)} />)}</div>) : (<div className="space-y-2">{filteredData.slice(0, 48).map(tire => <TireListItem key={tire.id} tire={tire} onCompare={addToComparison} isComparing={comparisonList.some(t => t.id === tire.id)} onAddToCart={addToCart} onClick={() => setSelectedTire(tire)} />)}</div>)}</motion.div>)}
                                {activeTab === 'analytics' && (<motion.div key="analytics" className="space-y-3"><div className="grid grid-cols-1 lg:grid-cols-2 gap-3"><SalesByBrandChart data={filteredData} /><TypeDistributionChart data={filteredData} /></div><DemandHeatmap data={filteredData} /></motion.div>)}
                                {activeTab === 'markets' && (<motion.div key="markets" className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {COUNTRIES.map(c => {
                                            const countryData = filteredData.filter(d => d.country === c);
                                            const totalValue = countryData.reduce((s,i)=>s+i.price*i.stock,0);
                                            const avgMargin = countryData.reduce((s,i)=>s+i.margin,0)/(countryData.length||1);
                                            const critical = countryData.filter(d=>d.stock<10).length;
                                            const growth = Math.floor(Math.random() * 20) - 5; // simulación de crecimiento
                                            return (
                                                <div key={c} className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-3 shadow-lg border border-[#1E90FF]/20 hover:shadow-xl transition-all">
                                                    <div className="flex items-center gap-2 mb-2"><img src={COUNTRY_INFO[c].flagImage} className="w-8 h-8 rounded-full object-cover" /><h3 className="font-bold text-[#EAF3FF]">{COUNTRY_INFO[c].name}</h3></div>
                                                    <div className="space-y-1 text-xs">
                                                        <p>Productos: {countryData.length}</p>
                                                        <p>Valor inventario: ${totalValue.toLocaleString()}</p>
                                                        <p>Stock total: {countryData.reduce((s,i)=>s+i.stock,0)}</p>
                                                        <p>Margen promedio: {avgMargin.toFixed(1)}%</p>
                                                        <p className="flex items-center gap-1">Crecimiento: {growth>=0?<TrendingUp size={10} className="text-emerald-400"/>:<TrendingDown size={10} className="text-red-400"/>} <span className={growth>=0?'text-emerald-400':'text-red-400'}>{growth>=0?'+':''}{growth}%</span></p>
                                                        {critical > 0 && <p className="text-red-400">⚠️ {critical} productos con stock crítico</p>}
                                                    </div>
                                                    <button onClick={() => updateFilter('country', c)} className="mt-2 w-full py-1 bg-[#0B1E3A]/80 rounded-lg text-xs text-[#1E90FF] border border-[#1E90FF]/30 hover:bg-[#1E4D7A] transition-all">Ver mercado</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* Gráfico comparativo de precios */}
                                    <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
                                        <h3 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2"><GitCompare size={14} className="text-[#1E90FF]" /> Comparativa de Precios por País</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead className="text-[#AFC8E6] border-b border-[#1E90FF]/20">
                                                    <tr><th className="text-left py-2">Marca / Medida</th><th className="text-right py-2">México (MXN)</th><th className="text-right py-2">Colombia (COP)</th><th className="text-right py-2">Panamá (USD)</th><th className="text-right py-2">Diferencia</th></tr>
                                                </thead>
                                                <tbody>
                                                    {filteredData.slice(0, 8).map(tire => {
                                                        const sameProduct = filteredData.filter(d => d.brand === tire.brand && d.model === tire.model && d.size === tire.size);
                                                        const mx = sameProduct.find(d=>d.country==='MX')?.price || '-';
                                                        const co = sameProduct.find(d=>d.country==='CO')?.price || '-';
                                                        const pa = sameProduct.find(d=>d.country==='PA')?.price || '-';
                                                        const diff = (typeof mx === 'number' && typeof pa === 'number') ? ((mx - pa*18.5)/mx*100).toFixed(0) : '-';
                                                        return (
                                                            <tr key={tire.id} className="border-b border-[#1E90FF]/10 hover:bg-[#1E4D7A]/20 transition-colors">
                                                                <td className="py-2 text-[#EAF3FF]">{tire.brand} {tire.size}</td>
                                                                <td className="text-right text-[#1E90FF]">{mx !== '-' ? `$${mx.toLocaleString()}` : '-'}</td>
                                                                <td className="text-right text-[#1E90FF]">{co !== '-' ? `$${co.toLocaleString()}` : '-'}</td>
                                                                <td className="text-right text-[#1E90FF]">{pa !== '-' ? `$${pa.toLocaleString()}` : '-'}</td>
                                                                <td className={`text-right ${diff !== '-' && parseInt(diff) > 10 ? 'text-red-400' : 'text-emerald-400'}`}>{diff !== '-' ? `${diff}%` : '-'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>)}
                            </AnimatePresence>
                        </div>
                        <div className="px-3 py-2 border-t border-[#1E90FF]/20 text-center text-[9px] text-[#AFC8E6]">NeumatiQ · {filteredData.length} productos · Datos en tiempo real · Desarrollado por GProA Technology</div>
                    </div>
                </div>
                
                {/* Modales */}
                <AnimatePresence>{showSaveSearchModal && (<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"><div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 w-80 border border-[#1E90FF]/20"><h3 className="font-bold text-[#EAF3FF] mb-3">Guardar búsqueda</h3><label htmlFor="search-name" className="sr-only">Nombre de búsqueda</label><input id="search-name" name="search-name" type="text" placeholder="Nombre" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm mb-3" /><div className="flex gap-2"><button onClick={saveSearch} className="flex-1 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white">Guardar</button><button onClick={() => setShowSaveSearchModal(false)} className="flex-1 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#AFC8E6]">Cancelar</button></div></div></div>)}</AnimatePresence>
                <AnimatePresence>{selectedTire && (<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedTire(null)}><div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl max-w-md w-full p-5" onClick={(e) => e.stopPropagation()}><div className="flex justify-between"><div className="flex gap-3"><img src={selectedTire.logo} className="w-12 h-12 object-contain" /><div><h3 className="font-bold text-[#EAF3FF]">{selectedTire.brand}</h3><p className="text-sm text-[#1E90FF]">{selectedTire.model} {selectedTire.size}</p></div></div><button onClick={() => setSelectedTire(null)}><X /></button></div><div className="grid grid-cols-2 gap-2 mt-4"><div>Precio: <span className="font-bold text-[#1E90FF]">{selectedTire.currency}{selectedTire.price}</span></div><div>Stock: {selectedTire.stock}</div><div>Demanda: {selectedTire.demand}%</div><div>Margen: {selectedTire.margin}%</div></div><div className="flex gap-2 mt-4"><button className="flex-1 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg">Agregar al carrito</button><button className="px-3 py-2 bg-[#0B1E3A]/80 rounded-lg border border-[#1E90FF]/30" onClick={() => addToComparison(selectedTire)}>Comparar</button></div></div></div>)}</AnimatePresence>
                <AnimatePresence>{showAllBrandsModal && <AllBrandsModal brands={brandStats} onClose={() => setShowAllBrandsModal(false)} onSelectBrand={handleSelectBrand} />}</AnimatePresence>
                <ComparisonPanel items={comparisonList} onRemove={removeFromComparison} onClear={clearComparison} />
            </div>
        </div>
    );
};

export default Dashboard;