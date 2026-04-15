// =============================================
// DASHBOARD.JSX – NEUMATIQ
// Sistema de Gestión Integral de Neumáticos
// Desarrollado por GProA Technology
// Comercializado por CH ValueGrowth
// =============================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, LineChart as LineChartIcon, Filter, Search, CheckCircle, 
  GitCompare, X, Package, DollarSign, Zap, AlertCircle, TrendingUp, 
  Database, PanelLeftClose, PanelLeftOpen, ChevronDown,
  Activity, Target, Award, Shield, ShoppingCart, Plus, Minus,
  Save, Bookmark, Download, RefreshCw, Globe, Flag, Info,
  Eye, Grid3x3, List, ArrowUpDown, Star, Clock as ClockIcon,
  TrendingDown, Thermometer, CloudRain, Sun, Truck as TruckIcon,
  Calendar, AlertTriangle as AlertTriangleIcon, User, Bell, LogOut, ChevronDown
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
    ArcElement,
    RadialLinearScale
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
    RadialLinearScale
);

// --------------------------------------------------------------
// 1. CONSTANTES Y DATOS REALISTAS
// --------------------------------------------------------------
const BRANDS = [
    'Michelin', 'Pirelli', 'Bridgestone', 'Continental', 'Goodyear',
    'Dunlop', 'Yokohama', 'Hankook', 'Firestone', 'BF Goodrich',
    'Cooper', 'General Tire', 'Kumho', 'Nexen', 'Toyo',
    'Maxxis', 'Nokian', 'Uniroyal', 'Falken', 'GT Radial'
];

const TIRE_SIZES = [
    { size: '205/55 R16', range: 'R16', width: 205, profile: 55, loadIndex: 91, speedRating: 'V', type: 'Verano' },
    { size: '195/65 R15', range: 'R15', width: 195, profile: 65, loadIndex: 88, speedRating: 'H', type: 'Todo tiempo' },
    { size: '225/45 R17', range: 'R17', width: 225, profile: 45, loadIndex: 94, speedRating: 'W', type: 'Verano' },
    { size: '215/60 R16', range: 'R16', width: 215, profile: 60, loadIndex: 92, speedRating: 'V', type: 'Todo tiempo' },
    { size: '235/55 R17', range: 'R17', width: 235, profile: 55, loadIndex: 95, speedRating: 'Y', type: 'Verano' },
    { size: '245/40 R18', range: 'R18', width: 245, profile: 40, loadIndex: 97, speedRating: 'Y', type: 'Verano' },
    { size: '255/35 R19', range: 'R19', width: 255, profile: 35, loadIndex: 96, speedRating: 'Y', type: 'Verano' },
    { size: '225/55 R18', range: 'R18', width: 225, profile: 55, loadIndex: 98, speedRating: 'W', type: 'Invierno' },
];

const SOURCES = {
    ml: { name: 'MercadoLibre', icon: '🛒', isOfficial: false, country: 'MX' },
    radial: { name: 'Radial Llantas', icon: '🏪', isOfficial: true, country: 'MX' },
    serna: { name: 'Serna', icon: '🏭', isOfficial: true, country: 'MX' },
    contishop: { name: 'ContiShop', icon: '🌐', isOfficial: true, country: 'MX' },
    ml_co: { name: 'MercadoLibre CO', icon: '🛒', isOfficial: false, country: 'CO' },
    llantas_co: { name: 'Llantas Colombia', icon: '🏪', isOfficial: true, country: 'CO' },
    ml_pa: { name: 'MercadoLibre PA', icon: '🛒', isOfficial: false, country: 'PA' },
    llantas_pa: { name: 'Llantas Panamá', icon: '🏪', isOfficial: true, country: 'PA' },
};

const BRAND_LOGOS = {
  'Michelin': '/assets/Michelin.png',
  'Pirelli': '/assets/Pirelli.png',
  'Bridgestone': '/assets/Bridgestone.png',
  'Continental': '/assets/Continental.png',
'Goodyear': '/assets/GoodYear.png',
  'Dunlop': '/assets/Dunlop.png',
  'Yokohama': '/assets/Yokohama.png',
  'Hankook': '/assets/Hankook.png',
  'Firestone': '/assets/Firestone.png',
'BF Goodrich': '/assets/BFGoodrich.jpg',
  'Cooper': '/assets/Cooper.png',
  'General Tire': '/assets/GeneralTire.jpg',
  'Kumho': '/assets/Kumho.png',
  'Nexen': '/assets/Nexen.jpg',
  'Toyo': '/assets/ToyoTire.png',
  'Maxxis': '/assets/Maxxis.png',
  'Nokian': '/assets/Nokian.jpg',
  'Uniroyal': '/assets/Uniroyal.png',
  'Falken': '/assets/Falken.png',
  'GT Radial': '/assets/GT_Radial.png',
};

const PRICES_BY_COUNTRY = {
    MX: { symbol: '$', name: 'MXN', base: 1 },
    CO: { symbol: '$', name: 'COP', base: 0.00025 },
    PA: { symbol: '$', name: 'USD', base: 18.5 }
};

// Generar datos de neumáticos con valores realistas
const generateTireData = () => {
    const data = [];
    let id = 1;
    
    for (const brand of BRANDS.slice(0, 10)) {
        for (const tireSize of TIRE_SIZES) {
            for (const [sourceKey, sourceInfo] of Object.entries(SOURCES)) {
                const country = sourceInfo.country;
                const basePriceMap = { 
                    Michelin: 2850, Pirelli: 2750, Bridgestone: 2650, 
                    Continental: 2700, Goodyear: 2450, Dunlop: 2350,
                    Yokohama: 2250, Hankook: 2150, Firestone: 2050,
                    'BF Goodrich': 2100, Cooper: 2000, 'General Tire': 1950,
                    Kumho: 1900, Nexen: 1850, Toyo: 1950,
                    Maxxis: 1800, Nokian: 2200, Uniroyal: 1750,
                    Falken: 1850, 'GT Radial': 1700
                };
                const basePrice = basePriceMap[brand] || 2200;
                const sizeMultiplier = tireSize.width / 200;
                let finalPrice = basePrice * sizeMultiplier;
                
                if (sourceKey.includes('ml')) finalPrice *= 1.12;
                else finalPrice *= 0.95;
                
                if (country === 'CO') finalPrice *= 110;
                if (country === 'PA') finalPrice /= 18.5;
                
                finalPrice = Math.round(finalPrice / 5) * 5;
                
                let stock;
                const stockRand = Math.random();
                if (stockRand > 0.7) stock = Math.floor(Math.random() * 200) + 100;
                else if (stockRand > 0.4) stock = Math.floor(Math.random() * 80) + 30;
                else stock = Math.floor(Math.random() * 25) + 1;
                
                data.push({
                    id: id++,
                    brand,
                    logo: BRAND_LOGOS[brand] || 'https://cdn-icons-png.flaticon.com/512/888/888848.png',
                    size: tireSize.size,
                    range: tireSize.range,
                    width: tireSize.width,
                    profile: tireSize.profile,
                    loadIndex: tireSize.loadIndex,
                    speedRating: tireSize.speedRating,
                    type: tireSize.type,
                    source: sourceKey,
                    sourceName: sourceInfo.name,
                    price: finalPrice,
                    currency: PRICES_BY_COUNTRY[country].symbol,
                    currencyName: PRICES_BY_COUNTRY[country].name,
                    country,
                    countryFlag: country === 'MX' ? '🇲🇽' : country === 'CO' ? '🇨🇴' : '🇵🇦',
                    isOfficial: sourceInfo.isOfficial,
                    stock,
                    demand: Math.floor(Math.random() * 40) + 30,
                    salesLastMonth: Math.floor(Math.random() * 30) + 3,
                    margin: Math.floor(Math.random() * 12) + 18,
                    rotation: Math.floor(Math.random() * 50) + 25,
                    scrapedAt: new Date().toISOString(),
                });
            }
        }
    }
    return data;
};

// Datos estacionales para el Predictor
const seasonalData = {
    'Michelin': { forecast: '+15%', season: 'Verano', recommendation: 'Aumentar stock 20%', color: 'emerald' },
    'Pirelli': { forecast: '+22%', season: 'Racing', recommendation: 'Priorizar pedidos', color: 'emerald' },
    'Bridgestone': { forecast: '-5%', season: 'Invierno', recommendation: 'Reducir inventario', color: 'red' },
    'Continental': { forecast: '+18%', season: 'Todo tiempo', recommendation: 'Stock óptimo', color: 'emerald' },
    'Goodyear': { forecast: '+8%', season: 'Verano', recommendation: 'Mantener nivel', color: 'amber' },
    'BF Goodrich': { forecast: '+30%', season: 'Lluvias', recommendation: 'Urgente aumentar stock', color: 'emerald' },
    'Hankook': { forecast: '-3%', season: 'Invierno', recommendation: 'Reducir pedidos', color: 'red' },
    'Yokohama': { forecast: '+12%', season: 'Verano', recommendation: 'Stock adecuado', color: 'emerald' },
};

// --------------------------------------------------------------
// 2. CUSTOM HOOKS
// --------------------------------------------------------------
const useTireData = () => {
    const [state, setState] = useState({ data: [], loading: true, error: null });
    const [savedSearches, setSavedSearches] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setState(prev => ({ ...prev, loading: true }));
                await new Promise(resolve => setTimeout(resolve, 1000));
                const mockData = generateTireData();
                setState({ data: mockData, loading: false, error: null });
                
                const saved = localStorage.getItem('neumatiq_saved_searches');
                if (saved) setSavedSearches(JSON.parse(saved));
            } catch (err) {
                setState({ data: [], loading: false, error: 'Error al cargar datos' });
            }
        };
        fetchData();
    }, []);

    const saveSearch = useCallback((searchParams) => {
        const newSearch = { id: Date.now(), ...searchParams, createdAt: new Date().toISOString() };
        const updated = [newSearch, ...savedSearches].slice(0, 10);
        setSavedSearches(updated);
        localStorage.setItem('neumatiq_saved_searches', JSON.stringify(updated));
    }, [savedSearches]);

    return { ...state, savedSearches, saveSearch };
};

const useAdvancedFilters = (data) => {
    const [filters, setFilters] = useState({
        searchTerm: '',
        brands: [],
        sizes: [],
        types: [],
        priceMin: '',
        priceMax: '',
        stockMin: '',
        stockMax: '',
        marginMin: '',
        marginMax: '',
        country: 'all',
        onlyOfficial: false,
    });
    const [sortBy, setSortBy] = useState('price');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState('grid');

    const filteredData = useMemo(() => {
        if (!data.length) return [];

        let filtered = data.filter(item => {
            if (filters.searchTerm && !`${item.brand} ${item.size} ${item.type}`.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
            if (filters.brands.length && !filters.brands.includes(item.brand)) return false;
            if (filters.sizes.length && !filters.sizes.includes(item.size)) return false;
            if (filters.types.length && !filters.types.includes(item.type)) return false;
            if (filters.priceMin && item.price < parseInt(filters.priceMin)) return false;
            if (filters.priceMax && item.price > parseInt(filters.priceMax)) return false;
            if (filters.stockMin && item.stock < parseInt(filters.stockMin)) return false;
            if (filters.stockMax && item.stock > parseInt(filters.stockMax)) return false;
            if (filters.marginMin && item.margin < parseInt(filters.marginMin)) return false;
            if (filters.marginMax && item.margin > parseInt(filters.marginMax)) return false;
            if (filters.onlyOfficial && !item.isOfficial) return false;
            if (filters.country !== 'all' && item.country !== filters.country) return false;
            return true;
        });

        filtered.sort((a, b) => {
            let valA, valB;
            switch(sortBy) {
                case 'price': valA = a.price; valB = b.price; break;
                case 'stock': valA = a.stock; valB = b.stock; break;
                case 'demand': valA = a.demand; valB = b.demand; break;
                case 'margin': valA = a.margin; valB = b.margin; break;
                case 'sales': valA = a.salesLastMonth; valB = b.salesLastMonth; break;
                default: valA = a.price; valB = b.price;
            }
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        });
        
        return filtered;
    }, [data, filters, sortBy, sortOrder]);

    const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
    const clearFilters = () => setFilters({
        searchTerm: '', brands: [], sizes: [], types: [], priceMin: '', priceMax: '',
        stockMin: '', stockMax: '', marginMin: '', marginMax: '', country: 'all', onlyOfficial: false
    });

    return { filters, filteredData, updateFilter, clearFilters, sortBy, setSortBy, sortOrder, setSortOrder, viewMode, setViewMode };
};

const useComparison = () => {
    const [comparisonList, setComparisonList] = useState([]);

    const addToComparison = useCallback((tire) => {
        if (comparisonList.some(item => item.id === tire.id)) return;
        setComparisonList(prev => [...prev, tire].slice(0, 4));
    }, [comparisonList]);

    const removeFromComparison = useCallback((tireId) => {
        setComparisonList(prev => prev.filter(item => item.id !== tireId));
    }, []);

    const clearComparison = useCallback(() => {
        setComparisonList([]);
    }, []);

    return { comparisonList, addToComparison, removeFromComparison, clearComparison };
};

// --------------------------------------------------------------
// 3. COMPONENTES
// --------------------------------------------------------------

// Componente de sugerencias en tiempo real
const SearchSuggestions = ({ searchTerm, data, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    
    useEffect(() => {
        if (searchTerm.length < 2) {
            setSuggestions([]);
            return;
        }
        
        const matches = data
            .filter(item => `${item.brand} ${item.size}`.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 10);
        setSuggestions(matches);
    }, [searchTerm, data]);
    
    if (suggestions.length === 0) return null;
    
    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#102A4C] rounded-lg border border-[#1E90FF]/30 shadow-xl z-50 max-h-64 overflow-y-auto pointer-events-auto">
            {suggestions.map(s => (
                <button
                    key={s.id}
                    onClick={() => onSelect(`${s.brand} ${s.size}`)}
                    className="w-full text-left px-3 py-2 text-xs text-[#EAF3FF] hover:bg-[#1E4D7A] transition-colors flex items-center gap-2"
                >
                    <Search size={12} className="text-[#1E90FF]" />
                    <span>{s.brand}</span>
                    <span className="text-[#AFC8E6]">{s.size}</span>
                    <span className="ml-auto text-[10px] text-[#AFC8E6]">⭐ {s.demand}% demanda</span>
                </button>
            ))}
        </div>
    );
};

// Componente de Tarjeta de Marca para el Centro de Inteligencia
const BrandIntelligenceCard = ({ brand, stats, onSelectBrand }) => {
    const seasonalInfo = seasonalData[brand] || { forecast: '+5%', season: 'Normal', recommendation: 'Monitorear', color: 'sky' };
    const marketShare = ((stats.units / stats.totalUnits) * 100).toFixed(1);
    const stockHealth = stats.criticalCount > 0 ? 'critical' : stats.lowCount > 0 ? 'warning' : 'healthy';
    
    const healthColors = {
        healthy: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Stock óptimo' },
        warning: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Stock bajo' },
        critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'Stock crítico' }
    };
    
    const health = healthColors[stockHealth];
    const trendIcon = seasonalInfo.forecast.startsWith('+') ? <TrendingUp size={10} className="text-emerald-400" /> : <TrendingDown size={10} className="text-red-400" />;
    
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => onSelectBrand(brand)}
            className="flex-shrink-0 w-40 bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-3 shadow-lg border border-[#1E90FF]/20 cursor-pointer group transition-all"
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 rounded-xl flex items-center justify-center p-2 mb-2 border border-[#1E90FF]/30">
                    <img src={BRAND_LOGOS[brand]} alt={brand} className="w-12 h-12 object-contain" onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/888/888848.png'} />
                </div>
                <h4 className="font-bold text-[#EAF3FF] text-sm truncate w-full">{brand}</h4>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-[#AFC8E6]">Market Share:</span>
                    <span className="text-xs font-bold text-[#1E90FF]">{marketShare}%</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <div className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${health.bg} ${health.text} border ${health.border}`}>
                        {health.label}
                    </div>
                </div>
                <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-[#1E90FF]/20">
                    <div className="flex items-center gap-1">
                        {trendIcon}
                        <span className={`text-[10px] font-semibold ${seasonalInfo.forecast.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                            {seasonalInfo.forecast}
                        </span>
                    </div>
                    <div className="text-[9px] text-[#AFC8E6]">{seasonalInfo.season}</div>
                </div>
            </div>
        </motion.div>
    );
};

// Componente de Predictor Estacional (PAE)
const SeasonalPredictor = ({ selectedBrand, onClose }) => {
    const seasonalInfo = seasonalData[selectedBrand] || { forecast: '+5%', season: 'Normal', recommendation: 'Monitorear demanda', color: 'sky' };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20 mb-4"
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#EAF3FF] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1E90FF]" />
                    Predictor de Abastecimiento Estacional (PAE) - {selectedBrand}
                </h3>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors">
                    <X className="w-4 h-4 text-[#AFC8E6]" />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-[#0B1E3A]/60 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp size={12} className="text-emerald-400" />
                        <span className="text-[10px] text-[#AFC8E6]">Pronóstico</span>
                    </div>
                    <p className={`text-base font-bold ${seasonalInfo.forecast.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                        {seasonalInfo.forecast}
                    </p>
                </div>
                <div className="bg-[#0B1E3A]/60 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Sun size={12} className="text-amber-400" />
                        <span className="text-[10px] text-[#AFC8E6]">Temporada</span>
                    </div>
                    <p className="text-base font-bold text-[#EAF3FF]">{seasonalInfo.season}</p>
                </div>
                <div className="bg-[#0B1E3A]/60 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <TruckIcon size={12} className="text-[#1E90FF]" />
                        <span className="text-[10px] text-[#AFC8E6]">Recomendación</span>
                    </div>
                    <p className="text-xs font-semibold text-[#1E90FF]">{seasonalInfo.recommendation}</p>
                </div>
                <div className="bg-gradient-to-r from-[#1E90FF]/20 to-[#3B82F6]/20 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <CloudRain size={12} className="text-sky-400" />
                        <span className="text-[10px] text-[#AFC8E6]">Acción sugerida</span>
                    </div>
                    <button className="text-xs font-semibold text-white bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] px-3 py-1 rounded-lg">
                        Generar Orden
                    </button>
                </div>
            </div>
            
            <div className="mt-3 p-2 bg-[#0B1E3A]/40 rounded-lg">
                <p className="text-[10px] text-[#AFC8E6] text-center">
                    💡 Basado en datos históricos y tendencias estacionales. Se recomienda {seasonalInfo.recommendation.toLowerCase()} para la marca {selectedBrand}.
                </p>
            </div>
        </motion.div>
    );
};

// Tarjeta de neumático mejorada
const TireCardEnhanced = ({ tire, onCompare, isComparing, onAddToCart, onClick }) => {
    const stockColors = {
        Alto: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        Medio: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        Crítico: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    
    const getStockLevel = (stock) => {
        if (stock > 80) return 'Alto';
        if (stock > 20) return 'Medio';
        return 'Crítico';
    };
    
    const stockLevel = getStockLevel(tire.stock);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={onClick}
            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20 group cursor-pointer"
        >
            <div className="relative">
                <div className="h-32 bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 flex items-center justify-center">
                    <img src={tire.logo} alt={tire.brand} className="h-16 w-16 object-contain" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <div className="absolute top-2 right-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${stockColors[stockLevel]}`}>
                        Stock {stockLevel}
                    </span>
                </div>
                <div className="absolute top-2 left-2">
                    <span className="text-lg">{tire.countryFlag}</span>
                </div>
            </div>
            
            <div className="p-3">
                <h3 className="font-bold text-[#EAF3FF] text-sm truncate">{tire.brand}</h3>
                <p className="text-xs text-[#AFC8E6]">{tire.size}</p>
                
                <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-xl font-bold text-[#1E90FF]">{tire.currency}{tire.price.toLocaleString()}</span>
                    <span className="text-[10px] text-[#AFC8E6]">{tire.currencyName}</span>
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-[10px] text-[#AFC8E6]">
                    <span>📊 Demanda {tire.demand}%</span>
                    <span>💰 Margen {tire.margin}%</span>
                </div>
                
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(tire); }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all"
                    >
                        <ShoppingCart size={12} />
                        Agregar
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onCompare(tire); }}
                        disabled={isComparing}
                        className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isComparing
                                ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                                : 'bg-[#0B1E3A]/80 text-[#AFC8E6] hover:text-[#1E90FF] border border-[#1E90FF]/30'
                        }`}
                    >
                        <GitCompare size={12} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Vista de lista
const TireListItem = ({ tire, onCompare, isComparing, onAddToCart, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            onClick={onClick}
            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-lg p-3 shadow-lg hover:shadow-xl transition-all border border-[#1E90FF]/20 flex items-center gap-3 cursor-pointer"
        >
            <img src={tire.logo} alt={tire.brand} className="w-10 h-10 object-contain" onError={(e) => e.target.style.display = 'none'} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#EAF3FF] text-sm">{tire.brand}</span>
                    <span className="text-xs text-[#AFC8E6]">{tire.size}</span>
                    <span className="text-xs">{tire.countryFlag}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-[#AFC8E6]">
                    <span>Stock: {tire.stock} uni</span>
                    <span>Demanda: {tire.demand}%</span>
                    <span>Margen: {tire.margin}%</span>
                </div>
            </div>
            <div className="text-right">
                <div className="text-lg font-bold text-[#1E90FF]">{tire.currency}{tire.price.toLocaleString()}</div>
                <div className="flex gap-1 mt-1">
                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(tire); }} className="p-1 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded text-white">
                        <ShoppingCart size={12} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onCompare(tire); }} className="p-1 bg-[#0B1E3A]/80 rounded border border-[#1E90FF]/30">
                        <GitCompare size={12} className="text-[#AFC8E6]" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Tarjeta de mercado por país
const CountryMarketCard = ({ country, data, onViewDetails }) => {
    const countryInfo = {
        MX: { 
            name: 'México', 
            flag: '🇲🇽', 
            color: 'from-green-600 to-red-600',
            flagImage: '/assets/MEXICO.jpeg',
            alt: 'Bandera de México'
        },
        CO: { 
            name: 'Colombia', 
            flag: '🇨🇴', 
            color: 'from-yellow-600 to-blue-600 to-red-600',
            flagImage: '/assets/COLOMBIA.jpeg',
            alt: 'Bandera de Colombia'
        },
        PA: { 
            name: 'Panamá', 
            flag: '🇵🇦', 
            color: 'from-blue-600 to-red-600',
            flagImage: '/assets/PANAMA.jpeg',
            alt: 'Bandera de Panamá'
        },
    };
    
    const info = countryInfo[country];
    const countryData = data.filter(d => d.country === country);
    const totalValue = countryData.reduce((sum, d) => sum + (d.price * d.stock), 0);
    const totalSales = countryData.reduce((sum, d) => sum + d.salesLastMonth, 0);
    const avgMargin = countryData.reduce((sum, d) => sum + d.margin, 0) / (countryData.length || 1);
    const avgRotation = countryData.reduce((sum, d) => sum + d.rotation, 0) / (countryData.length || 1);
    const criticalStock = countryData.filter(d => d.stock < 10).length;
    
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <img 
                            src={info.flagImage}
                            alt={info.alt}
                            className="w-full h-full rounded-full object-cover shadow-md border-2 border-[#1E90FF]/30"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<span class="text-2xl">${info.flag}</span>`;
                            }}
                        />
                    </div>
                    <h3 className="font-bold text-[#EAF3FF]">{info.name}</h3>
                </div>
                {criticalStock > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                        ⚠️ {criticalStock} alertas
                    </span>
                )}
            </div>
            
            <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                    <span className="text-[#AFC8E6]">Neumáticos</span>
                    <span className="font-semibold text-[#EAF3FF]">{countryData.length}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#AFC8E6]">Valor inventario</span>
                    <span className="font-semibold text-[#1E90FF]">${totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#AFC8E6]">Ventas mensuales</span>
                    <span className="font-semibold text-[#EAF3FF]">{totalSales} uni</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#AFC8E6]">Margen promedio</span>
                    <span className={`font-semibold ${avgMargin > 25 ? 'text-emerald-400' : 'text-amber-400'}`}>{avgMargin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#AFC8E6]">Rotación (días)</span>
                    <span className="font-semibold text-[#EAF3FF]">{avgRotation.toFixed(0)} días</span>
                </div>
            </div>
            
            <button
                onClick={() => onViewDetails(country)}
                className="w-full mt-3 py-1.5 bg-[#0B1E3A]/80 rounded-lg text-xs text-[#1E90FF] border border-[#1E90FF]/30 hover:bg-[#1E4D7A] transition-all"
            >
                Ver detalle
            </button>
        </motion.div>
    );
};

// Modal de vista detallada
const TireDetailModal = ({ tire, onClose }) => {
    if (!tire) return null;
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl max-w-md w-full p-5 border border-[#1E90FF]/20 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <img src={tire.logo} alt={tire.brand} className="w-12 h-12 object-contain" />
                        <div>
                            <h3 className="font-bold text-[#EAF3FF]">{tire.brand}</h3>
                            <p className="text-sm text-[#1E90FF]">{tire.size}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-[#AFC8E6] hover:text-[#EAF3FF]">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2 p-3 bg-[#0B1E3A]/60 rounded-lg">
                        <div><span className="text-[#AFC8E6]">Precio:</span> <span className="font-bold text-[#1E90FF]">{tire.currency}{tire.price.toLocaleString()}</span></div>
                        <div><span className="text-[#AFC8E6]">Stock:</span> <span className="font-bold">{tire.stock} unidades</span></div>
                        <div><span className="text-[#AFC8E6]">Demanda:</span> <span className="font-bold">{tire.demand}%</span></div>
                        <div><span className="text-[#AFC8E6]">Margen:</span> <span className="font-bold">{tire.margin}%</span></div>
                        <div><span className="text-[#AFC8E6]">Carga:</span> <span className="font-bold">{tire.loadIndex}</span></div>
                        <div><span className="text-[#AFC8E6]">Velocidad:</span> <span className="font-bold">{tire.speedRating}</span></div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-medium flex items-center justify-center gap-2">
                            <ShoppingCart size={16} /> Agregar al carrito
                        </button>
                        <button className="px-3 py-2 bg-[#0B1E3A]/80 rounded-lg border border-[#1E90FF]/30 text-[#1E90FF]">
                            <GitCompare size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Gráfico de ventas por marca
const SalesByBrandChart = ({ data }) => {
    const salesByBrand = useMemo(() => {
        const brandMap = new Map();
        data.forEach(item => {
            brandMap.set(item.brand, (brandMap.get(item.brand) || 0) + item.salesLastMonth);
        });
        return Array.from(brandMap.entries()).map(([brand, sales]) => ({ brand, sales })).slice(0, 10);
    }, [data]);

    const chartData = {
        labels: salesByBrand.map(b => b.brand),
        datasets: [{
            label: 'Ventas (unidades)',
            data: salesByBrand.map(b => b.sales),
            backgroundColor: 'rgba(30, 144, 255, 0.6)',
            borderColor: '#1E90FF',
            borderWidth: 2,
            borderRadius: 8,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#AFC8E6', font: { size: 11 } } },
            tooltip: { backgroundColor: '#0B1E3A', titleColor: '#EAF3FF', bodyColor: '#AFC8E6', borderColor: '#1E90FF', borderWidth: 1 }
        },
        scales: {
            y: { grid: { color: 'rgba(30, 144, 255, 0.1)' }, ticks: { color: '#AFC8E6' } },
            x: { ticks: { color: '#AFC8E6', rotation: 45, autoSkip: true } }
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
            <h3 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1E90FF]" />
                Ventas por Marca (último mes)
            </h3>
            <div className="h-64"><Bar data={chartData} options={options} /></div>
        </div>
    );
};

// Gráfico de distribución por tipo
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
            backgroundColor: ['#1E90FF', '#3B82F6', '#06B6D4', '#0891B2'],
            borderWidth: 0,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#AFC8E6', font: { size: 10 } } },
            tooltip: { backgroundColor: '#0B1E3A', titleColor: '#EAF3FF', bodyColor: '#AFC8E6' }
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
            <h3 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-[#1E90FF]" />
                Distribución por Tipo
            </h3>
            <div className="h-64"><Doughnut data={chartData} options={options} /></div>
        </div>
    );
};

// Heatmap de medidas más demandadas
const DemandHeatmap = ({ data }) => {
    const demandBySize = useMemo(() => {
        const sizeMap = new Map();
        data.forEach(item => {
            sizeMap.set(item.size, (sizeMap.get(item.size) || 0) + item.demand);
        });
        return Array.from(sizeMap.entries())
            .map(([size, demand]) => ({ size, demand }))
            .sort((a, b) => b.demand - a.demand)
            .slice(0, 8);
    }, [data]);

    const maxDemand = Math.max(...demandBySize.map(d => d.demand));

    return (
        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
            <h3 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#1E90FF]" />
                Medidas Más Demandadas (Heatmap)
            </h3>
            <div className="space-y-2">
                {demandBySize.map(({ size, demand }) => (
                    <div key={size} className="flex items-center gap-2">
                        <span className="text-xs text-[#AFC8E6] w-24 truncate">{size}</span>
                        <div className="flex-1 h-6 bg-[#0B1E3A] rounded-lg overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(demand / maxDemand) * 100}%` }}
                                className="h-full bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg flex items-center justify-end px-2"
                            >
                                <span className="text-[10px] text-white font-medium">{demand}%</span>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Gráfico de Stock Crítico
const CriticalStockChart = ({ data }) => {
    const criticalStockByBrand = useMemo(() => {
        const brandMap = new Map();
        data.forEach(item => {
            if (item.stock < 10) {
                brandMap.set(item.brand, (brandMap.get(item.brand) || 0) + 1);
            }
        });
        return Array.from(brandMap.entries()).map(([brand, count]) => ({ brand, count })).slice(0, 10);
    }, [data]);

    const chartData = {
        labels: criticalStockByBrand.map(c => c.brand),
        datasets: [{
            label: 'Productos con stock crítico (<10 unidades)',
            data: criticalStockByBrand.map(c => c.count),
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            borderColor: '#EF4444',
            borderWidth: 2,
            borderRadius: 8,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#AFC8E6', font: { size: 11 } } },
            tooltip: { backgroundColor: '#0B1E3A', titleColor: '#EAF3FF', bodyColor: '#AFC8E6', borderColor: '#EF4444', borderWidth: 1 }
        },
        scales: {
            y: { grid: { color: 'rgba(30, 144, 255, 0.1)' }, ticks: { color: '#AFC8E6' }, title: { display: true, text: 'Cantidad', color: '#AFC8E6' } },
            x: { ticks: { color: '#AFC8E6', rotation: 45, autoSkip: true } }
        }
    };

    const totalCritical = criticalStockByBrand.reduce((sum, c) => sum + c.count, 0);

    return (
        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#EAF3FF] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    Stock Crítico por Marca
                </h3>
                <span className="text-xs text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/30">
                    Total: {totalCritical} productos
                </span>
            </div>
            {criticalStockByBrand.length > 0 ? (
                <div className="h-64"><Bar data={chartData} options={options} /></div>
            ) : (
                <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-[#AFC8E6]">
                        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                        <p className="text-sm">No hay productos con stock crítico</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Gráfico de Demanda
const DemandChart = ({ data }) => {
    const demandBySize = useMemo(() => {
        const sizeMap = new Map();
        data.forEach(item => {
            sizeMap.set(item.size, (sizeMap.get(item.size) || 0) + item.demand);
        });
        return Array.from(sizeMap.entries())
            .map(([size, demand]) => ({ size, demand }))
            .sort((a, b) => b.demand - a.demand)
            .slice(0, 8);
    }, [data]);

    const chartData = {
        labels: demandBySize.map(d => d.size),
        datasets: [{
            label: 'Nivel de Demanda (%)',
            data: demandBySize.map(d => d.demand),
            backgroundColor: 'rgba(30, 144, 255, 0.6)',
            borderColor: '#1E90FF',
            borderWidth: 2,
            borderRadius: 8,
            fill: true,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#AFC8E6', font: { size: 11 } } },
            tooltip: { backgroundColor: '#0B1E3A', titleColor: '#EAF3FF', bodyColor: '#AFC8E6', borderColor: '#1E90FF', borderWidth: 1 }
        },
        scales: {
            y: { 
                grid: { color: 'rgba(30, 144, 255, 0.1)' }, 
                ticks: { color: '#AFC8E6' }, 
                title: { display: true, text: 'Demanda (%)', color: '#AFC8E6' },
                min: 0,
                max: 100
            },
            x: { ticks: { color: '#AFC8E6', rotation: 45, autoSkip: true } }
        }
    };

    const avgDemand = demandBySize.reduce((sum, d) => sum + d.demand, 0) / (demandBySize.length || 1);

    return (
        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#EAF3FF] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Demanda por Medida
                </h3>
                <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Promedio: {avgDemand.toFixed(0)}%
                </span>
            </div>
            <div className="h-64"><Bar data={chartData} options={options} /></div>
        </div>
    );
};

// Panel de comparación
const ComparisonPanel = ({ items, onRemove, onClear }) => {
    if (items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-3 shadow-2xl border border-[#1E90FF]/30 max-w-sm w-80 z-40"
        >
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-[#EAF3FF] flex items-center gap-1">
                    <GitCompare size={16} className="text-[#1E90FF]" />
                    Comparación ({items.length}/4)
                </h4>
                <button onClick={onClear} className="text-red-400 hover:text-red-300 text-sm">
                    Limpiar
                </button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
                {items.map(item => (
                    <div key={item.id} className="flex items-center gap-2 p-2 bg-[#0B1E3A]/50 rounded-lg">
                        <img src={item.logo} alt={item.brand} className="w-8 h-8 rounded" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#EAF3FF] truncate">{item.brand} {item.size}</p>
                            <p className="text-[10px] text-[#1E90FF]">{item.currency}{item.price}</p>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="p-1 text-red-400 hover:text-red-300">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// --------------------------------------------------------------
// 4. DASHBOARD PRINCIPAL
// --------------------------------------------------------------
const Dashboard = () => {
    const { data: tireData, loading, error, savedSearches, saveSearch } = useTireData();
    const { 
        filters, filteredData, updateFilter, clearFilters,
        sortBy, setSortBy, sortOrder, setSortOrder, viewMode, setViewMode
    } = useAdvancedFilters(tireData);
    const { comparisonList, addToComparison, removeFromComparison, clearComparison } = useComparison();
    
    const [activeTab, setActiveTab] = useState('explorer');
    const [showFilters, setShowFilters] = useState(true);
    const [selectedTire, setSelectedTire] = useState(null);
    const [cart, setCart] = useState([]);
    const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

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
        window.location.href = '/login';
    };
    
    // KPIs con valores realistas
    const kpis = useMemo(() => {
        const totalStock = filteredData.reduce((sum, p) => sum + p.stock, 0);
        const totalValue = filteredData.reduce((sum, p) => sum + (p.price * p.stock), 0);
        const avgMargin = filteredData.reduce((sum, p) => sum + p.margin, 0) / (filteredData.length || 1);
        const avgRotation = filteredData.reduce((sum, p) => sum + p.rotation, 0) / (filteredData.length || 1);
        const lowStock = filteredData.filter(p => p.stock < 10);
        
        return { totalStock, totalValue, avgMargin, avgRotation, lowStock };
    }, [filteredData]);
    
    // Datos para el Centro de Inteligencia de Marcas
    const brandIntelligence = useMemo(() => {
        const brandMap = new Map();
        let totalUnits = 0;
        
        filteredData.forEach(item => {
            totalUnits += item.stock;
            if (!brandMap.has(item.brand)) {
                brandMap.set(item.brand, { units: 0, margin: 0, count: 0, criticalCount: 0, lowCount: 0 });
            }
            const brandData = brandMap.get(item.brand);
            brandData.units += item.stock;
            brandData.margin += item.margin;
            brandData.count++;
            if (item.stock < 5) brandData.criticalCount++;
            else if (item.stock < 20) brandData.lowCount++;
        });
        
        return Array.from(brandMap.entries()).map(([brand, data]) => ({
            brand,
            units: data.units,
            avgMargin: data.margin / data.count,
            criticalCount: data.criticalCount,
            lowCount: data.lowCount,
            totalUnits
        })).sort((a, b) => b.units - a.units);
    }, [filteredData]);
    
    const countryMarkets = ['MX', 'CO', 'PA'];
    
    const addToCart = useCallback((tire) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === tire.id);
            if (existing) {
                return prev.map(item => item.id === tire.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...tire, quantity: 1 }];
        });
    }, []);
    
    const handleSaveSearch = useCallback(() => {
        if (!searchName.trim()) return;
        saveSearch({ name: searchName, filters, sortBy, sortOrder });
        setSearchName('');
        setShowSaveSearchModal(false);
    }, [searchName, filters, sortBy, sortOrder, saveSearch]);
    
    const loadSavedSearch = useCallback((search) => {
        updateFilter('searchTerm', search.filters.searchTerm || '');
        updateFilter('brands', search.filters.brands || []);
        updateFilter('sizes', search.filters.sizes || []);
        updateFilter('priceMin', search.filters.priceMin || '');
        updateFilter('priceMax', search.filters.priceMax || '');
        setSortBy(search.sortBy || 'price');
        setSortOrder(search.sortOrder || 'asc');
    }, [updateFilter, setSortBy, setSortOrder]);
    
    const handleSelectBrand = useCallback((brand) => {
        setSelectedBrand(brand);
        updateFilter('brands', [brand]);
        setTimeout(() => {
            const element = document.getElementById('explorer-tab');
            if (element) element.click();
        }, 100);
    }, [updateFilter]);
    
    if (loading) return (
        <div className="h-screen w-full bg-[#0B1E3A] flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#1E90FF]/30 border-t-[#1E90FF] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#AFC8E6]">Cargando NeumatiQ...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="h-screen w-full bg-[#0B1E3A] flex items-center justify-center">
            <div className="text-center bg-[#163A6B] p-6 rounded-xl border border-red-500/30">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-[#AFC8E6]">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white rounded-lg">Reintentar</button>
            </div>
        </div>
    );
    
    return (
        <div className="h-screen w-full overflow-hidden bg-[#0B1E3A]">
            <div className="h-full w-full flex flex-col p-3 md:p-4">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="bg-gradient-to-r from-[#0B1E3A]/90 to-[#102A4C]/90 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-[#1E90FF]/20 mb-3 flex-shrink-0"
                >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-transparent rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 overflow-hidden">
                                <img 
                                    src="/assets/Logo_de_NeumatiQ-.png" 
                                    alt="NeumatiQ Logo" 
                                    className="w-full h-full object-contain rounded-full" 
                                />
                            </div>
                            <div>
                                <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] bg-clip-text text-transparent">NeumatiQ</h1>
                                <p className="text-[9px] text-[#AFC8E6] hidden sm:block">Sistema de Gestión Integral para Neumáticos</p>
                            </div>
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative z-[9999]">
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-900/50 transition-all group border border-blue-900/50"
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-[#1E90FF] to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/20">
                                    CH
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-sm font-bold text-white truncate">Carlos Rafael</p>
                                    <p className="text-xs text-blue-200">Administrador</p>
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
                                        className="absolute top-full right-0 mt-2 w-72 bg-[#020617] rounded-2xl shadow-2xl border border-blue-900/50 backdrop-blur-xl overflow-hidden z-[10000]"
                                    >
                                        <div className="p-5 border-b border-blue-900/50 bg-gradient-to-b from-blue-900/50 to-transparent">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-[#1E90FF] to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                                    CH
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">Carlos Rafael Heredia Loperena</p>
                                                    <p className="text-xs text-blue-200">carlos@neumatiq.com</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2 space-y-1">
                                            <button className="w-full text-left px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-900/50 hover:text-white transition-all flex items-center gap-3">
                                                <User size={16} />
                                                Mi Perfil
                                            </button>
                                            <button className="w-full text-left px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-900/50 hover:text-white transition-all flex items-center gap-3">
                                                <Bell size={16} />
                                                Notificaciones
                                            </button>
                                            <button className="w-full text-left px-4 py-3 rounded-xl text-blue-200 hover:bg-blue-900/50 hover:text-white transition-all flex items-center gap-3">
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
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Búsqueda inteligente */}
                        <div className="flex-1 max-w-md relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1E90FF]" />
                            <input
                                type="text"
                                placeholder="Buscar marca, medida o tipo..."
                                value={filters.searchTerm}
                                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF] placeholder-[#AFC8E6]/50 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                            />
                            <SearchSuggestions 
                                searchTerm={filters.searchTerm} 
                                data={tireData} 
                                onSelect={(value) => updateFilter('searchTerm', value)} 
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-1.5 rounded-lg bg-[#102A4C] border border-[#1E90FF]/30 text-[#1E90FF]">
                                {showFilters ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                            </button>
                            <div className="flex items-center gap-1 bg-[#102A4C]/80 rounded-lg p-0.5 border border-[#1E90FF]/20">
                                {[
                                    { value: 'all', label: 'Todos', icon: '🌎' },
                                    { value: 'MX', label: 'México', image: '/assets/MEXICO.jpeg' },
                                    { value: 'CO', label: 'Colombia', image: '/assets/COLOMBIA.jpeg' },
                                    { value: 'PA', label: 'Panamá', image: '/assets/PANAMA.jpeg' },
                                ].map(c => (
                                    <button 
                                        key={c.value} 
                                        onClick={() => updateFilter('country', c.value)} 
                                        className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                                            filters.country === c.value 
                                                ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md' 
                                                : 'text-[#AFC8E6] hover:bg-[#1E4D7A]'
                                        }`}
                                    >
                                        {c.value === 'all' ? c.icon : <img src={c.image} alt={c.label} className="w-3.5 h-3.5 rounded-full object-cover inline-block mr-1 -mt-0.5" />} {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* KPIs animados */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3"
                >
                    {[
                        { label: 'Total Stock', value: kpis.totalStock.toLocaleString(), icon: Package, color: 'from-sky-400 to-blue-500', tooltip: 'Total de neumáticos en inventario' },
                        { label: 'Valor Inventario', value: `$${(kpis.totalValue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'from-emerald-400 to-teal-500', tooltip: 'Valor total del inventario' },
                        { label: 'Margen Promedio', value: `${kpis.avgMargin.toFixed(1)}%`, icon: TrendingUp, color: 'from-amber-400 to-orange-500', tooltip: 'Margen de ganancia promedio' },
                        { label: 'Rotación (días)', value: `${kpis.avgRotation.toFixed(0)} días`, icon: ClockIcon, color: 'from-purple-400 to-pink-500', tooltip: 'Días promedio de rotación de inventario' },
                        { label: 'Stock Crítico', value: kpis.lowStock.length, icon: AlertCircle, color: 'from-red-400 to-rose-500', tooltip: 'Productos con stock bajo (<10 unidades)' },
                    ].map((kpi, idx) => (
                        <div key={kpi.label} className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-lg p-2 shadow-lg border border-[#1E90FF]/20 group relative">
                            <div className="flex items-center justify-between">
                                <div className={`p-1 bg-gradient-to-br ${kpi.color} rounded-lg text-white`}>
                                    <kpi.icon size={12} />
                                </div>
                                <div className="relative">
                                    <Info size={10} className="text-[#AFC8E6] cursor-help" />
                                    <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block bg-[#0B1E3A] text-[10px] text-[#AFC8E6] px-2 py-1 rounded whitespace-nowrap z-10 border border-[#1E90FF]/30">
                                        {kpi.tooltip}
                                    </div>
                                </div>
                            </div>
                            <p className="text-lg font-bold text-[#EAF3FF] mt-1">{kpi.value}</p>
                            <p className="text-[9px] text-[#AFC8E6]">{kpi.label}</p>
                        </div>
                    ))}
                </motion.div>
                
                {/* CENTRO DE INTELIGENCIA DE MARCAS - NUEVA SECCIÓN */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-semibold text-[#EAF3FF] flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#1E90FF]" />
                            Marcas Detectadas en Sistema
                            <span className="text-[10px] text-[#AFC8E6] font-normal">({brandIntelligence.length} marcas activas)</span>
                        </h2>
                        <button className="text-[10px] text-[#1E90FF] hover:text-[#3B82F6] transition-colors">
                            Ver todas
                        </button>
                    </div>
                    <div className="overflow-x-auto pb-2">
                        <div className="flex gap-3">
                            {brandIntelligence.slice(0, 10).map((brand) => (
                                <BrandIntelligenceCard 
                                    key={brand.brand} 
                                    brand={brand.brand} 
                                    stats={brand}
                                    onSelectBrand={handleSelectBrand}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* PREDICTOR DE ABASTECIMIENTO ESTACIONAL (PAE) */}
                <AnimatePresence>
                    {selectedBrand && (
                        <SeasonalPredictor 
                            selectedBrand={selectedBrand} 
                            onClose={() => setSelectedBrand(null)} 
                        />
                    )}
                </AnimatePresence>
                
                {/* Tabs y contenido principal */}
                <div className="flex-1 flex gap-3 overflow-hidden min-h-0">
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="lg:w-80 flex-shrink-0 overflow-hidden">
                                <div className="h-full overflow-y-auto space-y-3 pr-1">
                                    {/* Filtros avanzados */}
                                    <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-3 shadow-lg border border-[#1E90FF]/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xs font-semibold text-[#EAF3FF] flex items-center gap-1">
                                                <Filter className="w-3 h-3 text-[#1E90FF]" />
                                                Filtros Avanzados
                                            </h3>
                                            <button onClick={clearFilters} className="text-[10px] text-[#1E90FF] hover:text-[#3B82F6]">Limpiar</button>
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <label className="text-[10px] text-[#AFC8E6] block mb-1">Marcas</label>
                                                <select 
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        updateFilter('brands', value ? [value] : []);
                                                    }}
                                                    className="w-full px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF]"
                                                >
                                                    <option value="">Todas</option>
                                                    {BRANDS.slice(0, 10).map(b => <option key={b} value={b}>{b}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-[#AFC8E6] block mb-1">Medida</label>
                                                <select 
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        updateFilter('sizes', value ? [value] : []);
                                                    }}
                                                    className="w-full px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF]"
                                                >
                                                    <option value="">Todas</option>
                                                    {TIRE_SIZES.map(s => <option key={s.size} value={s.size}>{s.size}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-[#AFC8E6] block mb-1">Tipo</label>
                                                <select 
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        updateFilter('types', value ? [value] : []);
                                                    }}
                                                    className="w-full px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF]"
                                                >
                                                    <option value="">Todos</option>
                                                    <option value="Verano">Verano</option>
                                                    <option value="Invierno">Invierno</option>
                                                    <option value="Todo tiempo">Todo tiempo</option>
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="number" placeholder="Precio min" value={filters.priceMin} onChange={(e) => updateFilter('priceMin', e.target.value)} className="px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF] placeholder-[#AFC8E6]/50" />
                                                <input type="number" placeholder="Precio max" value={filters.priceMax} onChange={(e) => updateFilter('priceMax', e.target.value)} className="px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF] placeholder-[#AFC8E6]/50" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="number" placeholder="Stock min" value={filters.stockMin} onChange={(e) => updateFilter('stockMin', e.target.value)} className="px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF] placeholder-[#AFC8E6]/50" />
                                                <input type="number" placeholder="Stock max" value={filters.stockMax} onChange={(e) => updateFilter('stockMax', e.target.value)} className="px-2 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF] placeholder-[#AFC8E6]/50" />
                                            </div>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={filters.onlyOfficial} onChange={(e) => updateFilter('onlyOfficial', e.target.checked)} className="w-3 h-3 text-[#1E90FF] rounded" />
                                                <span className="text-[10px] text-[#AFC8E6]">Solo tiendas oficiales</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    {/* Guardar búsqueda */}
                                    <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-3 shadow-lg border border-[#1E90FF]/20">
                                        <button
                                            onClick={() => setShowSaveSearchModal(true)}
                                            className="w-full py-1.5 bg-[#0B1E3A]/80 rounded-lg text-xs text-[#1E90FF] border border-[#1E90FF]/30 hover:bg-[#1E4D7A] transition-all flex items-center justify-center gap-1"
                                        >
                                            <Save size={12} /> Guardar búsqueda actual
                                        </button>
                                    </div>
                                    
                                    {/* Búsquedas guardadas */}
                                    {savedSearches.length > 0 && (
                                        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-3 shadow-lg border border-[#1E90FF]/20">
                                            <h3 className="text-xs font-semibold text-[#EAF3FF] mb-2 flex items-center gap-1">
                                                <Bookmark className="w-3 h-3 text-[#1E90FF]" />
                                                Búsquedas Guardadas
                                            </h3>
                                            <div className="space-y-1">
                                                {savedSearches.map(search => (
                                                    <button
                                                        key={search.id}
                                                        onClick={() => loadSavedSearch(search)}
                                                        className="w-full text-left px-2 py-1 rounded-lg text-[10px] text-[#AFC8E6] hover:bg-[#1E4D7A] transition-colors truncate"
                                                    >
                                                        {search.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Contenido principal */}
                    <div className="flex-1 min-w-0 flex flex-col bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl shadow-lg border border-[#1E90FF]/20 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-[#1E90FF]/20 px-3 pt-2 pb-1 flex-shrink-0">
                            <div className="flex gap-1">
                                {[
                                    { id: 'explorer', label: 'Explorador', icon: <Search className="w-3.5 h-3.5" /> },
                                    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
                                    { id: 'markets', label: 'Mercados', icon: <Globe className="w-3.5 h-3.5" /> },
                                ].map(tab => (
                                    <button 
                                        key={tab.id} 
                                        id={`${tab.id}-tab`}
                                        onClick={() => setActiveTab(tab.id)} 
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium transition-all ${
                                            activeTab === tab.id 
                                                ? 'bg-[#0B1E3A] text-[#1E90FF] shadow-sm border-t border-x border-[#1E90FF]/30' 
                                                : 'text-[#AFC8E6] hover:text-[#EAF3FF] hover:bg-[#1E4D7A]/50'
                                        }`}
                                    >
                                        {tab.icon}{tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1 bg-[#0B1E3A]/60 rounded-lg p-0.5">
                                    <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#1E90FF] text-white' : 'text-[#AFC8E6]'}`}>
                                        <Grid3x3 size={12} />
                                    </button>
                                    <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-[#1E90FF] text-white' : 'text-[#AFC8E6]'}`}>
                                        <List size={12} />
                                    </button>
                                </div>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[10px] bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg px-2 py-1 text-[#EAF3FF]">
                                    <option value="price">Precio</option>
                                    <option value="stock">Stock</option>
                                    <option value="demand">Demanda</option>
                                    <option value="margin">Margen</option>
                                    <option value="sales">Ventas</option>
                                </select>
                                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="p-1 rounded bg-[#0B1E3A]/80 border border-[#1E90FF]/30">
                                    <ArrowUpDown size={12} className="text-[#AFC8E6]" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-3">
                            <AnimatePresence mode="popLayout" key={`dashboard-${activeTab}`}>
                                {activeTab === 'explorer' && (
                                    <motion.div key="explorer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        {viewMode === 'grid' ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                {filteredData.slice(0, 24).map(tire => (
                                                    <TireCardEnhanced 
                                                        key={tire.id} 
                                                        tire={tire} 
                                                        onCompare={addToComparison} 
                                                        isComparing={comparisonList.some(t => t.id === tire.id)}
                                                        onAddToCart={addToCart}
                                                        onClick={() => setSelectedTire(tire)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {filteredData.slice(0, 24).map(tire => (
                                                    <TireListItem 
                                                        key={tire.id} 
                                                        tire={tire} 
                                                        onCompare={addToComparison} 
                                                        isComparing={comparisonList.some(t => t.id === tire.id)}
                                                        onAddToCart={addToCart}
                                                        onClick={() => setSelectedTire(tire)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {filteredData.length === 0 && (
                                            <div className="text-center py-12">
                                                <Package className="w-12 h-12 text-[#1E90FF]/30 mx-auto mb-3" />
                                                <p className="text-[#AFC8E6]">No se encontraron neumáticos</p>
                                                <button onClick={clearFilters} className="mt-3 px-4 py-1.5 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white rounded-lg text-sm">Limpiar filtros</button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                
                                {activeTab === 'analytics' && (
                                    <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                            <SalesByBrandChart data={filteredData} />
                                            <TypeDistributionChart data={filteredData} />
                                        </div>
                                        <DemandHeatmap data={filteredData} />
                                        <CriticalStockChart data={filteredData} />
                                        <DemandChart data={filteredData} />
                                    </motion.div>
                                )}
                                
                                {activeTab === 'markets' && (
                                    <motion.div key="markets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {countryMarkets.map(country => (
                                                <CountryMarketCard 
                                                    key={country} 
                                                    country={country} 
                                                    data={filteredData} 
                                                    onViewDetails={(c) => updateFilter('country', c)}
                                                />
                                            ))}
                                        </div>
                                        
                                        {/* Comparativa de precios entre mercados */}
                                        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
                                            <h3 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2">
                                                <GitCompare className="w-4 h-4 text-[#1E90FF]" />
                                                Comparativa de Precios por Mercado
                                            </h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs">
                                                    <thead className="text-[#AFC8E6] border-b border-[#1E90FF]/20">
                                                        <tr>
                                                            <th className="text-left py-2">Marca / Medida</th>
                                                            <th className="text-right py-2">México (MXN)</th>
                                                            <th className="text-right py-2">Colombia (COP)</th>
                                                            <th className="text-right py-2">Panamá (USD)</th>
                                                            <th className="text-right py-2">Diferencia</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredData.slice(0, 10).map(tire => {
                                                            const mxPrice = filteredData.find(d => d.id === tire.id && d.country === 'MX')?.price || '-';
                                                            const coPrice = filteredData.find(d => d.id === tire.id && d.country === 'CO')?.price || '-';
                                                            const paPrice = filteredData.find(d => d.id === tire.id && d.country === 'PA')?.price || '-';
                                                            return (
                                                                <tr key={tire.id} className="border-b border-[#1E90FF]/10">
                                                                    <td className="py-2 text-[#EAF3FF]">{tire.brand} {tire.size}</td>
                                                                    <td className="text-right text-[#1E90FF]">${mxPrice !== '-' ? mxPrice.toLocaleString() : '-'}</td>
                                                                    <td className="text-right text-[#1E90FF]">${coPrice !== '-' ? coPrice.toLocaleString() : '-'}</td>
                                                                    <td className="text-right text-[#1E90FF]">${paPrice !== '-' ? paPrice.toLocaleString() : '-'}</td>
                                                                    <td className="text-right text-emerald-400">-</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div className="px-3 py-2 border-t border-[#1E90FF]/20 text-center text-[9px] text-[#AFC8E6] flex-shrink-0">
                            NeumatiQ · {filteredData.length} productos · Datos en tiempo real · Desarrollado por GProA Technology
                        </div>
                    </div>
                </div>
                
                {/* Modales */}
                <AnimatePresence>
                    {showSaveSearchModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 w-80 border border-[#1E90FF]/20">
                                <h3 className="font-bold text-[#EAF3FF] mb-3">Guardar búsqueda</h3>
                                <input
                                    type="text"
                                    placeholder="Nombre de la búsqueda"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] mb-3"
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleSaveSearch} className="flex-1 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white text-sm">Guardar</button>
                                    <button onClick={() => setShowSaveSearchModal(false)} className="flex-1 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#AFC8E6] text-sm border border-[#1E90FF]/30">Cancelar</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <AnimatePresence>
                    {selectedTire && <TireDetailModal tire={selectedTire} onClose={() => setSelectedTire(null)} />}
                </AnimatePresence>
                
                <AnimatePresence>
                    {comparisonList.length > 0 && <ComparisonPanel items={comparisonList} onRemove={removeFromComparison} onClear={clearComparison} />}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Componentes auxiliares
const PieChartIcon = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/></svg>;

export default Dashboard;