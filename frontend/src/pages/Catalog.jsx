import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, Grid, ShoppingCart, Tag, X, ChevronDown, 
    Star, TrendingUp, Package, AlertCircle, CheckCircle, 
    Zap, Eye, Heart, Share2, Truck, Shield, Sparkles
} from 'lucide-react';

const Catalog = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filters, setFilters] = useState({
        brand: '',
        size: '',
        priceRange: '',
        stock: '',
        rating: ''
    });

    // Expanded product data
    const products = [
        {
            id: 1,
            name: 'Michelin Primacy 4',
            size: '205/55 R16',
            price: 3750,
            originalPrice: 4200,
            stock: 45,
            brand: 'Michelin',
            image: 'michelin.jpg',
            rating: 4.8,
            reviews: 234,
            demand: 92,
            season: 'Verano',
            type: 'Premium',
            warranty: '5 años',
            speedRating: 'V',
            loadIndex: '91'
        },
        {
            id: 2,
            name: 'Bridgestone Turanza T005',
            size: '195/65 R15',
            price: 2850,
            originalPrice: 3200,
            stock: 23,
            brand: 'Bridgestone',
            image: 'bridgestone.jpg',
            rating: 4.7,
            reviews: 189,
            demand: 88,
            season: 'Todo tiempo',
            type: 'Premium',
            warranty: '4 años',
            speedRating: 'H',
            loadIndex: '88'
        },
        {
            id: 3,
            name: 'Continental PremiumContact 6',
            size: '225/45 R17',
            price: 4250,
            originalPrice: 4800,
            stock: 12,
            brand: 'Continental',
            image: 'continental.jpg',
            rating: 4.9,
            reviews: 312,
            demand: 95,
            season: 'Verano',
            type: 'Ultra Premium',
            warranty: '6 años',
            speedRating: 'W',
            loadIndex: '94'
        },
        {
            id: 4,
            name: 'Pirelli P Zero Corsa',
            size: '235/55 R17',
            price: 5200,
            originalPrice: 5800,
            stock: 8,
            brand: 'Pirelli',
            image: 'pirelli.jpg',
            rating: 4.9,
            reviews: 178,
            demand: 85,
            season: 'Verano',
            type: 'Performance',
            warranty: '4 años',
            speedRating: 'Y',
            loadIndex: '95'
        },
        {
            id: 5,
            name: 'Goodyear Eagle F1 Asymmetric 5',
            size: '215/60 R16',
            price: 3450,
            originalPrice: 3900,
            stock: 31,
            brand: 'Goodyear',
            image: 'goodyear.jpg',
            rating: 4.6,
            reviews: 245,
            demand: 78,
            season: 'Todo tiempo',
            type: 'Premium',
            warranty: '5 años',
            speedRating: 'V',
            loadIndex: '92'
        },
        {
            id: 6,
            name: 'Hankook Ventus S1 evo3',
            size: '205/50 R17',
            price: 2890,
            originalPrice: 3300,
            stock: 56,
            brand: 'Hankook',
            image: 'hankook.jpg',
            rating: 4.5,
            reviews: 167,
            demand: 72,
            season: 'Verano',
            type: 'Standard',
            warranty: '4 años',
            speedRating: 'W',
            loadIndex: '90'
        }
    ];

    const brands = ['Michelin', 'Bridgestone', 'Continental', 'Pirelli', 'Goodyear', 'Hankook'];
    const sizes = ['205/55 R16', '195/65 R15', '225/45 R17', '235/55 R17', '215/60 R16', '205/50 R17'];
    const priceRanges = [
        { label: 'Todos', value: '' },
        { label: 'Menos de $3,000', value: '0-3000' },
        { label: '$3,000 - $4,000', value: '3000-4000' },
        { label: '$4,000 - $5,000', value: '4000-5000' },
        { label: 'Más de $5,000', value: '5000+' }
    ];

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  product.size.includes(searchTerm);
            const matchesBrand = !filters.brand || product.brand === filters.brand;
            const matchesSize = !filters.size || product.size === filters.size;
            const matchesStock = !filters.stock || 
                (filters.stock === 'high' && product.stock > 20) ||
                (filters.stock === 'medium' && product.stock >= 5 && product.stock <= 20) ||
                (filters.stock === 'low' && product.stock < 5);
            const matchesPrice = !filters.priceRange || (() => {
                const [min, max] = filters.priceRange.split('-');
                if (max === '+') return product.price >= parseInt(min);
                return product.price >= parseInt(min) && product.price <= parseInt(max);
            })();
            const matchesRating = !filters.rating || product.rating >= parseFloat(filters.rating);
            
            return matchesSearch && matchesBrand && matchesSize && matchesStock && matchesPrice && matchesRating;
        });
    }, [products, searchTerm, filters]);

    const clearFilters = () => {
        setFilters({
            brand: '',
            size: '',
            priceRange: '',
            stock: '',
            rating: ''
        });
        setSearchTerm('');
    };

    const getStockStatus = (stock) => {
        if (stock > 20) return { label: 'Stock Alto', color: 'emerald', icon: CheckCircle };
        if (stock >= 5) return { label: 'Stock Medio', color: 'amber', icon: AlertCircle };
        return { label: 'Stock Bajo', color: 'red', icon: AlertCircle };
    };

    const getStockBadgeClasses = (color) => {
        switch (color) {
            case 'emerald': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            case 'amber': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
            case 'red': return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default: return 'bg-[#1E90FF]/20 text-[#1E90FF] border border-[#1E90FF]/30';
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    return (
        <div className="space-y-6">
            {/* Header Section - Azul translúcido */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">
                        Catálogo de Llantas
                    </h1>
                    <p className="text-[#AFC8E6] mt-1 flex items-center gap-2">
                        <Package size={14} className="text-[#1E90FF]" />
                        {filteredProducts.length} productos disponibles de {brands.length} marcas
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por marca, nombre o medida..."
                            className="w-full lg:w-96 pl-12 pr-4 py-3 bg-[#102A4C]/80 backdrop-blur-sm border border-[#1E90FF]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent shadow-inner text-[#EAF3FF] placeholder-[#AFC8E6]/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E90FF]" />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AFC8E6] hover:text-[#EAF3FF]"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    
                    {/* Filter Button */}
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                            showFilters 
                                ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md shadow-[#1E90FF]/25'
                                : 'bg-[#102A4C]/80 backdrop-blur-sm border border-[#1E90FF]/30 text-[#AFC8E6] hover:bg-[#1E4D7A]'
                        }`}
                    >
                        <Filter size={16} />
                        Filtros
                        {Object.values(filters).some(f => f) && (
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                    </motion.button>
                    
                    {/* View Toggle */}
                    <div className="flex gap-1 bg-[#102A4C]/80 backdrop-blur-sm rounded-xl p-1 shadow-inner border border-[#1E90FF]/20">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md' : 'text-[#AFC8E6] hover:text-[#EAF3FF]'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md' : 'text-[#AFC8E6] hover:text-[#EAF3FF]'}`}
                        >
                            <Package size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Panel - Azul translúcido */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] backdrop-blur-md rounded-2xl p-6 border border-[#1E90FF]/20 shadow-lg space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-[#EAF3FF] flex items-center gap-2">
                                    <Filter size={16} className="text-[#1E90FF]" />
                                    Filtros Avanzados
                                </h3>
                                <button 
                                    onClick={clearFilters}
                                    className="text-xs text-[#1E90FF] hover:text-[#3B82F6] font-medium"
                                >
                                    Limpiar todo
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {/* Brand Filter */}
                                <div>
                                    <label className="text-xs font-semibold text-[#AFC8E6] mb-1 block">Marca</label>
                                    <select 
                                        value={filters.brand}
                                        onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                                        className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                    >
                                        <option value="">Todas</option>
                                        {brands.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                
                                {/* Size Filter */}
                                <div>
                                    <label className="text-xs font-semibold text-[#AFC8E6] mb-1 block">Medida</label>
                                    <select 
                                        value={filters.size}
                                        onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                                        className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                    >
                                        <option value="">Todas</option>
                                        {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                
                                {/* Price Filter */}
                                <div>
                                    <label className="text-xs font-semibold text-[#AFC8E6] mb-1 block">Rango de Precio</label>
                                    <select 
                                        value={filters.priceRange}
                                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                                        className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                    >
                                        {priceRanges.map(pr => <option key={pr.value} value={pr.value}>{pr.label}</option>)}
                                    </select>
                                </div>
                                
                                {/* Stock Filter */}
                                <div>
                                    <label className="text-xs font-semibold text-[#AFC8E6] mb-1 block">Stock</label>
                                    <select 
                                        value={filters.stock}
                                        onChange={(e) => setFilters(prev => ({ ...prev, stock: e.target.value }))}
                                        className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                    >
                                        <option value="">Todos</option>
                                        <option value="high">Alto (&gt;20)</option>
                                        <option value="medium">Medio (5-20)</option>
                                        <option value="low">Bajo (&lt;5)</option>
                                    </select>
                                </div>
                                
                                {/* Rating Filter */}
                                <div>
                                    <label className="text-xs font-semibold text-[#AFC8E6] mb-1 block">Calificación</label>
                                    <select 
                                        value={filters.rating}
                                        onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                                        className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                    >
                                        <option value="">Todas</option>
                                        <option value="4.5">4.5+ estrellas</option>
                                        <option value="4.0">4.0+ estrellas</option>
                                        <option value="3.5">3.5+ estrellas</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Active Filters Display */}
                            {Object.values(filters).some(f => f) && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="text-xs text-[#AFC8E6]">Filtros activos:</span>
                                    {filters.brand && <span className="text-xs bg-[#1E90FF]/20 text-[#1E90FF] px-2 py-1 rounded-full border border-[#1E90FF]/30">Marca: {filters.brand}</span>}
                                    {filters.size && <span className="text-xs bg-[#1E90FF]/20 text-[#1E90FF] px-2 py-1 rounded-full border border-[#1E90FF]/30">Medida: {filters.size}</span>}
                                    {filters.priceRange && <span className="text-xs bg-[#1E90FF]/20 text-[#1E90FF] px-2 py-1 rounded-full border border-[#1E90FF]/30">Precio: {priceRanges.find(pr => pr.value === filters.priceRange)?.label}</span>}
                                    {filters.stock && <span className="text-xs bg-[#1E90FF]/20 text-[#1E90FF] px-2 py-1 rounded-full border border-[#1E90FF]/30">Stock: {filters.stock === 'high' ? 'Alto' : filters.stock === 'medium' ? 'Medio' : 'Bajo'}</span>}
                                    {filters.rating && <span className="text-xs bg-[#1E90FF]/20 text-[#1E90FF] px-2 py-1 rounded-full border border-[#1E90FF]/30">{filters.rating}+ estrellas</span>}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Products Grid/List - Tarjetas con gradiente azul */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                }
            >
                <AnimatePresence mode="wait">
                    {filteredProducts.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="col-span-full text-center py-20"
                        >
                            <Search className="w-16 h-16 text-[#1E90FF]/30 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[#EAF3FF] mb-2">No se encontraron resultados</h3>
                            <p className="text-[#AFC8E6] mb-6">Prueba con otra marca o medida de llanta</p>
                            <button 
                                onClick={clearFilters}
                                className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:shadow-[#1E90FF]/25 transition-all"
                            >
                                Limpiar filtros
                            </button>
                        </motion.div>
                    ) : (
                        filteredProducts.map((product, index) => {
                            const stockStatus = getStockStatus(product.stock);
                            const StockIcon = stockStatus.icon;
                            
                            return viewMode === 'grid' ? (
                                <motion.div
                                    key={product.id}
                                    variants={fadeInUp}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    className="group bg-gradient-to-br from-[#163A6B] to-[#102A4C] backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                                >
                                    {/* Product Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-[#0B1E3A] to-[#102A4C] overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E3A]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-32 h-32 bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 rounded-full flex items-center justify-center shadow-inner border border-[#1E90FF]/30">
                                                <span className="text-5xl">🛞</span>
                                            </div>
                                        </div>
                                        
                                        {/* Stock Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg ${getStockBadgeClasses(stockStatus.color)}`}>
                                                <StockIcon size={10} />
                                                {stockStatus.label}
                                            </span>
                                        </div>
                                        
                                        {/* Rating Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg bg-[#0B1E3A]/80 backdrop-blur-sm text-[#F59E0B] border border-[#F59E0B]/30">
                                                <Star size={10} className="fill-amber-500" />
                                                {product.rating}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Product Info */}
                                    <div className="p-5 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-[#EAF3FF] group-hover:text-[#1E90FF] transition-colors line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-[#AFC8E6] flex items-center gap-1 mt-1">
                                                <Grid size={12} />
                                                {product.size}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-[#1E90FF]">${product.price.toLocaleString()}</span>
                                            <span className="text-xs text-[#AFC8E6] line-through">${product.originalPrice.toLocaleString()}</span>
                                            <span className="text-xs text-emerald-400 font-medium ml-auto bg-emerald-500/20 px-2 py-0.5 rounded-full">
                                                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 text-xs text-[#AFC8E6]">
                                            <div className="flex items-center gap-1">
                                                <TrendingUp size={12} className="text-[#1E90FF]" />
                                                <span>Demanda {product.demand}%</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Truck size={12} className="text-[#1E90FF]" />
                                                <span>Envío gratis</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 pt-2">
                                            <motion.button 
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex-1 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white py-2 rounded-xl font-semibold shadow-md hover:shadow-lg hover:shadow-[#1E90FF]/25 transition-all flex items-center justify-center gap-2 text-sm"
                                            >
                                                <ShoppingCart size={14} />
                                                Comprar
                                            </motion.button>
                                            <motion.button 
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="p-2 text-[#AFC8E6] hover:text-[#1E90FF] hover:bg-[#1E90FF]/10 rounded-xl transition-all"
                                            >
                                                <Heart size={16} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                // List View
                                <motion.div
                                    key={product.id}
                                    variants={fadeInUp}
                                    whileHover={{ x: 4 }}
                                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] backdrop-blur-md rounded-2xl p-4 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20 flex flex-col md:flex-row gap-4 items-center"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#1E90FF]/30">
                                        <span className="text-3xl">🛞</span>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-[#EAF3FF]">{product.name}</h3>
                                        <p className="text-sm text-[#AFC8E6]">{product.size}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-amber-500 text-amber-500" : "text-[#AFC8E6]/30"} />
                                                ))}
                                                <span className="text-xs text-[#AFC8E6] ml-1">({product.reviews})</span>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStockBadgeClasses(stockStatus.color)}`}>
                                                {stockStatus.label}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold text-[#1E90FF]">${product.price.toLocaleString()}</span>
                                            <span className="text-xs text-[#AFC8E6] line-through">${product.originalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <motion.button 
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="px-4 py-1.5 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white rounded-lg font-semibold text-sm flex items-center gap-1 shadow-md hover:shadow-lg transition-all"
                                            >
                                                <ShoppingCart size={12} />
                                                Comprar
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Pagination - Azul translúcido */}
            {filteredProducts.length > 0 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                    <button className="px-4 py-2 bg-[#102A4C]/80 backdrop-blur rounded-xl shadow-md border border-[#1E90FF]/30 hover:shadow-lg text-[#AFC8E6] hover:text-[#EAF3FF] font-medium transition-all text-sm">
                        Anterior
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white rounded-xl shadow-md shadow-[#1E90FF]/25 font-semibold text-sm">
                        1
                    </button>
                    <button className="px-4 py-2 bg-[#102A4C]/80 backdrop-blur rounded-xl shadow-md border border-[#1E90FF]/30 hover:shadow-lg text-[#AFC8E6] hover:text-[#EAF3FF] font-medium transition-all text-sm">
                        2
                    </button>
                    <button className="px-4 py-2 bg-[#102A4C]/80 backdrop-blur rounded-xl shadow-md border border-[#1E90FF]/30 hover:shadow-lg text-[#AFC8E6] hover:text-[#EAF3FF] font-medium transition-all text-sm">
                        3
                    </button>
                    <button className="px-4 py-2 bg-[#102A4C]/80 backdrop-blur rounded-xl shadow-md border border-[#1E90FF]/30 hover:shadow-lg text-[#AFC8E6] hover:text-[#EAF3FF] font-medium transition-all text-sm">
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default Catalog;