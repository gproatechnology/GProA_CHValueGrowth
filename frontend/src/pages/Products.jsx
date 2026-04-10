import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, DollarSign, Package, Filter, Search, Eye, Download, 
    ChevronUp, ChevronDown, Zap, Shield, Star, Truck, AlertCircle,
    X, BarChart3, LineChart as LineChartIcon, Info, ShoppingCart,
    Award, Flame, Battery, Gauge, CircleDollarSign
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
import { Bar, Line, Doughnut } from 'react-chartjs-2';

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
    ArcElement
);

// =============================================
// DATASET DE PRUEBA - 24 PRODUCTOS REALISTAS
// =============================================
const generateProductsData = () => {
    const brands = [
        { name: 'Michelin', domain: 'michelin.com', logoUrl: 'https://logo.clearbit.com/michelin.com' },
        { name: 'Pirelli', domain: 'pirelli.com', logoUrl: 'https://logo.clearbit.com/pirelli.com' },
        { name: 'Bridgestone', domain: 'bridgestone.com', logoUrl: 'https://logo.clearbit.com/bridgestone.com' },
        { name: 'Continental', domain: 'continental.com', logoUrl: 'https://logo.clearbit.com/continental.com' },
        { name: 'Goodyear', domain: 'goodyear.com', logoUrl: 'https://logo.clearbit.com/goodyear.com' },
        { name: 'Hankook', domain: 'hankooktire.com', logoUrl: 'https://logo.clearbit.com/hankooktire.com' },
        { name: 'Yokohama', domain: 'yokohama.com', logoUrl: 'https://logo.clearbit.com/yokohama.com' },
        { name: 'Dunlop', domain: 'dunlop.eu', logoUrl: 'https://logo.clearbit.com/dunlop.eu' },
        { name: 'Firestone', domain: 'firestone.com', logoUrl: 'https://logo.clearbit.com/firestone.com' },
        { name: 'Kumho', domain: 'kumhotire.com', logoUrl: 'https://logo.clearbit.com/kumhotire.com' },
    ];

    const sizes = ['205/55 R16', '195/65 R15', '225/45 R17', '215/60 R16', '235/55 R17', '245/40 R18', '255/35 R19', '225/55 R18'];
    const types = ['Verano', 'Invierno', 'Todo tiempo', 'Racing'];
    
    const products = [];
    let id = 1;
    
    for (const brand of brands) {
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            const marketPrice = Math.floor(Math.random() * 2000) + 2000;
            const ourPrice = Math.floor(marketPrice * (0.7 + Math.random() * 0.2));
            const savings = marketPrice - ourPrice;
            const savingsPercent = ((savings / marketPrice) * 100).toFixed(0);
            
            products.push({
                id: id++,
                brand: brand.name,
                brandDomain: brand.domain,
                logoUrl: brand.logoUrl,
                model: `${brand.name} ${['Sport', 'Premium', 'Eco', 'Performance', 'All-Season'][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 100) + 1}`,
                size: size,
                rim: size.split(' ')[1],
                marketPrice: marketPrice,
                ourPrice: ourPrice,
                savings: savings,
                savingsPercent: parseInt(savingsPercent),
                stock: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 200) + 50,
                isLowStock: Math.random() < 0.2,
                rating: (3.5 + Math.random() * 1.5).toFixed(1),
                reviews: Math.floor(Math.random() * 500) + 20,
                demand: Math.floor(Math.random() * 100) + 20,
                isBestSeller: Math.random() > 0.8,
                isHighDiscount: savingsPercent > 15,
                competitors: [
                    { name: 'MercadoLibre', price: Math.floor(marketPrice * (0.9 + Math.random() * 0.2)) },
                    { name: 'Radial Llantas', price: Math.floor(ourPrice * (0.95 + Math.random() * 0.1)) },
                    { name: 'Serna', price: Math.floor(ourPrice * (0.98 + Math.random() * 0.05)) },
                    { name: 'ContiShop', price: Math.floor(ourPrice * (0.97 + Math.random() * 0.08)) },
                ]
            });
        }
    }
    return products;
};

// =============================================
// COMPONENTE DE MODAL PARA KPIs
// =============================================
const KPIModal = ({ isOpen, onClose, title, data, type }) => {
    if (!isOpen) return null;
    
    const chartData = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
            label: title,
            data: data || [65, 72, 68, 80, 75, 85, 82],
            borderColor: '#1E90FF',
            backgroundColor: 'rgba(30, 144, 255, 0.1)',
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
            y: { grid: { color: 'rgba(30, 144, 255, 0.1)' }, ticks: { color: '#AFC8E6' } },
            x: { ticks: { color: '#AFC8E6' } }
        }
    };
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-2xl w-full p-6 border border-[#1E90FF]/30 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#EAF3FF] flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#1E90FF]" />
                        {title} - Tendencia Semanal
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors">
                        <X className="w-5 h-5 text-[#AFC8E6]" />
                    </button>
                </div>
                <div className="h-80">
                    <Line data={chartData} options={options} />
                </div>
                <div className="mt-4 p-3 bg-[#0B1E3A]/60 rounded-lg">
                    <p className="text-xs text-[#AFC8E6] text-center">
                        📊 {title === 'Productos Analizados' ? 'Total de productos monitoreados en el mercado' :
                           title === 'Ahorro Total' ? 'Suma de todos los ahorros acumulados' :
                           title === 'Ahorro Promedio' ? 'Ahorro promedio por producto' :
                           'Mejor precio promedio entre proveedores oficiales'} - Datos actualizados diariamente
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// =============================================
// COMPONENTE DE MODAL PARA ANÁLISIS COMPLETO
// =============================================
const ProductAnalysisModal = ({ product, onClose }) => {
    if (!product) return null;
    
    const competitorData = {
        labels: product.competitors.map(c => c.name),
        datasets: [{
            label: 'Precio (MXN)',
            data: product.competitors.map(c => c.price),
            backgroundColor: 'rgba(30, 144, 255, 0.6)',
            borderColor: '#1E90FF',
            borderWidth: 2,
        }]
    };
    
    const savingsColor = product.savingsPercent > 15 ? 'text-emerald-400' : product.savingsPercent > 5 ? 'text-amber-400' : 'text-red-400';
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-3xl w-full p-6 border border-[#1E90FF]/30 shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <img 
                            src={product.logoUrl} 
                            alt={product.brand} 
                            className="w-12 h-12 rounded-full bg-white p-1 object-contain"
                            onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/888/888848.png'}
                        />
                        <div>
                            <h3 className="text-xl font-bold text-[#EAF3FF]">{product.brand}</h3>
                            <p className="text-sm text-[#1E90FF]">{product.model}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors">
                        <X className="w-5 h-5 text-[#AFC8E6]" />
                    </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
                        <p className="text-xs text-[#AFC8E6]">Medida</p>
                        <p className="text-lg font-bold text-[#EAF3FF]">{product.size}</p>
                    </div>
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
                        <p className="text-xs text-[#AFC8E6]">Rin</p>
                        <p className="text-lg font-bold text-[#EAF3FF]">{product.rim}</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg">
                        <p className="text-xs text-[#AFC8E6]">Precio Mercado</p>
                        <p className="text-xl font-bold text-[#AFC8E6] line-through">${product.marketPrice.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg">
                        <p className="text-xs text-[#AFC8E6]">Nuestro Precio</p>
                        <p className="text-2xl font-bold text-[#1E90FF]">${product.ourPrice.toLocaleString()}</p>
                    </div>
                </div>
                
                <div className={`p-3 rounded-lg mb-4 text-center ${product.savingsPercent > 15 ? 'bg-emerald-500/20 border border-emerald-500/30' : product.savingsPercent > 5 ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                    <p className="text-xs text-[#AFC8E6]">Ahorro Total</p>
                    <p className={`text-2xl font-bold ${savingsColor}`}>${product.savings.toLocaleString()} ({product.savingsPercent}%)</p>
                </div>
                
                <h4 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#1E90FF]" />
                    Comparativa de Precios - Competencia
                </h4>
                <div className="h-64 mb-4">
                    <Bar data={competitorData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#AFC8E6' } } } }} />
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center p-2 bg-[#0B1E3A]/60 rounded-lg">
                        <Star className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                        <p className="text-xs text-[#AFC8E6]">Rating</p>
                        <p className="text-sm font-bold text-[#EAF3FF]">{product.rating} ★</p>
                    </div>
                    <div className="text-center p-2 bg-[#0B1E3A]/60 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                        <p className="text-xs text-[#AFC8E6]">Demanda</p>
                        <p className="text-sm font-bold text-[#EAF3FF]">{product.demand}%</p>
                    </div>
                    <div className="text-center p-2 bg-[#0B1E3A]/60 rounded-lg">
                        <Package className="w-4 h-4 text-[#1E90FF] mx-auto mb-1" />
                        <p className="text-xs text-[#AFC8E6]">Stock</p>
                        <p className={`text-sm font-bold ${product.isLowStock ? 'text-red-400' : 'text-emerald-400'}`}>
                            {product.stock} uni
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// =============================================
// COMPONENTE DE TARJETA DE PRODUCTO
// =============================================
const ProductCard = ({ product, onViewAnalysis }) => {
    const savingsColor = product.savingsPercent > 15 ? 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30' : 
                        product.savingsPercent > 5 ? 'from-amber-500/20 to-orange-500/20 border-amber-500/30' : 
                        'from-red-500/20 to-rose-500/20 border-red-500/30';
    
    const savingsTextColor = product.savingsPercent > 15 ? 'text-emerald-400' : 
                             product.savingsPercent > 5 ? 'text-amber-400' : 'text-red-400';
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all duration-300 border border-[#1E90FF]/20"
        >
            <div className="relative">
                <div className="h-28 bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 flex items-center justify-center">
                    <img 
                        src={product.logoUrl} 
                        alt={product.brand} 
                        className="h-16 w-16 rounded-full bg-white p-2 object-contain shadow-md"
                        onError={(e) => e.target.src = 'https://cdn-icons-png.flaticon.com/512/888/888848.png'}
                    />
                </div>
                {product.isBestSeller && (
                    <div className="absolute top-2 left-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Más Vendido
                        </span>
                    </div>
                )}
                {product.isLowStock && (
                    <div className="absolute top-2 right-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Stock Bajo
                        </span>
                    </div>
                )}
            </div>
            
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-[#EAF3FF] text-base">{product.brand}</h3>
                        <p className="text-[10px] text-[#AFC8E6]">{product.model}</p>
                        <p className="text-xs text-[#1E90FF] font-mono mt-1">{product.size}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-[#EAF3FF]">{product.rating}</span>
                    </div>
                </div>
                
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xs text-[#AFC8E6] line-through">${product.marketPrice.toLocaleString()}</span>
                    <span className="text-xl font-bold text-[#1E90FF]">${product.ourPrice.toLocaleString()}</span>
                </div>
                
                <div className={`mt-2 p-2 rounded-lg bg-gradient-to-r ${savingsColor}`}>
                    <p className={`text-xs font-bold ${savingsTextColor} flex items-center justify-between`}>
                        <span>Ahorro</span>
                        <span>${product.savings.toLocaleString()} ({product.savingsPercent}%)</span>
                    </p>
                </div>
                
                <div className="flex items-center justify-between mt-3 text-[10px] text-[#AFC8E6]">
                    <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span className={product.isLowStock ? 'text-red-400' : ''}>{product.stock} uni</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span>{product.demand}% demanda</span>
                    </div>
                </div>
                
                <button
                    onClick={() => onViewAnalysis(product)}
                    className="w-full mt-3 py-2 bg-[#0B1E3A]/80 rounded-lg text-xs text-[#1E90FF] border border-[#1E90FF]/30 hover:bg-[#1E4D7A] transition-all flex items-center justify-center gap-2"
                >
                    <Eye className="w-3 h-3" />
                    Ver Análisis Completo
                </button>
            </div>
        </motion.div>
    );
};

// =============================================
// COMPONENTE PRINCIPAL PRODUCTS
// =============================================
const Products = () => {
    const [productsData, setProductsData] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('savings');
    const [sortOrder, setSortOrder] = useState('desc');
    const [activeFilters, setActiveFilters] = useState({
        bestSellers: false,
        highDiscount: false,
        lowStock: false
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedKPI, setSelectedKPI] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const itemsPerPage = 8;
    
    // Generar datos al montar
    useEffect(() => {
        const data = generateProductsData();
        setProductsData(data);
        setFilteredProducts(data);
    }, []);
    
    // Filtrar y ordenar productos
    useEffect(() => {
        let filtered = [...productsData];
        
        // Búsqueda multivariable
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                p.brand.toLowerCase().includes(term) ||
                p.model.toLowerCase().includes(term) ||
                p.size.toLowerCase().includes(term) ||
                p.rim.includes(term)
            );
        }
        
        // Filtros rápidos
        if (activeFilters.bestSellers) {
            filtered = filtered.filter(p => p.isBestSeller);
        }
        if (activeFilters.highDiscount) {
            filtered = filtered.filter(p => p.savingsPercent > 15);
        }
        if (activeFilters.lowStock) {
            filtered = filtered.filter(p => p.isLowStock);
        }
        
        // Ordenamiento
        filtered.sort((a, b) => {
            let valA, valB;
            switch(sortBy) {
                case 'price': valA = a.ourPrice; valB = b.ourPrice; break;
                case 'savings': valA = a.savingsPercent; valB = b.savingsPercent; break;
                case 'demand': valA = a.demand; valB = b.demand; break;
                case 'rating': valA = parseFloat(a.rating); valB = parseFloat(b.rating); break;
                case 'stock': valA = a.stock; valB = b.stock; break;
                default: valA = a.savingsPercent; valB = b.savingsPercent;
            }
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        });
        
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [productsData, searchTerm, activeFilters, sortBy, sortOrder]);
    
    // Métricas
    const metrics = useMemo(() => {
        const totalProducts = filteredProducts.length;
        const totalSavings = filteredProducts.reduce((sum, p) => sum + p.savings, 0);
        const avgSavings = totalProducts > 0 ? totalSavings / totalProducts : 0;
        const avgBestPrice = filteredProducts.reduce((sum, p) => sum + p.ourPrice, 0) / (totalProducts || 1);
        return { totalProducts, totalSavings, avgSavings, avgBestPrice };
    }, [filteredProducts]);
    
    // Paginación
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };
    
    const toggleFilter = (filter) => {
        setActiveFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
    };
    
    const kpiTrendData = {
        products: [42, 45, 48, 52, 55, 58, 62],
        savings: [12500, 13800, 14200, 15100, 15800, 16500, 17200],
        avgSavings: [210, 225, 230, 240, 245, 250, 258],
        avgPrice: [2850, 2820, 2780, 2750, 2720, 2680, 2650]
    };
    
    return (
        <div className="min-h-screen bg-[#0B1E3A]">
            <div className="max-w-7xl mx-auto space-y-6 p-6">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-gradient-to-r from-[#0B1E3A]/90 to-[#102A4C]/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-[#1E90FF]/20"
                >
                    <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">
                                Catálogo de Productos
                            </h1>
                            <p className="text-md text-[#AFC8E6] font-medium mt-2 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-[#1E90FF]" />
                                Inteligencia de precios en tiempo real
                            </p>
                        </div>
                    </div>
                </motion.header>
                
                {/* KPIs Interactivos */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                    {[
                        { title: 'Productos Analizados', value: metrics.totalProducts, icon: Package, color: 'from-[#1E90FF] to-[#3B82F6]', suffix: '', kpiKey: 'products' },
                        { title: 'Ahorro Total', value: `$${metrics.totalSavings.toLocaleString()}`, icon: TrendingUp, color: 'from-emerald-500 to-teal-600', suffix: '', kpiKey: 'savings' },
                        { title: 'Ahorro Promedio', value: `$${Math.round(metrics.avgSavings).toLocaleString()}`, icon: Zap, color: 'from-amber-500 to-orange-600', suffix: '', kpiKey: 'avgSavings' },
                        { title: 'Mejor Precio Promedio', value: `$${Math.round(metrics.avgBestPrice).toLocaleString()}`, icon: DollarSign, color: 'from-purple-500 to-pink-600', suffix: '', kpiKey: 'avgPrice' },
                    ].map((metric, i) => (
                        <motion.div
                            key={metric.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            onClick={() => setSelectedKPI(metric.kpiKey)}
                            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20 cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-[#AFC8E6] uppercase tracking-wide">{metric.title}</p>
                                <div className={`p-2 bg-gradient-to-br ${metric.color} rounded-xl shadow-md text-white group-hover:shadow-lg transition-all`}>
                                    {React.createElement(metric.icon, { className: 'w-4 h-4' })}
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#EAF3FF]">
                                {metric.value}{metric.suffix}
                            </p>
                        </motion.div>
                    ))}
                </motion.section>
                
                {/* Buscador Avanzado y Filtros */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg border border-[#1E90FF]/20"
                >
                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E90FF]" />
                            <input
                                type="text"
                                placeholder="Buscar por marca, modelo, medida o rin (ej: 17, 205/55 R16)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#0B1E3A]/80 border border-[#1E90FF]/30 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent text-[#EAF3FF] placeholder-[#AFC8E6]/50 transition-all"
                            />
                        </div>
                        
                        {/* Badges de filtros rápidos */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => toggleFilter('bestSellers')}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                                    activeFilters.bestSellers
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                                        : 'bg-[#0B1E3A]/80 text-[#AFC8E6] border border-[#1E90FF]/30 hover:bg-[#1E4D7A]'
                                }`}
                            >
                                <Flame className="w-3 h-3" /> Más Vendidos
                            </button>
                            <button
                                onClick={() => toggleFilter('highDiscount')}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                                    activeFilters.highDiscount
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                        : 'bg-[#0B1E3A]/80 text-[#AFC8E6] border border-[#1E90FF]/30 hover:bg-[#1E4D7A]'
                                }`}
                            >
                                <Zap className="w-3 h-3" /> Mayor Descuento
                            </button>
                            <button
                                onClick={() => toggleFilter('lowStock')}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                                    activeFilters.lowStock
                                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                                        : 'bg-[#0B1E3A]/80 text-[#AFC8E6] border border-[#1E90FF]/30 hover:bg-[#1E4D7A]'
                                }`}
                            >
                                <AlertCircle className="w-3 h-3" /> Stock Bajo
                            </button>
                            {(activeFilters.bestSellers || activeFilters.highDiscount || activeFilters.lowStock || searchTerm) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setActiveFilters({ bestSellers: false, highDiscount: false, lowStock: false });
                                    }}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#0B1E3A]/80 text-[#AFC8E6] border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" /> Limpiar filtros
                                </button>
                            )}
                        </div>
                        
                        {/* Ordenamiento */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1E90FF]/20">
                            <div className="flex gap-1 bg-[#0B1E3A]/80 rounded-lg p-1">
                                {[
                                    { key: 'savings', label: 'Ahorro', icon: Zap },
                                    { key: 'price', label: 'Precio', icon: DollarSign },
                                    { key: 'demand', label: 'Demanda', icon: TrendingUp },
                                    { key: 'rating', label: 'Rating', icon: Star },
                                ].map(sort => (
                                    <button
                                        key={sort.key}
                                        onClick={() => handleSort(sort.key)}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                            sortBy === sort.key 
                                                ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md' 
                                                : 'text-[#AFC8E6] hover:text-[#EAF3FF] hover:bg-[#1E4D7A]'
                                        }`}
                                    >
                                        {React.createElement(sort.icon, { className: 'w-3 h-3' })}
                                        {sort.label}
                                        {sortBy === sort.key && (
                                            sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-[#AFC8E6]">{filteredProducts.length} productos encontrados</p>
                        </div>
                    </div>
                </motion.section>
                
                {/* Grid de Productos */}
                <motion.section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <AnimatePresence mode="wait">
                        {paginatedProducts.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="col-span-full text-center py-12 bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl border border-[#1E90FF]/20"
                            >
                                <Package className="w-16 h-16 text-[#1E90FF]/30 mx-auto mb-4" />
                                <p className="text-[#AFC8E6] text-lg">No se encontraron productos</p>
                            </motion.div>
                        ) : (
                            paginatedProducts.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onViewAnalysis={setSelectedProduct}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </motion.section>
                
                {/* Paginación Real */}
                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 pt-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                currentPage === 1
                                    ? 'bg-[#0B1E3A]/50 text-[#AFC8E6]/50 cursor-not-allowed'
                                    : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:text-[#EAF3FF] border border-[#1E90FF]/30 hover:shadow-lg'
                            }`}
                        >
                            Anterior
                        </motion.button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;
                            
                            return (
                                <motion.button
                                    key={pageNum}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                                        currentPage === pageNum
                                            ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md shadow-[#1E90FF]/25'
                                            : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:bg-[#1E4D7A] border border-[#1E90FF]/30'
                                    }`}
                                >
                                    {pageNum}
                                </motion.button>
                            );
                        })}
                        
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                currentPage === totalPages
                                    ? 'bg-[#0B1E3A]/50 text-[#AFC8E6]/50 cursor-not-allowed'
                                    : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:text-[#EAF3FF] border border-[#1E90FF]/30 hover:shadow-lg'
                            }`}
                        >
                            Siguiente
                        </motion.button>
                    </motion.div>
                )}
                
                {/* Footer */}
                <motion.footer className="text-center py-6 border-t border-[#1E90FF]/20">
                    <p className="text-sm text-[#AFC8E6]">
                        NeumatiQ Products Intelligence · Datos actualizados en tiempo real · © 2026
                    </p>
                </motion.footer>
            </div>
            
            {/* Modales */}
            <AnimatePresence>
                {selectedKPI && (
                    <KPIModal
                        isOpen={!!selectedKPI}
                        onClose={() => setSelectedKPI(null)}
                        title={{
                            products: 'Productos Analizados',
                            savings: 'Ahorro Total',
                            avgSavings: 'Ahorro Promedio',
                            avgPrice: 'Mejor Precio Promedio'
                        }[selectedKPI]}
                        data={kpiTrendData[selectedKPI]}
                    />
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {selectedProduct && (
                    <ProductAnalysisModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Products;