import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import {
    TrendingUp, DollarSign, Package, Zap, Filter, Search,
    Eye, Download, ChevronUp, ChevronDown, X
} from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

// --------------------------------------------------------------
// 1. Datos estáticos (simulan respuesta de API)
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
    ml: { name: 'Mercado Libre', isOfficialOnly: false },
    radial: { name: 'Radial Llantas', isOfficialOnly: true },
    serna: { name: 'Serna', isOfficialOnly: true },
    contishop: { name: 'ContiShop', isOfficialOnly: true }
};

const generatePrice = (brand, size, sourceKey) => {
    const basePrice = {
        Michelin: 2800, Bridgestone: 2600, Goodyear: 2400, Continental: 2700, Pirelli: 2650,
        Hankook: 2100, Yokohama: 2250, Dunlop: 2050, Cooper: 1950, BFGoodrich: 2300
    }[brand] || 2200;

    const sizeMultiplier = {
        '205/55 R16': 1.0, '195/65 R15': 0.9, '225/45 R17': 1.1, '215/60 R16': 1.05,
        '235/55 R17': 1.15, '205/50 R17': 1.02, '245/40 R18': 1.25, '255/35 R19': 1.35,
        '225/55 R18': 1.2, '265/70 R16': 1.3
    }[size] || 1.0;

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

// Datos de tendencia (últimos 7 días)
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
const Products = () => {
    // Estados
    const [tireData, setTireData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterOfficial, setFilterOfficial] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [onlyInStock, setOnlyInStock] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('bestPrice');
    const [sortOrder, setSortOrder] = useState('asc');
    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Cargar datos
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 800));
                setTireData(buildMockData());
                setError(null);
            } catch (err) {
                setError('Error al cargar los datos. Intente nuevamente.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Agregación por producto
    const aggregatedProducts = useMemo(() => {
        const map = new Map();
        tireData.forEach(item => {
            const key = `${item.brand}|${item.size}`;
            if (!map.has(key)) {
                map.set(key, {
                    id: key,
                    brand: item.brand,
                    size: item.size,
                    model: item.model,
                    prices: {},
                    stock: item.stock,
                    isOfficial: item.isOfficial
                });
            }
            const product = map.get(key);
            product.prices[item.source] = item.price;
            if (item.stock === 'High') product.stock = 'High';
        });
        return Array.from(map.values()).map(product => {
            const mlPrice = product.prices.ml || Infinity;
            const radialPrice = product.prices.radial || Infinity;
            const sernaPrice = product.prices.serna || Infinity;
            const contishopPrice = product.prices.contishop || Infinity;
            const directPrices = [radialPrice, sernaPrice, contishopPrice].filter(p => p !== Infinity);
            const bestDirectPrice = directPrices.length ? Math.min(...directPrices) : Infinity;
            const bestSource = bestDirectPrice === radialPrice ? 'Radial Llantas' :
                bestDirectPrice === sernaPrice ? 'Serna' : 'ContiShop';
            const savings = (mlPrice !== Infinity && bestDirectPrice !== Infinity) ? mlPrice - bestDirectPrice : 0;
            return {
                ...product,
                mlPrice: mlPrice !== Infinity ? mlPrice : null,
                bestDirectPrice: bestDirectPrice !== Infinity ? bestDirectPrice : null,
                bestSource,
                savings,
                hasStock: product.stock === 'High'
            };
        }).filter(p => p.mlPrice && p.bestDirectPrice);
    }, [tireData]);

    // Filtrado y ordenamiento
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...aggregatedProducts];
        if (filterOfficial) filtered = filtered.filter(p => p.isOfficial);
        if (selectedBrand) filtered = filtered.filter(p => p.brand === selectedBrand);
        if (selectedSize) filtered = filtered.filter(p => p.size === selectedSize);
        if (onlyInStock) filtered = filtered.filter(p => p.hasStock);
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => p.brand.toLowerCase().includes(term) || p.size.toLowerCase().includes(term) || p.model.toLowerCase().includes(term));
        }
        const compare = (a, b) => {
            let valA, valB;
            switch (sortBy) {
                case 'mlPrice': valA = a.mlPrice; valB = b.mlPrice; break;
                case 'bestPrice': valA = a.bestDirectPrice; valB = b.bestDirectPrice; break;
                case 'savings': valA = a.savings; valB = b.savings; break;
                case 'brand': valA = a.brand; valB = b.brand; break;
                case 'size': valA = a.size; valB = b.size; break;
                default: valA = a.savings; valB = b.savings;
            }
            if (typeof valA === 'string') return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        };
        filtered.sort(compare);
        return filtered;
    }, [aggregatedProducts, filterOfficial, selectedBrand, selectedSize, onlyInStock, searchTerm, sortBy, sortOrder]);

    // Métricas
    const metrics = useMemo(() => {
        if (!filteredAndSortedProducts.length) return null;
        const avgMl = filteredAndSortedProducts.reduce((sum, p) => sum + p.mlPrice, 0) / filteredAndSortedProducts.length;
        const avgBest = filteredAndSortedProducts.reduce((sum, p) => sum + p.bestDirectPrice, 0) / filteredAndSortedProducts.length;
        const totalSavings = filteredAndSortedProducts.reduce((sum, p) => sum + p.savings, 0);
        return { avgMl, avgBest, totalSavings };
    }, [filteredAndSortedProducts]);

    // Exportar CSV
    const exportToCSV = useCallback(() => {
        const headers = ['Marca', 'Medida', 'Precio ML (MXN)', 'Mejor Precio Directo (MXN)', 'Fuente Mejor Precio', 'Ahorro vs ML (MXN)', 'Stock'];
        const rows = filteredAndSortedProducts.map(p => [p.brand, p.size, p.mlPrice, p.bestDirectPrice, p.bestSource, p.savings, p.hasStock ? 'Alto' : 'Bajo']);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `precios_llantas_${new Date().toISOString().slice(0, 19)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [filteredAndSortedProducts]);

    const handleSort = (newSortBy) => {
        if (sortBy === newSortBy) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        else { setSortBy(newSortBy); setSortOrder('asc'); }
    };

    // Animaciones
    const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
    const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] via-[#15171c] to-[#0d0e11] text-gray-300 relative overflow-x-hidden">
            <AnimatedBackground />

            <div className="relative z-10 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                        🛞 Inteligencia de Precios · Llantas
                    </motion.h1>
                    <div className="neumorph-inset p-1.5 rounded-xl flex">
                        {[1, 2, 4].map(q => (
                            <button key={q} onClick={() => setQuantity(q)} className={`px-4 py-2 mx-0.5 rounded-lg text-xs font-medium transition-all ${quantity === q ? 'bg-blue-600 text-white shadow-neumorph-inset' : 'text-gray-400 hover:text-white'}`}>
                                {q === 1 ? '1 Llanta' : q === 2 ? 'Par (2)' : 'Juego (4)'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPIs */}
                {metrics && (
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -5 }} className="rounded-2xl p-4 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
                            <div className="flex items-center justify-between"><p className="text-xs text-gray-400 uppercase">Precio Promedio ML</p><DollarSign size={18} className="text-blue-400" /></div>
                            <p className="text-2xl font-bold text-white mt-2">${Math.round(metrics.avgMl).toLocaleString()}</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -5 }} className="rounded-2xl p-4 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
                            <div className="flex items-center justify-between"><p className="text-xs text-gray-400 uppercase">Mejor Precio Directo</p><TrendingUp size={18} className="text-green-400" /></div>
                            <p className="text-2xl font-bold text-green-400 mt-2">${Math.round(metrics.avgBest).toLocaleString()}</p>
                        </motion.div>
                        <motion.div variants={fadeInUp} whileHover={{ scale: 1.02, y: -5 }} className="rounded-2xl p-4 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
                            <div className="flex items-center justify-between"><p className="text-xs text-gray-400 uppercase">Ahorro Total vs ML</p><Zap size={18} className="text-purple-400" /></div>
                            <p className="text-2xl font-bold text-purple-400 mt-2">${metrics.totalSavings.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-500">en productos mostrados</p>
                        </motion.div>
                    </motion.div>
                )}

                {/* Gráfica de tendencia */}
                <div className="rounded-2xl p-4 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp size={18} /> Tendencia de precios (últimos 7 días)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={trendData}>
                            <defs><linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2d2f36" />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" tickFormatter={(v) => `$${v}`} />
                            <Tooltip contentStyle={{ backgroundColor: '#1a1b1e', border: 'none', borderRadius: '0.5rem' }} formatter={(v) => `$${v}`} />
                            <Legend />
                            <Area type="monotone" dataKey="avgPrice" stroke="#3b82f6" fill="url(#priceGradient)" name="Precio promedio (MXN)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Filtros */}
                    <aside className="lg:col-span-3 space-y-6">
                        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
                            <h3 className="text-sm font-semibold mb-4 text-blue-400 flex items-center gap-2"><Filter size={16} /> Filtros Avanzados</h3>
                            <div className="mb-5"><label className="block text-xs text-gray-400 mb-2">Buscar</label><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Marca o medida..." className="neumorph-input w-full pl-9 text-sm" /></div></div>
                            <div className="flex items-center justify-between mb-5"><span className="text-sm">Solo Tiendas Oficiales</span><button onClick={() => setFilterOfficial(!filterOfficial)} className={`w-11 h-6 rounded-full transition-all ${filterOfficial ? 'bg-blue-600' : 'bg-gray-700'} shadow-neumorph-inset`}><div className={`w-5 h-5 bg-white rounded-full transition-transform ${filterOfficial ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
                            <div className="mb-5"><label className="block text-xs text-gray-400 mb-2">Marca</label><select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="neumorph-input w-full text-sm"><option value="">Todas</option>{BRANDS.map(b => <option key={b}>{b}</option>)}</select></div>
                            <div className="mb-5"><label className="block text-xs text-gray-400 mb-2">Medida</label><select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="neumorph-input w-full text-sm"><option value="">Todas</option>{SIZES.map(s => <option key={s}>{s}</option>)}</select></div>
                            <div className="flex items-center justify-between"><span className="text-sm">Solo con stock</span><button onClick={() => setOnlyInStock(!onlyInStock)} className={`w-11 h-6 rounded-full transition-all ${onlyInStock ? 'bg-blue-600' : 'bg-gray-700'} shadow-neumorph-inset`}><div className={`w-5 h-5 bg-white rounded-full transition-transform ${onlyInStock ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
                        </div>
                        <button onClick={() => { setFilterOfficial(false); setSelectedBrand(''); setSelectedSize(''); setOnlyInStock(false); setSearchTerm(''); setSortBy('bestPrice'); setSortOrder('asc'); }} className="neumorph-btn w-full py-2 text-sm">Limpiar filtros</button>
                    </aside>

                    {/* Tabla */}
                    <main className="lg:col-span-9">
                        <div className="rounded-2xl bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[800px]">
                                    <thead className="bg-[#1f2125] border-b border-gray-800">
                                        <tr>
                                            <th className="p-4 text-xs font-bold uppercase cursor-pointer hover:text-blue-400 transition" onClick={() => handleSort('brand')}>Producto {sortBy === 'brand' && (sortOrder === 'asc' ? <ChevronUp size={12} className="inline" /> : <ChevronDown size={12} className="inline" />)}</th>
                                            <th className="p-4 text-xs font-bold uppercase cursor-pointer hover:text-yellow-400 transition" onClick={() => handleSort('mlPrice')}>Mercado Libre {sortBy === 'mlPrice' && (sortOrder === 'asc' ? <ChevronUp size={12} className="inline" /> : <ChevronDown size={12} className="inline" />)}</th>
                                            <th className="p-4 text-xs font-bold uppercase cursor-pointer hover:text-green-400 transition" onClick={() => handleSort('bestPrice')}>Mejor Directo {sortBy === 'bestPrice' && (sortOrder === 'asc' ? <ChevronUp size={12} className="inline" /> : <ChevronDown size={12} className="inline" />)}</th>
                                            <th className="p-4 text-xs font-bold uppercase cursor-pointer hover:text-purple-400 transition" onClick={() => handleSort('savings')}>Ahorro {sortBy === 'savings' && (sortOrder === 'asc' ? <ChevronUp size={12} className="inline" /> : <ChevronDown size={12} className="inline" />)}</th>
                                            <th className="p-4 text-xs font-bold uppercase">Stock</th>
                                            <th className="p-4 text-xs font-bold uppercase">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {filteredAndSortedProducts.length === 0 ? (
                                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">No se encontraron productos.</td></tr>
                                        ) : (
                                            filteredAndSortedProducts.map((product, idx) => (
                                                <motion.tr key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.01 }} whileHover={{ backgroundColor: 'rgba(59,130,246,0.05)' }} className="transition-colors">
                                                    <td className="p-4"><div><span className="text-white font-medium">{product.brand}</span><br /><span className="text-[11px] text-gray-400">{product.size}</span></div></td>
                                                    <td className="p-4 font-mono text-white">${(product.mlPrice * quantity).toLocaleString()}{quantity > 1 && <span className="text-[10px] text-gray-400 ml-1">({quantity}u)</span>}</td>
                                                    <td className="p-4"><div><span className="font-mono text-green-400">${(product.bestDirectPrice * quantity).toLocaleString()}</span><br /><span className="text-[9px] text-gray-400">{product.bestSource}</span></div></td>
                                                    <td className="p-4"><span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">+${(product.savings * quantity).toLocaleString()}</span></td>
                                                    <td className="p-4">{product.hasStock ? <span className="text-green-400 text-xs flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span>Alto</span> : <span className="text-red-400 text-xs flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full"></span>Bajo</span>}</td>
                                                    <td className="p-4"><button onClick={() => setSelectedProduct(product)} className="p-2 rounded-lg hover:bg-white/10 transition"><Eye size={16} className="text-blue-400" /></button></td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4"><p className="text-xs text-gray-500">Mostrando {filteredAndSortedProducts.length} de {aggregatedProducts.length} productos{quantity > 1 && ` · Precios para ${quantity} llanta(s)`}</p><button onClick={exportToCSV} disabled={!filteredAndSortedProducts.length} className="neumorph-btn px-6 py-2 text-sm flex items-center gap-2 disabled:opacity-50"><Download size={14} /> Exportar CSV</button></div>
                    </main>
                </div>
            </div>

            {/* Modal de detalles */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1a1b1e] rounded-2xl max-w-md w-full p-6 border border-gray-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-white">Detalles del producto</h3><button onClick={() => setSelectedProduct(null)}><X size={20} className="text-gray-400 hover:text-white" /></button></div>
                            <div className="space-y-3"><div><p className="text-xs text-gray-400">Marca</p><p className="text-white font-semibold">{selectedProduct.brand}</p></div><div><p className="text-xs text-gray-400">Medida</p><p className="text-white font-mono">{selectedProduct.size}</p></div><div><p className="text-xs text-gray-400">Precio ML</p><p className="text-white font-mono">${selectedProduct.mlPrice.toLocaleString()}</p></div><div><p className="text-xs text-gray-400">Mejor precio directo</p><p className="text-green-400 font-mono">${selectedProduct.bestDirectPrice.toLocaleString()} ({selectedProduct.bestSource})</p></div><div><p className="text-xs text-gray-400">Ahorro potencial</p><p className="text-red-400 font-mono">${selectedProduct.savings.toLocaleString()}</p></div><div><p className="text-xs text-gray-400">Stock</p><p className={selectedProduct.hasStock ? 'text-green-400' : 'text-red-400'}>{selectedProduct.hasStock ? 'Disponible' : 'Agotado'}</p></div></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Subcomponentes auxiliares
const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] to-[#0d0e11] flex items-center justify-center">
        <div className="text-center"><div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-400">Cargando inteligencia de precios...</p></div>
    </div>
);

const ErrorScreen = ({ error, onRetry }) => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b1e] to-[#0d0e11] flex items-center justify-center">
        <div className="bg-red-900/20 backdrop-blur-md border border-red-500 rounded-2xl p-8 text-center max-w-md"><p className="text-red-400 mb-4">{error}</p><button onClick={onRetry} className="neumorph-btn bg-red-600/20 text-red-400 px-6 py-2 rounded-xl hover:bg-red-600/30">Reintentar</button></div>
    </div>
);

const AnimatedBackground = () => (
    <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBmaWxsPSJub25lIiBzdHJva2U9IiMyZjMxMzgiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] bg-repeat opacity-20"></div>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
    </div>
);

export default Products;