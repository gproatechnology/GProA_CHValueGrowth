import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, DollarSign, Package, Filter, Search, Eye, 
    ChevronUp, ChevronDown, Zap, Shield, Star, AlertCircle,
    X, BarChart3, Info, Award, Flame, Clock, Server
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
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement,
    Title, Tooltip, Legend, Filler, ArcElement
);

// =============================================
// 1. MAPEO DE LOGOS LOCALES (20 MARCAS)
// =============================================
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
    'GT Radial': '/assets/GT_Radial.png'
};

// Placeholder SVG inline (no depende de internet)
const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%231E4D7A' stroke='%231E90FF' stroke-width='2'/%3E%3Ctext x='32' y='42' text-anchor='middle' fill='%23EAF3FF' font-size='28' font-family='sans-serif'%3E%3C/text%3E%3C/svg%3E";

// Precios base por marca
const BASE_PRICES = {
    premium: ['Michelin', 'Pirelli', 'Bridgestone', 'Continental', 'Goodyear', 'Dunlop', 'Yokohama', 'Hankook', 'Firestone', 'BF Goodrich'],
    value: ['Cooper', 'General Tire', 'Kumho', 'Nexen', 'Toyo', 'Maxxis', 'Nokian', 'Uniroyal', 'Falken', 'GT Radial']
};

const getBrandCategory = (brand) => BASE_PRICES.premium.includes(brand) ? 'premium' : 'value';

const BRAND_MODELS = {
    'Michelin': ['Pilot Sport 4S', 'Energy Saver', 'CrossClimate', 'Primacy 4', 'Latitude Sport'],
    'Pirelli': ['P Zero', 'Cinturato P7', 'Scorpion', 'Winter Sottozero', 'Powergy'],
    'Bridgestone': ['Potenza', 'Turanza', 'Ecopia', 'Dueler', 'Alenza'],
    'Continental': ['PremiumContact 6', 'SportContact 7', 'EcoContact 6', 'AllSeasonContact', 'CrossContact'],
    'Goodyear': ['Eagle F1', 'EfficientGrip', 'Assurance', 'Wrangler', 'UltraGrip'],
    'Dunlop': ['Sport Maxx', 'Grandtrek', 'SP Sport', 'Winter Response', 'Direzza'],
    'Yokohama': ['Advan Sport', 'Geolandar', 'BlueEarth', 'Parada', 'AVID'],
    'Hankook': ['Ventus S1 evo3', 'Kinergy Eco', 'Dynapro', 'iON', 'Winter i*cept'],
    'Firestone': ['Firehawk', 'Destination', 'Champion', 'Winterhawk', 'Transforce'],
    'BF Goodrich': ['All-Terrain T/A KO2', 'Advantage T/A', 'g-Force Comp-2', 'Trail-Terrain', 'Mud-Terrain'],
    'Cooper': ['Discoverer', 'Zeon', 'Evolution', 'CS5', 'ProControl'],
    'General Tire': ['Grabber', 'Altimax', 'G-Max', 'AltiMAX', 'AmeriTrac'],
    'Kumho': ['Ecsta', 'Solus', 'Road Venture', 'Crugen', 'Majesty'],
    'Nexen': ['N Fera', 'N Blue', 'Roadian', 'CP', 'Winguard'],
    'Toyo': ['Proxes', 'Open Country', 'Extensa', 'Celsius', 'NanoEnergy'],
    'Maxxis': ['Victra', 'Premitra', 'Bravo', 'Mecotra', 'MA-Z1'],
    'Nokian': ['Hakkapeliitta', 'WR', 'Powerproof', 'Line', 'eNTYRE'],
    'Uniroyal': ['RainSport', 'Tiger Paw', 'Power Touring', 'Laredo', 'Liberator'],
    'Falken': ['Azenis', 'Ziex', 'Wildpeak', 'Pro', 'Sincera'],
    'GT Radial': ['Champiro', 'Adventure', 'Maxtour', 'Savero', 'Radial']
};

const TIRE_SIZES = ['205/55 R16', '195/65 R15', '225/45 R17', '215/60 R16', '235/55 R17', '245/40 R18', '255/35 R19', '225/55 R18', '275/30 R20', '265/65 R17'];
const TYPES = ['Verano', 'Invierno', 'Todo tiempo', 'Racing', 'Off-Road'];
const COUNTRIES = ['México', 'Japón', 'Alemania', 'Corea del Sur', 'China', 'USA', 'Francia'];
const CERTIFICATIONS = ['DOT', 'NOM', 'E4', 'ISO 9001', 'ECE R30', 'INMETRO'];

const generateProductsData = () => {
    const products = [];
    let id = 1;

    for (const brand of Object.keys(BRAND_LOGOS)) {
        const category = getBrandCategory(brand);
        const models = BRAND_MODELS[brand] || ['Estándar'];
        const numProducts = Math.floor(Math.random() * 4) + 3;

        for (let i = 0; i < numProducts; i++) {
            const model = models[i % models.length];
            const size = TIRE_SIZES[Math.floor(Math.random() * TIRE_SIZES.length)];
            const rim = size.split(' ')[1];
            const type = TYPES[Math.floor(Math.random() * TYPES.length)];
            const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
            const dotYear = 2022 + Math.floor(Math.random() * 5);
            const certification = CERTIFICATIONS[Math.floor(Math.random() * CERTIFICATIONS.length)];
            
            let baseMarketPrice = category === 'premium' ? 2800 + Math.random() * 1200 : 1800 + Math.random() * 1000;
            const width = parseInt(size.split('/')[0]);
            const marketPrice = Math.round(baseMarketPrice * (width / 200) / 10) * 10;
            const discountPercent = category === 'premium' ? 5 + Math.random() * 5 : 15 + Math.random() * 10;
            const ourPrice = Math.round(marketPrice * (1 - discountPercent / 100));
            const savings = marketPrice - ourPrice;
            const savingsPercent = Math.round((savings / marketPrice) * 100);
            const stock = Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : Math.floor(Math.random() * 200) + 30;
            const isLowStock = stock < 15;
            const demand = Math.floor(30 + Math.random() * 60) + (category === 'premium' ? 10 : 0);
            const rating = (3.5 + Math.random() * 1.5).toFixed(1);
            const reviews = Math.floor(Math.random() * 800) + 20;
            const competitors = [
                { name: 'MercadoLibre', price: Math.round(marketPrice * (0.9 + Math.random() * 0.2)) },
                { name: 'Radial Llantas', price: Math.round(ourPrice * (0.95 + Math.random() * 0.1)) },
                { name: 'Serna', price: Math.round(ourPrice * (0.98 + Math.random() * 0.05)) },
                { name: 'ContiShop', price: Math.round(ourPrice * (0.97 + Math.random() * 0.08)) },
            ];
            
            products.push({
                id: id++,
                brand,
                logoUrl: BRAND_LOGOS[brand],
                model,
                size,
                rim,
                type,
                countryOrigin: country,
                dotYear,
                certification,
                marketPrice,
                ourPrice,
                savings,
                savingsPercent,
                stock,
                isLowStock,
                demand,
                rating,
                reviews,
                isBestSeller: demand > 75 && rating > 4.2,
                isHighDiscount: savingsPercent > 18,
                competitors
            });
        }
    }
    return products;
};

// =============================================
// COMPONENTES
// =============================================
const KPIModal = ({ isOpen, onClose, title, data }) => {
    if (!isOpen) return null;
    const chartData = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
            label: title,
            data: data || [65, 72, 68, 80, 75, 85, 82],
            borderColor: '#1E90FF',
            backgroundColor: 'rgba(30,144,255,0.1)',
            fill: true,
            tension: 0.4,
        }]
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#AFC8E6' } },
            tooltip: { backgroundColor: '#0B1E3A', titleColor: '#EAF3FF', bodyColor: '#AFC8E6', borderColor: '#1E90FF', borderWidth: 1 }
        },
        scales: {
            y: { grid: { color: 'rgba(30,144,255,0.1)' }, ticks: { color: '#AFC8E6' } },
            x: { ticks: { color: '#AFC8E6' } }
        }
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-2xl w-full p-6 border border-[#1E90FF]/30 shadow-2xl"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#EAF3FF] flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#1E90FF]" /> {title} - Tendencia Semanal
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A]"><X className="w-5 h-5 text-[#AFC8E6]" /></button>
                </div>
                <div className="h-80"><Line data={chartData} options={options} /></div>
                <div className="mt-4 p-3 bg-[#0B1E3A]/60 rounded-lg text-center text-xs text-[#AFC8E6]">
                    📊 Datos actualizados diariamente.
                </div>
            </motion.div>
        </motion.div>
    );
};

const ProductAnalysisModal = ({ product, onClose }) => {
    if (!product) return null;
    const competitorData = {
        labels: product.competitors.map(c => c.name),
        datasets: [{
            label: 'Precio (MXN)',
            data: product.competitors.map(c => c.price),
            backgroundColor: 'rgba(30,144,255,0.6)',
            borderColor: '#1E90FF',
            borderWidth: 2,
        }]
    };
    const savingsColor = product.savingsPercent > 18 ? 'text-emerald-400' : product.savingsPercent > 10 ? 'text-amber-400' : 'text-red-400';
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-3xl w-full p-6 border border-[#1E90FF]/30 shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <img src={product.logoUrl} alt={product.brand} className="w-12 h-12 rounded-full bg-white p-1 object-contain"
                            onError={(e) => e.target.src = PLACEHOLDER_SVG} />
                        <div><h3 className="text-xl font-bold text-[#EAF3FF]">{product.brand}</h3><p className="text-sm text-[#1E90FF]">{product.model}</p></div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A]"><X className="w-5 h-5 text-[#AFC8E6]" /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="p-2 bg-[#0B1E3A]/60 rounded-lg text-center"><p className="text-[9px] text-[#AFC8E6]">Medida</p><p className="text-sm font-bold text-[#EAF3FF]">{product.size}</p></div>
                    <div className="p-2 bg-[#0B1E3A]/60 rounded-lg text-center"><p className="text-[9px] text-[#AFC8E6]">Rin</p><p className="text-sm font-bold text-[#EAF3FF]">{product.rim}</p></div>
                    <div className="p-2 bg-[#0B1E3A]/60 rounded-lg text-center"><p className="text-[9px] text-[#AFC8E6]">Tipo</p><p className="text-sm font-bold text-[#EAF3FF]">{product.type}</p></div>
                    <div className="p-2 bg-[#0B1E3A]/60 rounded-lg text-center"><p className="text-[9px] text-[#AFC8E6]">Año DOT</p><p className="text-sm font-bold text-[#EAF3FF]">{product.dotYear}</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg"><p className="text-xs text-[#AFC8E6]">Precio Mercado</p><p className="text-xl font-bold text-[#AFC8E6] line-through">${product.marketPrice.toLocaleString()}</p></div>
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg"><p className="text-xs text-[#AFC8E6]">Nuestro Precio</p><p className="text-2xl font-bold text-[#1E90FF]">${product.ourPrice.toLocaleString()}</p></div>
                </div>
                <div className={`p-3 rounded-lg mb-4 text-center ${product.savingsPercent > 18 ? 'bg-emerald-500/20 border border-emerald-500/30' : product.savingsPercent > 10 ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                    <p className="text-xs text-[#AFC8E6]">Ahorro Total</p>
                    <p className={`text-2xl font-bold ${savingsColor}`}>${product.savings.toLocaleString()} ({product.savingsPercent}%)</p>
                </div>
                <h4 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#1E90FF]" /> Comparativa de Precios</h4>
                <div className="h-64 mb-4"><Bar data={competitorData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#AFC8E6' } } } }} /></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    <div className="text-center p-2 bg-[#0B1E3A]/60 rounded-lg"><Star className="w-4 h-4 text-amber-400 mx-auto mb-1" /><p className="text-[9px] text-[#AFC8E6]">Rating</p><p className="text-sm font-bold text-[#EAF3FF]">{product.rating} ★</p></div>
                    <div className="text-center p-2 bg-[#0B1E3A]/60 rounded-lg"><TrendingUp className="w-4 h-4 text-emerald-400 mx-auto mb-1" /><p className="text-[9px] text-[#AFC8E6]">Demanda</p><p className="text-sm font-bold text-[#EAF3FF]">{product.demand}%</p></div>
                    <div className="text-center p-2 bg-[#0B1E3A]/60 rounded-lg"><Package className="w-4 h-4 text-[#1E90FF] mx-auto mb-1" /><p className="text-[9px] text-[#AFC8E6]">Stock</p><p className={`text-sm font-bold ${product.isLowStock ? 'text-red-400' : 'text-emerald-400'}`}>{product.stock} uni</p></div>
                    <div className="text-center p-2 bg-[#0B1E3A]/60 rounded-lg"><Shield className="w-4 h-4 text-sky-400 mx-auto mb-1" /><p className="text-[9px] text-[#AFC8E6]">Certificación</p><p className="text-sm font-bold text-[#EAF3FF]">{product.certification}</p></div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const SearchSuggestions = ({ searchTerm, products, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);
    useEffect(() => {
        if (searchTerm.length < 2) { setSuggestions([]); return; }
        const term = searchTerm.toLowerCase();
        const matches = products.filter(p => p.brand.toLowerCase().includes(term) || p.model.toLowerCase().includes(term) || p.size.includes(term)).slice(0, 6);
        setSuggestions(matches);
    }, [searchTerm, products]);
    if (suggestions.length === 0) return null;
    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#102A4C] rounded-xl border border-[#1E90FF]/30 shadow-2xl z-50 max-h-72 overflow-y-auto backdrop-blur-sm">
            {suggestions.map(s => (
                <button key={s.id} onClick={() => onSelect(`${s.brand} ${s.model} ${s.size}`)}
                    className="w-full text-left px-4 py-2 text-sm text-[#EAF3FF] hover:bg-[#1E4D7A] transition-colors flex items-center gap-3 border-b border-[#1E90FF]/10 last:border-0">
                    <img src={s.logoUrl} alt={s.brand} className="w-6 h-6 rounded-full object-contain" onError={(e) => e.target.src = PLACEHOLDER_SVG} />
                    <div><p className="font-medium">{s.brand} <span className="text-[#AFC8E6]">{s.model}</span></p><p className="text-[10px] text-[#AFC8E6]">{s.size} · {s.type}</p></div>
                    <div className="ml-auto text-right"><p className="text-xs font-bold text-[#1E90FF]">${s.ourPrice.toLocaleString()}</p><p className="text-[9px] text-emerald-400">-{s.savingsPercent}%</p></div>
                </button>
            ))}
        </div>
    );
};

const ProductCard = ({ product, onViewAnalysis }) => {
    const savingsBg = product.savingsPercent > 18 ? 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30' : product.savingsPercent > 10 ? 'from-amber-500/20 to-orange-500/20 border-amber-500/30' : 'from-red-500/20 to-rose-500/20 border-red-500/30';
    const savingsColor = product.savingsPercent > 18 ? 'text-emerald-400' : product.savingsPercent > 10 ? 'text-amber-400' : 'text-red-400';
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4, scale: 1.02 }}
            className="group bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all duration-300 border border-[#1E90FF]/20">
            <div className="relative">
                <div className="h-28 bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 flex items-center justify-center">
                    <img src={product.logoUrl} alt={product.brand} className="h-16 w-16 rounded-full bg-white p-2 object-contain shadow-md"
                        onError={(e) => e.target.src = PLACEHOLDER_SVG} />
                </div>
                {product.isBestSeller && <div className="absolute top-2 left-2"><span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center gap-1 shadow-md"><Flame className="w-3 h-3" /> Más Vendido</span></div>}
                {product.isLowStock && <div className="absolute top-2 right-2"><span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Stock Bajo</span></div>}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div><h3 className="font-bold text-[#EAF3FF] text-base">{product.brand}</h3><p className="text-[10px] text-[#AFC8E6]">{product.model}</p><p className="text-xs text-[#1E90FF] font-mono mt-1">{product.size}</p></div>
                    <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-xs text-[#EAF3FF]">{product.rating}</span></div>
                </div>
                <div className="flex items-baseline gap-2 mt-2"><span className="text-xs text-[#AFC8E6] line-through">${product.marketPrice.toLocaleString()}</span><span className="text-xl font-bold text-[#1E90FF]">${product.ourPrice.toLocaleString()}</span></div>
                <div className={`mt-2 p-2 rounded-lg bg-gradient-to-r ${savingsBg}`}><p className={`text-xs font-bold ${savingsColor} flex items-center justify-between`}><span>Ahorro</span><span>${product.savings.toLocaleString()} ({product.savingsPercent}%)</span></p></div>
                <div className="flex items-center justify-between mt-3 text-[10px] text-[#AFC8E6]">
                    <div className="flex items-center gap-1"><Package className="w-3 h-3" /><span className={product.isLowStock ? 'text-red-400' : ''}>{product.stock} uni</span></div>
                    <div className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400" /><span>{product.demand}% demanda</span></div>
                    <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-sky-400" /><span>{product.certification}</span></div>
                </div>
                <button onClick={() => onViewAnalysis(product)} className="w-full mt-3 py-2 bg-[#0B1E3A]/80 rounded-lg text-xs text-[#1E90FF] border border-[#1E90FF]/30 hover:bg-[#1E4D7A] transition-all flex items-center justify-center gap-2 group-hover:shadow-md"><Eye className="w-3 h-3" /> Ver Análisis Completo</button>
            </div>
        </motion.div>
    );
};

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
const Products = () => {
    const [productsData, setProductsData] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('savings');
    const [sortOrder, setSortOrder] = useState('desc');
    const [activeFilters, setActiveFilters] = useState({ bestSellers: false, highDiscount: false, lowStock: false });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedKPI, setSelectedKPI] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const itemsPerPage = 12;

    useEffect(() => {
        const data = generateProductsData();
        setProductsData(data);
        setFilteredProducts(data);
        const interval = setInterval(() => setLastUpdate(new Date()), 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let filtered = [...productsData];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => p.brand.toLowerCase().includes(term) || p.model.toLowerCase().includes(term) || p.size.toLowerCase().includes(term) || p.rim.includes(term));
        }
        if (activeFilters.bestSellers) filtered = filtered.filter(p => p.isBestSeller);
        if (activeFilters.highDiscount) filtered = filtered.filter(p => p.savingsPercent > 18);
        if (activeFilters.lowStock) filtered = filtered.filter(p => p.isLowStock);
        filtered.sort((a, b) => {
            let valA, valB;
            if (sortBy === 'price') { valA = a.ourPrice; valB = b.ourPrice; }
            else if (sortBy === 'savings') { valA = a.savingsPercent; valB = b.savingsPercent; }
            else if (sortBy === 'demand') { valA = a.demand; valB = b.demand; }
            else if (sortBy === 'rating') { valA = parseFloat(a.rating); valB = parseFloat(b.rating); }
            else if (sortBy === 'stock') { valA = a.stock; valB = b.stock; }
            else { valA = a.savingsPercent; valB = b.savingsPercent; }
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        });
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [productsData, searchTerm, activeFilters, sortBy, sortOrder]);

    const metrics = useMemo(() => {
        const totalProducts = filteredProducts.length;
        const totalSavings = filteredProducts.reduce((sum, p) => sum + p.savings, 0);
        const avgSavings = totalProducts > 0 ? totalSavings / totalProducts : 0;
        const avgBestPrice = filteredProducts.reduce((sum, p) => sum + p.ourPrice, 0) / (totalProducts || 1);
        return { totalProducts, totalSavings, avgSavings, avgBestPrice };
    }, [filteredProducts]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (field) => {
        if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        else { setSortBy(field); setSortOrder('desc'); }
    };
    const toggleFilter = (filter) => setActiveFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
    const handleSearchSelect = (value) => setSearchTerm(value);
    const kpiTrendData = { products: [42, 45, 48, 52, 55, 58, 62], savings: [12500, 13800, 14200, 15100, 15800, 16500, 17200], avgSavings: [210, 225, 230, 240, 245, 250, 258], avgPrice: [2850, 2820, 2780, 2750, 2720, 2680, 2650] };

    return (
        <div className="min-h-screen bg-[#0B1E3A]">
            <div className="max-w-7xl mx-auto space-y-6 p-6">
                {/* Header */}
                <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-gradient-to-r from-[#0B1E3A]/90 to-[#102A4C]/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg shadow-[#1E90FF]/10 border border-[#1E90FF]/30"
                    style={{ boxShadow: '0 0 20px rgba(30,144,255,0.2)' }}>
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 left-0 w-72 h-72 bg-[#1E90FF] rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3B82F6] rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
                    </div>
                    <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent tracking-tight">Catálogo de Productos</h1>
                            <p className="text-md text-[#AFC8E6] font-semibold mt-2 flex items-center gap-2 tracking-wide"><Zap className="w-4 h-4 text-[#1E90FF]" /> Inteligencia de precios en tiempo real</p>
                        </div>
                    </div>
                </motion.header>

                {/* KPIs */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { title: 'Productos Analizados', value: metrics.totalProducts, icon: Package, color: 'from-[#1E90FF] to-[#3B82F6]', kpiKey: 'products' },
                        { title: 'Ahorro Total', value: `$${metrics.totalSavings.toLocaleString()}`, icon: TrendingUp, color: 'from-emerald-500 to-teal-600', kpiKey: 'savings' },
                        { title: 'Ahorro Promedio', value: `$${Math.round(metrics.avgSavings).toLocaleString()}`, icon: Zap, color: 'from-amber-500 to-orange-600', kpiKey: 'avgSavings' },
                        { title: 'Mejor Precio Promedio', value: `$${Math.round(metrics.avgBestPrice).toLocaleString()}`, icon: DollarSign, color: 'from-purple-500 to-pink-600', kpiKey: 'avgPrice' },
                    ].map((metric, i) => (
                        <motion.div key={metric.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }} onClick={() => setSelectedKPI(metric.kpiKey)}
                            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20 cursor-pointer group">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-[#AFC8E6] uppercase tracking-wide">{metric.title}</p>
                                <div className={`p-2 bg-gradient-to-br ${metric.color} rounded-xl shadow-md text-white group-hover:shadow-lg transition-all`}>{React.createElement(metric.icon, { className: 'w-4 h-4' })}</div>
                            </div>
                            <p className="text-2xl font-bold text-[#EAF3FF]">{metric.value}</p>
                        </motion.div>
                    ))}
                </motion.section>

                {/* Buscador y filtros */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#163A6B]/80 to-[#102A4C]/80 backdrop-blur-md rounded-xl p-5 shadow-lg border border-[#1E90FF]/30">
                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E90FF]" />
                            <input type="text" placeholder="Buscar por marca, modelo, medida o rin..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0B1E3A]/60 border border-[#1E90FF]/40 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:ring-opacity-80 focus:border-transparent transition-all text-[#EAF3FF] placeholder-[#AFC8E6]/50 shadow-inner"
                                style={{ transition: 'all 0.2s ease', boxShadow: searchTerm ? '0 0 8px rgba(30,144,255,0.5)' : 'none' }} />
                            <SearchSuggestions searchTerm={searchTerm} products={productsData} onSelect={handleSearchSelect} />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => toggleFilter('bestSellers')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 backdrop-blur-sm ${activeFilters.bestSellers ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md border border-white/20' : 'bg-[#0B1E3A]/50 text-[#AFC8E6] border border-[#1E90FF]/40 hover:bg-[#1E4D7A]/70'}`}><Flame className="w-3 h-3" /> Más Vendidos {activeFilters.bestSellers && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}</button>
                            <button onClick={() => toggleFilter('highDiscount')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 backdrop-blur-sm ${activeFilters.highDiscount ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md border border-white/20' : 'bg-[#0B1E3A]/50 text-[#AFC8E6] border border-[#1E90FF]/40 hover:bg-[#1E4D7A]/70'}`}><Zap className="w-3 h-3" /> Mayor Descuento {activeFilters.highDiscount && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}</button>
                            <button onClick={() => toggleFilter('lowStock')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 backdrop-blur-sm ${activeFilters.lowStock ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md border border-white/20' : 'bg-[#0B1E3A]/50 text-[#AFC8E6] border border-[#1E90FF]/40 hover:bg-[#1E4D7A]/70'}`}><AlertCircle className="w-3 h-3" /> Stock Bajo {activeFilters.lowStock && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}</button>
                            {(activeFilters.bestSellers || activeFilters.highDiscount || activeFilters.lowStock || searchTerm) && <button onClick={() => { setSearchTerm(''); setActiveFilters({ bestSellers: false, highDiscount: false, lowStock: false }); }} className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#0B1E3A]/50 text-[#AFC8E6] border border-red-500/40 hover:bg-red-500/20 transition-all flex items-center gap-1 backdrop-blur-sm"><X className="w-3 h-3" /> Limpiar filtros</button>}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1E90FF]/20">
                            <div className="flex gap-1 bg-[#0B1E3A]/60 rounded-lg p-1 backdrop-blur-sm">
                                {[{ key: 'savings', label: 'Ahorro', icon: Zap }, { key: 'price', label: 'Precio', icon: DollarSign }, { key: 'demand', label: 'Demanda', icon: TrendingUp }, { key: 'rating', label: 'Rating', icon: Star }].map(sort => (
                                    <button key={sort.key} onClick={() => handleSort(sort.key)} className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${sortBy === sort.key ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md' : 'text-[#AFC8E6] hover:text-[#EAF3FF] hover:bg-[#1E4D7A]'}`}>
                                        {React.createElement(sort.icon, { className: 'w-3 h-3' })}{sort.label}{sortBy === sort.key && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-[#AFC8E6]">{filteredProducts.length} productos encontrados</p>
                        </div>
                    </div>
                </motion.section>

                {/* Grid de productos */}
                <motion.section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <AnimatePresence mode="wait">
                        {paginatedProducts.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-full text-center py-12 bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl border border-[#1E90FF]/20">
                                <Package className="w-16 h-16 text-[#1E90FF]/30 mx-auto mb-4" /><p className="text-[#AFC8E6] text-lg">No se encontraron productos</p>
                            </motion.div>
                        ) : (
                            paginatedProducts.map(product => <ProductCard key={product.id} product={product} onViewAnalysis={setSelectedProduct} />)
                        )}
                    </AnimatePresence>
                </motion.section>

                {/* Paginación */}
                {totalPages > 1 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 pt-4 flex-wrap">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
                            className={`w-9 h-9 rounded-full text-sm font-medium transition-all flex items-center justify-center ${currentPage === 1 ? 'bg-[#0B1E3A]/50 text-[#AFC8E6]/50 cursor-not-allowed' : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:text-[#EAF3FF] border border-[#1E90FF]/40 hover:border-[#1E90FF] hover:shadow-md'}`}>«</motion.button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum = totalPages <= 5 ? i + 1 : (currentPage <= 3 ? i + 1 : (currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i));
                            return <motion.button key={pageNum} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage(pageNum)}
                                className={`w-9 h-9 rounded-full font-semibold transition-all text-sm flex items-center justify-center ${currentPage === pageNum ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md shadow-[#1E90FF]/30 scale-110' : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:bg-[#1E4D7A] border border-[#1E90FF]/30'}`}>{pageNum}</motion.button>;
                        })}
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
                            className={`w-9 h-9 rounded-full text-sm font-medium transition-all flex items-center justify-center ${currentPage === totalPages ? 'bg-[#0B1E3A]/50 text-[#AFC8E6]/50 cursor-not-allowed' : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:text-[#EAF3FF] border border-[#1E90FF]/40 hover:border-[#1E90FF] hover:shadow-md'}`}>»</motion.button>
                    </motion.div>
                )}

                {/* Footer */}
                <motion.footer className="text-center py-6 border-t border-[#1E90FF]/20">
                    <div className="flex items-center justify-center gap-4 text-sm text-[#AFC8E6]">
                        <div className="flex items-center gap-2"><Server className="w-3 h-3" /><span>Estado del servidor:</span><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span><span className="text-emerald-400 text-xs">Online</span></div>
                        <div className="flex items-center gap-2"><Clock className="w-3 h-3" /><span>Última actualización:</span><span className="font-mono text-xs text-[#1E90FF]">{lastUpdate.toLocaleTimeString()}</span></div>
                    </div>
                    <p className="text-xs text-[#AFC8E6] mt-3">NeumatiQ Products Intelligence · Datos actualizados en tiempo real · © 2026</p>
                </motion.footer>
            </div>

            <AnimatePresence>{selectedKPI && <KPIModal isOpen={!!selectedKPI} onClose={() => setSelectedKPI(null)} title={{ products: 'Productos Analizados', savings: 'Ahorro Total', avgSavings: 'Ahorro Promedio', avgPrice: 'Mejor Precio Promedio' }[selectedKPI]} data={kpiTrendData[selectedKPI]} />}</AnimatePresence>
            <AnimatePresence>{selectedProduct && <ProductAnalysisModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}</AnimatePresence>
        </div>
    );
};

export default Products;