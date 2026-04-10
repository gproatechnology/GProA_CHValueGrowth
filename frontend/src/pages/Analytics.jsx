import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
    Calendar, Download, TrendingUp, Users, ShoppingBag, Percent, 
    Zap, Clock, Award, Target, AlertCircle, ChevronDown,
    ThumbsUp, Activity, BarChart3, X,
    LineChart as LineChartIcon, PieChart as PieChartIcon
} from 'lucide-react';

// Estilos de tooltip para gráficos
const TOOLTIP_STYLE = { 
    backgroundColor: '#0B1E3A', 
    border: '1px solid #1E90FF', 
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    color: '#EAF3FF'
};

// Componente auxiliar para animación de contador
const AnimatedCounter = ({ value, decimals = 0 }) => {
    const [count, setCount] = useState(0);
    
    React.useEffect(() => {
        let start = 0;
        const duration = 1000;
        const increment = value / (duration / 16);
        let timer;
        
        const updateCount = () => {
            start += increment;
            if (start < value) {
                setCount(Math.floor(start));
                timer = setTimeout(updateCount, 16);
            } else {
                setCount(value);
            }
        };
        
        updateCount();
        return () => clearTimeout(timer);
    }, [value]);
    
    return <span>{decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}</span>;
};

const Analytics = () => {
    const [dateRange, setDateRange] = useState('7d');
    const [customDate, setCustomDate] = useState({ start: '', end: '' });
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeChart, setActiveChart] = useState('sales');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [dateRange]);

    // Mock data completa
    const salesDataRaw = [
        { date: '03/21', sales: 12400, orders: 42, avgPrice: 295 },
        { date: '03/22', sales: 13800, orders: 45, avgPrice: 307 },
        { date: '03/23', sales: 14200, orders: 48, avgPrice: 296 },
        { date: '03/24', sales: 13900, orders: 52, avgPrice: 267 },
        { date: '03/25', sales: 15100, orders: 55, avgPrice: 275 },
        { date: '03/26', sales: 15800, orders: 58, avgPrice: 272 },
        { date: '03/27', sales: 16500, orders: 62, avgPrice: 266 },
        { date: '03/28', sales: 17200, orders: 68, avgPrice: 253 },
        { date: '03/29', sales: 16800, orders: 65, avgPrice: 258 },
        { date: '03/30', sales: 18500, orders: 72, avgPrice: 257 },
    ];

    const filteredSales = useMemo(() => {
        const days = { '7d': 7, '30d': 30, '90d': 90 };
        const limit = days[dateRange] || 7;
        return salesDataRaw.slice(-limit);
    }, [dateRange]);

    const kpis = useMemo(() => {
        const totalSales = filteredSales.reduce((sum, d) => sum + d.sales, 0);
        const totalOrders = filteredSales.reduce((sum, d) => sum + d.orders, 0);
        
        const prevLength = filteredSales.length;
        const prevStart = Math.max(0, salesDataRaw.length - (prevLength * 2));
        const prevEnd = Math.max(0, salesDataRaw.length - prevLength);
        const previousPeriodData = salesDataRaw.slice(prevStart, prevEnd);
        const previousPeriodSales = previousPeriodData.reduce((sum, d) => sum + d.sales, 0);
        
        const salesGrowth = previousPeriodSales > 0 ? ((totalSales - previousPeriodSales) / previousPeriodSales) * 100 : 0;
        
        return { 
            totalSales, 
            totalOrders, 
            avgOrderValue: totalOrders ? totalSales / totalOrders : 0, 
            conversionRate: 6.2,
            salesGrowth
        };
    }, [filteredSales, salesDataRaw]);

    const trafficSources = [
        { name: 'Búsqueda Orgánica', value: 45, color: '#1E90FF', growth: '+8%' },
        { name: 'Directo', value: 25, color: '#3B82F6', growth: '+3%' },
        { name: 'Redes Sociales', value: 18, color: '#06B6D4', growth: '+15%' },
        { name: 'Referidos', value: 8, color: '#0891B2', growth: '-2%' },
        { name: 'Email Marketing', value: 4, color: '#0284C7', growth: '+5%' },
    ];

    const demographics = [
        { age: '18-24', customers: 15, percentage: 15 },
        { age: '25-34', customers: 35, percentage: 35 },
        { age: '35-44', customers: 28, percentage: 28 },
        { age: '45-54', customers: 14, percentage: 14 },
        { age: '55+', customers: 8, percentage: 8 },
    ];

    const topProducts = [
        { name: 'Michelin Pilot Sport 4S', units: 245, revenue: 735000, growth: '+23%', rating: 4.9 },
        { name: 'Bridgestone Potenza RE-71R', units: 189, revenue: 529200, growth: '+18%', rating: 4.8 },
        { name: 'Continental PremiumContact 6', units: 156, revenue: 436800, growth: '+12%', rating: 4.7 },
        { name: 'Pirelli P Zero Corsa', units: 134, revenue: 402000, growth: '+28%', rating: 4.9 },
        { name: 'Goodyear Eagle F1', units: 112, revenue: 313600, growth: '+8%', rating: 4.6 },
    ];

    const productAlerts = [
        { id: 1, product: 'Michelin Pilot Sport 4S', message: 'Stock crítico - solo 12 unidades restantes', type: 'critical', date: 'Hace 2 horas' },
        { id: 2, product: 'Bridgestone Potenza', message: 'Nuevo precio más bajo detectado: $2,450', type: 'price', date: 'Hace 5 horas' },
        { id: 3, product: 'Continental PremiumContact', message: '+45% aumento en demanda esta semana', type: 'trend', date: 'Hace 1 día' },
        { id: 4, product: 'Pirelli P Zero', message: 'Nuevo competidor detectado en el mercado', type: 'competitor', date: 'Hace 2 días' },
    ];

    const exportAnalytics = useCallback(() => {
        setExporting(true);
        setTimeout(() => {
            const csvData = filteredSales.map(s => `${s.date},${s.sales},${s.orders}`).join('\n');
            const blob = new Blob([`Fecha,Ventas,Órdenes\n${csvData}`], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `analytics_${new Date().toISOString().slice(0, 19)}.csv`;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
            setExporting(false);
        }, 800);
    }, [filteredSales]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const getAlertIcon = (type) => {
        switch(type) {
            case 'critical': return <AlertCircle className="w-4 h-4 text-red-400" />;
            case 'price': return <Zap className="w-4 h-4 text-amber-400" />;
            case 'trend': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
            default: return <Activity className="w-4 h-4 text-[#1E90FF]" />;
        }
    };

    const getAlertBg = (type) => {
        switch(type) {
            case 'critical': return 'bg-red-500/20 border-red-500/30 text-red-400';
            case 'price': return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
            case 'trend': return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
            default: return 'bg-[#1E90FF]/20 border-[#1E90FF]/30 text-[#1E90FF]';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header con gradiente azul y blur */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-r from-[#0B1E3A]/90 to-[#102A4C]/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-[#1E90FF]/20"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1E90FF]/10 to-[#3B82F6]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#1E90FF]/5 to-[#3B82F6]/5 rounded-full blur-3xl"></div>
                
                <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">
                            Analytics Dashboard
                        </h1>
                        <p className="text-md text-[#AFC8E6] font-medium mt-2 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#1E90FF]" />
                            Inteligencia de negocio y métricas en tiempo real
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setShowCustomPicker(!showCustomPicker)}
                                className="bg-[#102A4C]/80 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-md border border-[#1E90FF]/30 hover:shadow-lg transition-all text-[#1E90FF] font-semibold flex items-center gap-2 text-sm"
                            >
                                <Calendar className="w-4 h-4" />
                                {dateRange === '7d' ? 'Últimos 7 días' : dateRange === '30d' ? 'Últimos 30 días' : 'Personalizado'}
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            
                            <AnimatePresence>
                                {showCustomPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full right-0 mt-2 bg-[#102A4C]/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#1E90FF]/30 p-4 z-20 min-w-[280px]"
                                    >
                                        <div className="space-y-3">
                                            <button 
                                                onClick={() => { setDateRange('7d'); setShowCustomPicker(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${dateRange === '7d' ? 'bg-[#1E90FF]/20 text-[#1E90FF] font-semibold' : 'text-[#AFC8E6] hover:bg-[#1E4D7A]'}`}
                                            >
                                                Últimos 7 días
                                            </button>
                                            <button 
                                                onClick={() => { setDateRange('30d'); setShowCustomPicker(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${dateRange === '30d' ? 'bg-[#1E90FF]/20 text-[#1E90FF] font-semibold' : 'text-[#AFC8E6] hover:bg-[#1E4D7A]'}`}
                                            >
                                                Últimos 30 días
                                            </button>
                                            <button 
                                                onClick={() => { setDateRange('90d'); setShowCustomPicker(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${dateRange === '90d' ? 'bg-[#1E90FF]/20 text-[#1E90FF] font-semibold' : 'text-[#AFC8E6] hover:bg-[#1E4D7A]'}`}
                                            >
                                                Últimos 90 días
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={exportAnalytics}
                            disabled={exporting}
                            className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#1E90FF]/25 transition-all text-white font-semibold flex items-center gap-2 text-sm"
                        >
                            <Download className="w-4 h-4" />
                            {exporting ? 'Exportando...' : 'Exportar CSV'}
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* KPIs con gradiente azul */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
                {[
                    { label: 'Ventas Totales', value: kpis.totalSales, prefix: '$', icon: TrendingUp, color: 'from-[#1E90FF] to-[#3B82F6]', change: '+12.5%' },
                    { label: 'Órdenes', value: kpis.totalOrders, icon: ShoppingBag, color: 'from-emerald-500 to-teal-600', change: '+8.3%' },
                    { label: 'Valor Promedio', value: kpis.avgOrderValue, prefix: '$', icon: Target, color: 'from-amber-500 to-orange-600', change: '+4.2%' },
                    { label: 'Conversión', value: kpis.conversionRate, prefix: '', icon: Percent, color: 'from-purple-500 to-pink-600', change: '+2.1%', suffix: '%' },
                ].map((kpi, index) => (
                    <motion.div
                        key={kpi.label}
                        variants={fadeInUp}
                        whileHover={{ y: -4 }}
                        className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-[#AFC8E6] uppercase tracking-wide">{kpi.label}</p>
                            <div className={`p-2 bg-gradient-to-br ${kpi.color} rounded-xl shadow-md text-white`}>
                                {React.createElement(kpi.icon, { className: 'w-4 h-4' })}
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-[#EAF3FF]">
                            {kpi.prefix || ''}<AnimatedCounter value={typeof kpi.value === 'number' ? kpi.value : parseFloat(kpi.value)} decimals={0} />{kpi.suffix || ''}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-400">{kpi.change} vs periodo anterior</span>
                        </div>
                    </motion.div>
                ))}
            </motion.section>

            {/* Gráficas principales */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Selector de tipo de gráfica */}
                <div className="flex gap-2 bg-[#102A4C]/80 backdrop-blur-sm rounded-xl p-1 w-fit shadow-inner border border-[#1E90FF]/30">
                    {[
                        { id: 'sales', label: 'Ventas', icon: BarChart3 },
                        { id: 'orders', label: 'Órdenes', icon: ShoppingBag },
                        { id: 'both', label: 'Ambos', icon: Activity },
                    ].map(chart => (
                        <motion.button
                            key={chart.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveChart(chart.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                activeChart === chart.id
                                    ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md'
                                    : 'text-[#AFC8E6] hover:text-[#EAF3FF] hover:bg-[#1E4D7A]'
                            }`}
                        >
                            {React.createElement(chart.icon, { className: 'w-3 h-3' })}
                            {chart.label}
                        </motion.button>
                    ))}
                </div>

                <motion.div
                    variants={fadeInUp}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                >
                    <h3 className="text-sm font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                        <LineChartIcon className="w-4 h-4 text-[#1E90FF]" />
                        Tendencia de Ventas y Órdenes
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                        {activeChart === 'sales' ? (
                            <AreaChart data={filteredSales}>
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#1E90FF" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="5 5" stroke="#1E90FF/20"/>
                                <XAxis dataKey="date" stroke="#AFC8E6" tickLine={false} axisLine={false} tickMargin={10}/>
                                <YAxis stroke="#AFC8E6" tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(v) => `$${v/1000}k`}/>
                                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']} />
                                <Legend wrapperStyle={{ color: '#AFC8E6' }} />
                                <Area 
                                    type="monotone" 
                                    dataKey="sales" 
                                    stroke="#1E90FF" 
                                    strokeWidth={3}
                                    fill="url(#salesGradient)" 
                                    name="Ventas (MXN)"
                                />
                            </AreaChart>
                        ) : activeChart === 'orders' ? (
                            <LineChart data={filteredSales}>
                                <CartesianGrid strokeDasharray="5 5" stroke="#1E90FF/20"/>
                                <XAxis dataKey="date" stroke="#AFC8E6" tickLine={false} axisLine={false} tickMargin={10}/>
                                <YAxis stroke="#AFC8E6" tickLine={false} axisLine={false} tickMargin={10}/>
                                <Tooltip contentStyle={TOOLTIP_STYLE} />
                                <Legend wrapperStyle={{ color: '#AFC8E6' }} />
                                <Line 
                                    type="monotone" 
                                    dataKey="orders" 
                                    stroke="#3B82F6" 
                                    strokeWidth={3}
                                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                    name="Número de Órdenes"
                                />
                            </LineChart>
                        ) : (
                            <LineChart data={filteredSales}>
                                <CartesianGrid strokeDasharray="5 5" stroke="#1E90FF/20"/>
                                <XAxis dataKey="date" stroke="#AFC8E6" tickLine={false} axisLine={false} tickMargin={10}/>
                                <YAxis yAxisId="left" stroke="#1E90FF" tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(v) => `$${v/1000}k`}/>
                                <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" tickLine={false} axisLine={false} tickMargin={10}/>
                                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value, name) => name === 'Ventas (MXN)' ? [`$${value.toLocaleString()}`, 'Ventas'] : [value, 'Órdenes']} />
                                <Legend wrapperStyle={{ color: '#AFC8E6' }} />
                                <Line 
                                    yAxisId="left"
                                    type="monotone" 
                                    dataKey="sales" 
                                    stroke="#1E90FF" 
                                    strokeWidth={3}
                                    dot={{ fill: '#1E90FF', strokeWidth: 2, r: 4 }}
                                    name="Ventas (MXN)"
                                />
                                <Line 
                                    yAxisId="right"
                                    type="monotone" 
                                    dataKey="orders" 
                                    stroke="#3B82F6" 
                                    strokeWidth={3}
                                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                    name="Órdenes"
                                />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </motion.div>

                {/* Gráficas secundarias */}
                <motion.div
                    variants={fadeInUp}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                    >
                        <h3 className="text-sm font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4 text-[#1E90FF]" />
                            Fuentes de Tráfico
                        </h3>
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={trafficSources}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={{ stroke: '#AFC8E6', strokeWidth: 1 }}
                                >
                                    {trafficSources.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} stroke="#0B1E3A"/>
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={TOOLTIP_STYLE} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                            {trafficSources.map(source => (
                                <div key={source.name} className="flex items-center gap-1 text-xs">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }}></div>
                                    <span className="text-[#AFC8E6]">{source.name}</span>
                                    <span className="font-semibold text-[#EAF3FF]">{source.value}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                    >
                        <h3 className="text-sm font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#1E90FF]" />
                            Demografía por Edad
                        </h3>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={demographics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E90FF/20"/>
                                <XAxis dataKey="age" stroke="#AFC8E6" tickLine={false} axisLine={false}/>
                                <YAxis stroke="#AFC8E6" tickLine={false} axisLine={false}/>
                                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value}%`, 'Porcentaje']} />
                                <Bar 
                                    dataKey="percentage" 
                                    fill="#1E90FF" 
                                    radius={[8, 8, 0, 0]}
                                    label={{ position: 'top', fill: '#AFC8E6', fontSize: 12 }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Top Products & Alerts */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                <motion.div
                    variants={fadeInUp}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                >
                    <h3 className="text-sm font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        Top Productos Más Vendidos
                    </h3>
                    <div className="space-y-3">
                        {topProducts.map((product, index) => (
                            <motion.div
                                key={product.name}
                                whileHover={{ x: 4 }}
                                className={`flex items-center justify-between p-3 bg-[#0B1E3A]/60 rounded-xl border transition-all cursor-pointer ${
                                    selectedProduct === product.name ? 'border-[#1E90FF] bg-[#1E4D7A]/50' : 'border-[#1E90FF]/20 hover:bg-[#1E4D7A]/30'
                                }`}
                                onClick={() => setSelectedProduct(selectedProduct === product.name ? null : product.name)}
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 rounded-lg flex items-center justify-center text-sm font-bold text-[#1E90FF]">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#EAF3FF] text-sm">{product.name}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-xs text-[#AFC8E6]">{product.units} unidades</p>
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp className="w-3 h-3 text-amber-400" />
                                                <span className="text-xs text-[#AFC8E6]">{product.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#1E90FF] text-sm">${(product.revenue / 1000).toFixed(0)}K</p>
                                    <p className="text-xs text-emerald-400 font-medium">{product.growth}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 p-4 bg-gradient-to-r from-[#1E90FF]/20 to-[#3B82F6]/20 rounded-xl border border-[#1E90FF]/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-[#1E90FF]">Detalles de {selectedProduct}</p>
                                    <p className="text-xs text-[#AFC8E6] mt-1">Producto seleccionado para análisis</p>
                                </div>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4 text-[#AFC8E6]" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                >
                    <h3 className="text-sm font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        Alertas y Notificaciones
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {productAlerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ x: 4 }}
                                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${getAlertBg(alert.type)}`}
                            >
                                <div className="flex-shrink-0">
                                    {getAlertIcon(alert.type)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-[#EAF3FF] text-sm">{alert.product}</p>
                                    <p className="text-xs text-[#AFC8E6] mt-0.5">{alert.message}</p>
                                    <p className="text-xs text-[#AFC8E6]/70 mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {alert.date}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.section>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 border-t border-[#1E90FF]/20"
            >
                <p className="text-sm text-[#AFC8E6]">
                    NeumatiQ Analytics · Sistema de Gestión Integral para Neumáticos · © 2026
                </p>
            </motion.footer>
        </div>
    );
};

export default Analytics;