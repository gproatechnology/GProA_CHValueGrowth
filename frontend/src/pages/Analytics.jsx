import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Calendar, Download, TrendingUp, Users, ShoppingBag, Percent } from 'lucide-react';

/**
 * Analytics - Panel de Inteligencia de Negocio
 * @component
 */

const Analytics = () => {
    // --------------------------------------------------------------
    // 1. Estados y filtros
    // --------------------------------------------------------------
    const [dateRange, setDateRange] = useState('7d');
    const [customDate, setCustomDate] = useState({ start: '', end: '' });
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // --------------------------------------------------------------
    // 2. Datos mock (simulando API)
    // --------------------------------------------------------------
    const salesDataRaw = [
        { date: '2026-03-01', sales: 12400, orders: 42 },
        { date: '2026-03-02', sales: 13800, orders: 45 },
        { date: '2026-03-03', sales: 11200, orders: 38 },
        { date: '2026-03-04', sales: 15600, orders: 52 },
        { date: '2026-03-05', sales: 18900, orders: 61 },
        { date: '2026-03-06', sales: 14200, orders: 47 },
        { date: '2026-03-07', sales: 13500, orders: 44 },
        { date: '2026-03-08', sales: 14800, orders: 49 },
        { date: '2026-03-09', sales: 16700, orders: 55 },
        { date: '2026-03-10', sales: 17200, orders: 57 },
        { date: '2026-03-11', sales: 15400, orders: 51 },
        { date: '2026-03-12', sales: 18200, orders: 60 },
        { date: '2026-03-13', sales: 19100, orders: 63 },
        { date: '2026-03-14', sales: 17600, orders: 58 },
        { date: '2026-03-15', sales: 20100, orders: 67 },
        { date: '2026-03-16', sales: 19800, orders: 66 },
        { date: '2026-03-17', sales: 21300, orders: 71 },
        { date: '2026-03-18', sales: 22500, orders: 75 },
        { date: '2026-03-19', sales: 23400, orders: 78 },
        { date: '2026-03-20', sales: 24800, orders: 82 },
        { date: '2026-03-21', sales: 24100, orders: 80 },
        { date: '2026-03-22', sales: 25600, orders: 85 },
        { date: '2026-03-23', sales: 26300, orders: 87 },
        { date: '2026-03-24', sales: 27200, orders: 90 },
        { date: '2026-03-25', sales: 26800, orders: 89 },
        { date: '2026-03-26', sales: 28100, orders: 93 },
        { date: '2026-03-27', sales: 29400, orders: 98 },
    ];

    // Filtrar según dateRange o custom
    const filteredSales = useMemo(() => {
        if (showCustomPicker && customDate.start && customDate.end) {
            return salesDataRaw.filter(d => d.date >= customDate.start && d.date <= customDate.end);
        }
        const days = { '7d': 7, '30d': 30, '90d': 90 };
        const limit = days[dateRange];
        return salesDataRaw.slice(-limit);
    }, [dateRange, customDate, showCustomPicker]);

    // KPIs calculados
    const kpis = useMemo(() => {
        const totalSales = filteredSales.reduce((sum, d) => sum + d.sales, 0);
        const totalOrders = filteredSales.reduce((sum, d) => sum + d.orders, 0);
        const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;
        const conversionRate = 5.8; // mock
        return { totalSales, totalOrders, avgOrderValue, conversionRate };
    }, [filteredSales]);

    // Traffic Sources
    const trafficSources = [
        { name: 'Búsqueda Orgánica', value: 45, color: '#3b82f6' },
        { name: 'Directo', value: 25, color: '#10b981' },
        { name: 'Redes Sociales', value: 18, color: '#f59e0b' },
        { name: 'Referidos', value: 8, color: '#ef4444' },
        { name: 'Email Marketing', value: 4, color: '#8b5cf6' },
    ];

    // Demographics
    const demographics = [
        { age: '18-24', customers: 15 },
        { age: '25-34', customers: 42 },
        { age: '35-44', customers: 38 },
        { age: '45-54', customers: 28 },
        { age: '55+', customers: 12 },
    ];

    // Conversion Rate diaria
    const conversionData = [
        { date: '03/21', visits: 2450, conversions: 118, rate: 4.82 },
        { date: '03/22', visits: 2620, conversions: 135, rate: 5.15 },
        { date: '03/23', visits: 2780, conversions: 152, rate: 5.47 },
        { date: '03/24', visits: 3010, conversions: 170, rate: 5.65 },
        { date: '03/25', visits: 3250, conversions: 189, rate: 5.82 },
        { date: '03/26', visits: 3480, conversions: 210, rate: 6.03 },
        { date: '03/27', visits: 3720, conversions: 238, rate: 6.40 },
    ];

    // Top Products
    const topProducts = [
        { name: 'Michelin Primacy 4 205/55R16', units: 342, revenue: 718200 },
        { name: 'Bridgestone Turanza 195/65R15', units: 298, revenue: 551300 },
        { name: 'Continental PremiumContact 225/45R17', units: 267, revenue: 854400 },
        { name: 'Pirelli Cinturato 205/55R16', units: 234, revenue: 573300 },
        { name: 'Goodyear EfficientGrip 195/65R15', units: 201, revenue: 381900 },
    ];

    // Alertas
    const productAlerts = [
        { id: 1, type: 'new', product: 'Hankook Kinergy 4S 205/55R16', message: 'Nuevo producto agregado al inventario', date: '2026-03-27', price: null },
        { id: 2, type: 'price_change', product: 'Michelin Primacy 4 205/55R16', message: 'Precio actualizado: $2,450 → $2,380 MXN', date: '2026-03-26', price: 2380 },
        { id: 3, type: 'discontinued', product: 'Cooper Zeon RS3-G1 225/45R17', message: 'Producto discontinuado por proveedor', date: '2026-03-25', price: null },
        { id: 4, type: 'price_change', product: 'Bridgestone Turanza 195/65R15', message: 'Precio actualizado: $1,850 → $1,790 MXN', date: '2026-03-24', price: 1790 },
        { id: 5, type: 'new', product: 'Yokohama BluEarth 205/55R16', message: 'Nuevo producto disponible', date: '2026-03-23', price: 2290 },
    ];

    // Exportar CSV
    const exportAnalytics = useCallback(async () => {
        setExporting(true);
        await new Promise(r => setTimeout(r, 500));
        const csvRows = [
            ['Métrica', 'Valor'],
            ['Fecha exportación', new Date().toISOString()],
            ['Rango de fechas', showCustomPicker ? `${customDate.start} a ${customDate.end}` : dateRange],
            [],
            ['Ventas totales', kpis.totalSales],
            ['Órdenes totales', kpis.totalOrders],
            ['Valor promedio por orden', kpis.avgOrderValue.toFixed(2)],
            ['Tasa de conversión promedio', `${kpis.conversionRate}%`],
            [],
            ['Top Producto 1', topProducts[0].name],
            ['Unidades vendidas top1', topProducts[0].units],
        ];
        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `analytics_${new Date().toISOString().slice(0, 19)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setExporting(false);
    }, [kpis, topProducts, dateRange, showCustomPicker, customDate]);

    // Handlers
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setTimeout(() => setSelectedProduct(null), 2000);
    };

    // Animaciones
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="space-y-6">
            {/* Header con título y controles */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                    📊 Analytics e Inteligencia de Negocio
                </motion.h2>
                <div className="flex gap-3 items-center flex-wrap">
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => {
                                setDateRange(e.target.value);
                                setShowCustomPicker(false);
                            }}
                            className="neumorph-input py-2 text-sm w-32"
                        >
                            <option value="7d">Últimos 7 días</option>
                            <option value="30d">Últimos 30 días</option>
                            <option value="90d">Últimos 90 días</option>
                        </select>
                        <button
                            onClick={() => setShowCustomPicker(!showCustomPicker)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            <Calendar size={14} />
                        </button>
                    </div>
                    {showCustomPicker && (
                        <div className="flex gap-2">
                            <input type="date" value={customDate.start} onChange={(e) => setCustomDate({ ...customDate, start: e.target.value })} className="neumorph-input py-1 text-sm" />
                            <input type="date" value={customDate.end} onChange={(e) => setCustomDate({ ...customDate, end: e.target.value })} className="neumorph-input py-1 text-sm" />
                        </div>
                    )}
                    <button
                        onClick={exportAnalytics}
                        disabled={exporting}
                        className="neumorph-btn bg-blue-600 text-white px-4 py-2 text-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        <Download size={14} /> {exporting ? 'Exportando...' : 'Exportar CSV'}
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Ventas Totales', value: kpis.totalSales, prefix: '$', icon: TrendingUp, color: 'blue' },
                    { label: 'Órdenes', value: kpis.totalOrders, icon: ShoppingBag, color: 'green' },
                    { label: 'Valor Promedio por Orden', value: kpis.avgOrderValue, prefix: '$', decimals: 2, icon: TrendingUp, color: 'purple' },
                    { label: 'Tasa de Conversión', value: kpis.conversionRate, suffix: '%', icon: Percent, color: 'orange' },
                ].map((kpi, idx) => (
                    <motion.div
                        key={kpi.label}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="rounded-2xl p-4 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-gray-400 text-xs uppercase tracking-wider">{kpi.label}</p>
                            <kpi.icon size={20} className={`text-${kpi.color}-400`} />
                        </div>
                        <p className="text-2xl font-bold text-white mt-2">
                            {kpi.prefix}{kpi.value.toLocaleString(undefined, { minimumFractionDigits: kpi.decimals || 0, maximumFractionDigits: kpi.decimals || 0 })}{kpi.suffix}
                        </p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Sales Trend */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="neumorph-card p-4"
            >
                <h3 className="text-lg font-semibold text-white mb-4">📈 Sales Trend (Ventas diarias)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={filteredSales}>
                        <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d2f36" />
                        <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#9ca3af" tickFormatter={(v) => `$${v / 1000}k`} />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1b1e', border: 'none', borderRadius: '0.5rem' }} formatter={(v) => `$${v.toLocaleString()}`} />
                        <Legend />
                        <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="url(#salesGradient)" name="Ventas (MXN)" />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Traffic Sources + Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="neumorph-card p-4"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">🌐 Traffic Sources</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={trafficSources}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                fill="#8884d8"
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {trafficSources.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v) => `${v}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="neumorph-card p-4"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">👥 Customer Demographics (Edad)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={demographics}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2d2f36" />
                            <XAxis dataKey="age" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1a1b1e', border: 'none' }} />
                            <Bar dataKey="customers" fill="#10b981" radius={[4, 4, 0, 0]} name="Clientes" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Conversion Rate */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="neumorph-card p-4"
            >
                <h3 className="text-lg font-semibold text-white mb-4">🎯 Conversion Rate (Visitas → Compras)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={conversionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d2f36" />
                        <XAxis dataKey="date" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" unit="%" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1b1e', border: 'none' }} formatter={(v) => `${v}%`} />
                        <Legend />
                        <Line type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Tasa de conversión" />
                        <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeDasharray="5 5" data={conversionData.map(d => ({ ...d, rate: 5.5 }))} name="Meta (5.5%)" />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Top Products + Alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="neumorph-card p-4 overflow-x-auto"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">🏆 Top 5 Productos más Vendidos</h3>
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-700">
                            <tr>
                                <th className="text-left py-2 text-gray-400">Producto</th>
                                <th className="text-right py-2 text-gray-400">Unidades</th>
                                <th className="text-right py-2 text-gray-400">Ingresos (MXN)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((p, idx) => (
                                <motion.tr
                                    key={idx}
                                    whileHover={{ backgroundColor: 'rgba(59,130,246,0.1)' }}
                                    className="border-b border-gray-800 cursor-pointer transition-colors"
                                    onClick={() => handleProductClick(p)}
                                >
                                    <td className="py-2 text-white">{p.name}</td>
                                    <td className="py-2 text-right">{p.units.toLocaleString()}</td>
                                    <td className="py-2 text-right font-mono">${p.revenue.toLocaleString()}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    <AnimatePresence>
                        {selectedProduct && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-3 p-2 bg-blue-600/20 rounded-lg text-center text-xs text-blue-300"
                            >
                                Producto seleccionado: {selectedProduct.name}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="neumorph-card p-4"
                >
                    <h3 className="text-lg font-semibold text-white mb-4">🔔 Alertas de Producto</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                        {productAlerts.map(alert => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.02 }}
                                className="neumorph-inset rounded-xl p-3 cursor-pointer transition-all"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="text-xl">
                                        {alert.type === 'new' && '🆕'}
                                        {alert.type === 'price_change' && '💰'}
                                        {alert.type === 'discontinued' && '🚫'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{alert.product}</p>
                                        <p className="text-xs text-gray-400">{alert.message}</p>
                                        <p className="text-[10px] text-gray-500 mt-1">{alert.date}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;