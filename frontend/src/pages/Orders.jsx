import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler, RadialLinearScale, BarElement } from 'chart.js';
import { Line, Doughnut, Radar, Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Disc, ShoppingCart, Activity, Gauge, Download, Filter, Search, 
  TrendingUp, TrendingDown, Truck, Package, Clock, CheckCircle,
  AlertCircle, Zap, Shield, Cpu, Database, BarChart3, 
  LineChart, PieChart, Eye, EyeOff, Maximize2, Minimize2,
  RefreshCw, ChevronDown, ChevronUp, Settings, Bell, User
} from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, ArcElement, 
  Tooltip, Legend, Filler, RadialLinearScale, BarElement
);

const OrdersTireSystem = () => {
    // Estados
    const [view, setView] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showStats, setShowStats] = useState(true);
    const [chartType, setChartType] = useState('line');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    
    const chartContainerRef = useRef(null);
    
    // Datos mejorados de ventas de neumáticos
    const tireOrders = useMemo(() => [
        { id: "ORD-9921", brand: "Michelin", model: "Pilot Sport 4S", qty: 4, status: "Entregado", total: 18500, type: "Racing", date: "2024-01-15", tracking: "TRK-001", customer: "AutoSport Racing", priority: "Alta" },
        { id: "ORD-9922", brand: "Bridgestone", model: "Turanza T005", qty: 2, status: "Procesando", total: 6400, type: "Premium", date: "2024-01-16", tracking: "TRK-002", customer: "Luxury Motors", priority: "Media" },
        { id: "ORD-9923", brand: "Pirelli", model: "P Zero", qty: 4, status: "Almacén", total: 22000, type: "Racing", date: "2024-01-14", tracking: "TRK-003", customer: "Speed Demon", priority: "Alta" },
        { id: "ORD-9924", brand: "Continental", model: "UltraContact", qty: 4, status: "Entregado", total: 9800, type: "Eco", date: "2024-01-13", tracking: "TRK-004", customer: "Green Wheels", priority: "Baja" },
        { id: "ORD-9925", brand: "Goodyear", model: "Eagle F1", qty: 2, status: "Enviado", total: 7200, type: "Racing", date: "2024-01-17", tracking: "TRK-005", customer: "Track Day", priority: "Media" },
        { id: "ORD-9926", brand: "Hankook", model: "Ventus S1", qty: 4, status: "Procesando", total: 11200, type: "Premium", date: "2024-01-16", tracking: "TRK-006", customer: "City Drive", priority: "Baja" },
        { id: "ORD-9927", brand: "Yokohama", model: "Advant GT", qty: 2, status: "Almacén", total: 5400, type: "Racing", date: "2024-01-15", tracking: "TRK-007", customer: "Night Runners", priority: "Media" },
        { id: "ORD-9928", brand: "Dunlop", model: "Sport Maxx", qty: 4, status: "Entregado", total: 15600, type: "Premium", date: "2024-01-12", tracking: "TRK-008", customer: "Elite Auto", priority: "Alta" },
    ], []);
    
    // Filtrar órdenes
    const filteredOrders = useMemo(() => {
        return tireOrders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  order.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  order.model.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesBrand = selectedBrand === 'all' || order.brand === selectedBrand;
            const matchesView = view === 'all' || order.type.toLowerCase() === view.toLowerCase();
            return matchesSearch && matchesBrand && matchesView;
        });
    }, [tireOrders, searchTerm, selectedBrand, view]);
    
    // Estadísticas mejoradas
    const stats = useMemo(() => {
        const totalSales = filteredOrders.reduce((acc, curr) => acc + curr.total, 0);
        const totalTires = filteredOrders.reduce((acc, curr) => acc + curr.qty, 0);
        const avgOrderValue = filteredOrders.length > 0 ? totalSales / filteredOrders.length : 0;
        const completedOrders = filteredOrders.filter(o => o.status === 'Entregado').length;
        const completionRate = filteredOrders.length > 0 ? (completedOrders / filteredOrders.length) * 100 : 0;
        
        // Ventas por marca
        const brandSales = {};
        filteredOrders.forEach(order => {
            brandSales[order.brand] = (brandSales[order.brand] || 0) + order.total;
        });
        
        return { totalSales, totalTires, avgOrderValue, completionRate, brandSales };
    }, [filteredOrders]);
    
    // Datos para gráficas mejoradas
    const weeklySalesData = {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
            {
                label: 'Unidades Vendidas 2024',
                data: [45, 52, 38, 65, 48, 70, 85],
                borderColor: '#E10600',
                backgroundColor: 'rgba(225, 6, 0, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointBackgroundColor: '#E10600',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
            {
                label: 'Proyección',
                data: [42, 48, 40, 60, 50, 68, 82],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 8,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#fff',
                pointBorderWidth: 1,
                borderDash: [5, 5],
            }
        ]
    };
    
    const brandSalesData = {
        labels: Object.keys(stats.brandSales),
        datasets: [{
            label: 'Ventas por Marca (MXN)',
            data: Object.values(stats.brandSales),
            backgroundColor: [
                '#E10600', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
            ],
            borderRadius: 8,
            borderWidth: 0,
        }]
    };
    
    const inventoryMixData = {
        labels: ['Racing (Alta Performance)', 'Premium (Lujo)', 'Eco (Eficiencia)', 'Todoterreno', 'Invierno'],
        datasets: [{
            data: [40, 35, 15, 7, 3],
            backgroundColor: ['#E10600', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
            borderWidth: 0,
            hoverOffset: 15,
        }]
    };
    
    const performanceRadarData = {
        labels: ['Velocidad', 'Durabilidad', 'Eficiencia', 'Agarre', 'Ruido', 'Precio'],
        datasets: [{
            label: 'Michelin Pilot Sport',
            data: [95, 88, 75, 98, 82, 70],
            backgroundColor: 'rgba(225, 6, 0, 0.2)',
            borderColor: '#E10600',
            borderWidth: 2,
            pointBackgroundColor: '#E10600',
            pointBorderColor: '#fff',
            pointHoverRadius: 8,
        }, {
            label: 'Bridgestone Turanza',
            data: [82, 92, 85, 85, 88, 75],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3B82F6',
            borderWidth: 2,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#fff',
            pointHoverRadius: 8,
        }]
    };
    
    const getStatusColor = (status) => {
        const colors = {
            'Entregado': 'bg-green-500/20 text-green-400 border-green-500/30',
            'Enviado': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'Procesando': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            'Almacén': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };
    
    const getPriorityColor = (priority) => {
        const colors = {
            'Alta': 'text-red-400 bg-red-500/10',
            'Media': 'text-yellow-400 bg-yellow-500/10',
            'Baja': 'text-green-400 bg-green-500/10'
        };
        return colors[priority] || 'text-gray-400 bg-gray-500/10';
    };
    
    // Marcas únicas para filtro
    const brands = useMemo(() => ['all', ...new Set(tireOrders.map(o => o.brand))], [tireOrders]);
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B0E14] via-[#0f172a] to-[#0B0E14] text-white p-4 md:p-6 font-['Inter', system-ui, sans-serif]">
            
            {/* Fondo decorativo */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-5 animate-pulse" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-red-500 rounded-full mix-blend-screen filter blur-[100px] opacity-5 animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] opacity-5 animate-pulse delay-2000" />
            </div>
            
            {/* Header Principal */}
            <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-800/50">
                <div className="flex items-center gap-4">
                    <motion.div 
                        whileHover={{ scale: 1.05, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl blur-md opacity-50" />
                        <div className="relative bg-gradient-to-br from-red-600 to-red-700 p-2.5 rounded-xl">
                            <Disc size={28} className="text-white" />
                        </div>
                    </motion.div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent">
                            TireCore <span className="text-red-500">OMS</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 font-mono tracking-wider">
                            ORDER MANAGEMENT SYSTEM // REAL-TIME ANALYTICS v3.0
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300"
                        onClick={() => setRefreshKey(prev => prev + 1)}
                    >
                        <RefreshCw size={18} className="text-gray-400 hover:text-red-400 transition-colors" />
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300"
                    >
                        <Download size={18} className="text-gray-400" />
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                    >
                        <ShoppingCart size={18} />
                        <span>NUEVA ORDEN</span>
                    </motion.button>
                </div>
            </header>
            
            {/* Panel de Estadísticas Mejorado */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
                {[
                    { label: 'VOLUMEN DE VENTAS', val: `$${stats.totalSales.toLocaleString()}`, icon: TrendingUp, color: 'from-red-500 to-red-600', change: '+12.5%', changeColor: 'text-green-400' },
                    { label: 'NEUMÁTICOS VENDIDOS', val: stats.totalTires, icon: Disc, color: 'from-blue-500 to-blue-600', change: '+8.3%', changeColor: 'text-green-400' },
                    { label: 'VALOR PROMEDIO', val: `$${stats.avgOrderValue.toLocaleString()}`, icon: Activity, color: 'from-purple-500 to-purple-600', change: '-2.1%', changeColor: 'text-red-400' },
                    { label: 'TASA DE COMPLETACIÓN', val: `${stats.completionRate.toFixed(1)}%`, icon: CheckCircle, color: 'from-green-500 to-green-600', change: '+5.7%', changeColor: 'text-green-400' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl" style={{ background: `linear-gradient(135deg, ${item.color.split(' ')[1]}, ${item.color.split(' ')[3]})` }} />
                        <div className="relative bg-[#141517]/80 backdrop-blur-sm p-5 rounded-xl border border-gray-800/50 shadow-xl">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.label}</span>
                                <div className={`bg-gradient-to-r ${item.color} p-1.5 rounded-lg`}>
                                    <item.icon size={14} className="text-white" />
                                </div>
                            </div>
                            <div className="text-2xl font-mono font-bold tracking-tight text-white">{item.val}</div>
                            <div className="flex items-center gap-1 mt-2">
                                <span className={`text-[10px] font-semibold ${item.changeColor}`}>{item.change}</span>
                                <span className="text-[9px] text-gray-600">vs semana anterior</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            
            {/* Sección de Gráficas Avanzadas */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
            >
                {/* Gráfica de Líneas - Ventas Semanales */}
                <div className="lg:col-span-1 bg-[#141517]/80 backdrop-blur-sm p-5 rounded-xl border border-gray-800/50 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <LineChart size={14} className="text-red-500" />
                            TENDENCIA DE VENTAS
                        </h3>
                        <div className="flex gap-1">
                            {['line', 'bar'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setChartType(type)}
                                    className={`p-1 rounded transition-all ${chartType === type ? 'bg-red-500/20 text-red-400' : 'text-gray-600 hover:text-gray-400'}`}
                                >
                                    {type === 'line' ? <LineChart size={12} /> : <BarChart3 size={12} />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-48">
                        {chartType === 'line' ? (
                            <Line 
                                data={weeklySalesData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'bottom', labels: { color: '#888', font: { size: 10 } } } },
                                    scales: { y: { grid: { color: '#1f1f1f' }, ticks: { color: '#888' } }, x: { ticks: { color: '#888' } } }
                                }} 
                            />
                        ) : (
                            <Bar 
                                data={weeklySalesData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'bottom', labels: { color: '#888', font: { size: 10 } } } },
                                    scales: { y: { grid: { color: '#1f1f1f' }, ticks: { color: '#888' } }, x: { ticks: { color: '#888' } } }
                                }} 
                            />
                        )}
                    </div>
                </div>
                
                {/* Gráfica de Doughnut - Mix de Producto */}
                <div className="bg-[#141517]/80 backdrop-blur-sm p-5 rounded-xl border border-gray-800/50 shadow-xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                        <PieChart size={14} className="text-blue-500" />
                        MIX DE INVENTARIO
                    </h3>
                    <div className="h-48">
                        <Doughnut 
                            data={inventoryMixData}
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { 
                                    legend: { position: 'bottom', labels: { color: '#888', font: { size: 9 } } },
                                    tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}%` } }
                                } 
                            }}
                        />
                    </div>
                </div>
                
                {/* Gráfica de Barras - Ventas por Marca */}
                <div className="bg-[#141517]/80 backdrop-blur-sm p-5 rounded-xl border border-gray-800/50 shadow-xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                        <BarChart3 size={14} className="text-green-500" />
                        VENTAS POR MARCA
                    </h3>
                    <div className="h-48">
                        <Bar 
                            data={brandSalesData}
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { grid: { color: '#1f1f1f' }, ticks: { color: '#888' } }, x: { ticks: { color: '#888', font: { size: 9 } } } }
                            }}
                        />
                    </div>
                </div>
            </motion.div>
            
            {/* Segunda fila de gráficas */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
                {/* Gráfica Radar - Comparativa de Rendimiento */}
                <div className="bg-[#141517]/80 backdrop-blur-sm p-5 rounded-xl border border-gray-800/50 shadow-xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                        <Activity size={14} className="text-purple-500" />
                        COMPARATIVA DE RENDIMIENTO
                    </h3>
                    <div className="h-64">
                        <Radar 
                            data={performanceRadarData}
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                scales: { r: { grid: { color: '#1f1f1f' }, ticks: { color: '#888', stepSize: 20 }, pointLabels: { color: '#888', font: { size: 9 } } } },
                                plugins: { legend: { position: 'bottom', labels: { color: '#888', font: { size: 10 } } } }
                            }}
                        />
                    </div>
                </div>
                
                {/* Métricas adicionales */}
                <div className="bg-[#141517]/80 backdrop-blur-sm p-5 rounded-xl border border-gray-800/50 shadow-xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                        <Database size={14} className="text-cyan-500" />
                        MÉTRICAS EN TIEMPO REAL
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Eficiencia Logística', value: '98.2%', color: 'bg-green-500', progress: 98 },
                            { label: 'Satisfacción del Cliente', value: '94.7%', color: 'bg-blue-500', progress: 94 },
                            { label: 'Rotación de Inventario', value: '86.3%', color: 'bg-yellow-500', progress: 86 },
                            { label: 'Precisión de Entregas', value: '99.1%', color: 'bg-purple-500', progress: 99 },
                        ].map((metric, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">{metric.label}</span>
                                    <span className="text-white font-mono font-bold">{metric.value}</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${metric.progress}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className={`h-full rounded-full ${metric.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
            
            {/* Filtros y Búsqueda */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#141517]/80 backdrop-blur-sm rounded-xl border border-gray-800/50 shadow-xl overflow-hidden mb-6"
            >
                <div className="p-4 border-b border-gray-800/50">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input 
                                type="text" 
                                placeholder="Buscar por ID, marca o modelo de neumático..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all duration-300"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select 
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-all duration-300"
                            >
                                {brands.map(brand => (
                                    <option key={brand} value={brand}>
                                        {brand === 'all' ? 'Todas las Marcas' : brand}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-1 bg-black/50 border border-gray-700 rounded-lg p-1">
                                {['all', 'racing', 'premium', 'eco'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setView(type)}
                                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                                            view === type 
                                                ? 'bg-red-500 text-white' 
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {type === 'all' ? 'TODO' : type.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Tabla de Órdenes Mejorada */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/30 border-b border-gray-800/50">
                            <tr className="text-[10px] text-gray-500 uppercase tracking-wider">
                                <th className="p-4">TRACK ID</th>
                                <th className="p-4">ESPECIFICACIÓN</th>
                                <th className="p-4">CLIENTE</th>
                                <th className="p-4">CANTIDAD</th>
                                <th className="p-4">TOTAL</th>
                                <th className="p-4">PRIORIDAD</th>
                                <th className="p-4">ESTATUS</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            <AnimatePresence>
                                {filteredOrders.map((order, idx) => (
                                    <motion.tr 
                                        key={order.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ backgroundColor: "rgba(225, 6, 0, 0.05)" }}
                                        className="cursor-pointer transition-all duration-300"
                                    >
                                        <td className="p-4">
                                            <span className="font-mono text-red-400 font-bold text-sm">{order.id}</span>
                                            <p className="text-[9px] text-gray-600 mt-0.5">{order.date}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-white text-sm">{order.brand}</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-wide">{order.model}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-300">{order.customer}</span>
                                            <p className="text-[9px] text-gray-600 mt-0.5">{order.tracking}</p>
                                        </td>
                                        <td className="p-4 font-mono text-sm">{order.qty} UN</td>
                                        <td className="p-4 font-bold text-white text-sm">${order.total.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${getPriorityColor(order.priority)}`}>
                                                {order.priority}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                className="text-gray-500 hover:text-red-400 transition-colors"
                                            >
                                                {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                
                {/* Footer de la tabla */}
                <div className="p-4 border-t border-gray-800/50 flex justify-between items-center text-xs text-gray-500">
                    <div>
                        Mostrando {filteredOrders.length} de {tireOrders.length} órdenes
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors">Anterior</button>
                        <button className="px-3 py-1 rounded bg-red-500/20 text-red-400">1</button>
                        <button className="px-3 py-1 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors">2</button>
                        <button className="px-3 py-1 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors">Siguiente</button>
                    </div>
                </div>
            </motion.div>
            
            {/* Footer del Sistema */}
            <div className="text-center text-[10px] text-gray-600 mt-8 pt-4 border-t border-gray-800/50">
                <div className="flex justify-center gap-6 mb-2">
                    <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Sistema Operativo Online
                    </span>
                    <span>🔒 Datos encriptados SSL/TLS</span>
                    <span>📊 Actualización en tiempo real</span>
                    <span>⚡ Latencia: 23ms</span>
                </div>
                <p>© 2026 TireCore OMS · Powered by CHValueGrowth Intelligence · Todos los derechos reservados</p>
            </div>
        </div>
    );
};

export default OrdersTireSystem;