import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, AlertTriangle, TrendingUp,
    Wifi, HardDrive, Server, Cpu, Database,
    Zap, Clock, CheckCircle, AlertCircle, RefreshCw, Download,
    Thermometer, Shield, Radio, Signal, BarChart3, LineChart,
    PieChart, Eye, Maximize2, Minimize2, Settings, Bell,
    Calendar as CalendarIcon, Filter, X
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
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

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

const statusStyles = {
    emerald: {
        badge: 'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        iconBg: 'p-2 bg-emerald-500/20 rounded-xl',
        icon: 'text-emerald-400',
        bar: 'h-full rounded-full bg-emerald-500'
    },
    amber: {
        badge: 'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30',
        iconBg: 'p-2 bg-amber-500/20 rounded-xl',
        icon: 'text-amber-400',
        bar: 'h-full rounded-full bg-amber-500'
    },
    red: {
        badge: 'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30',
        iconBg: 'p-2 bg-red-500/20 rounded-xl',
        icon: 'text-red-400',
        bar: 'h-full rounded-full bg-red-500'
    },
    sky: {
        badge: 'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-[#1E90FF]/20 text-[#1E90FF] border border-[#1E90FF]/30',
        iconBg: 'p-2 bg-[#1E90FF]/20 rounded-xl',
        icon: 'text-[#1E90FF]',
        bar: 'h-full rounded-full bg-[#1E90FF]'
    },
    purple: {
        badge: 'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30',
        iconBg: 'p-2 bg-purple-500/20 rounded-xl',
        icon: 'text-purple-400',
        bar: 'h-full rounded-full bg-purple-500'
    },
    indigo: {
        badge: 'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
        iconBg: 'p-2 bg-indigo-500/20 rounded-xl',
        icon: 'text-indigo-400',
        bar: 'h-full rounded-full bg-indigo-500'
    },
    orange: {
        badge: 'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30',
        iconBg: 'p-2 bg-orange-500/20 rounded-xl',
        icon: 'text-orange-400',
        bar: 'h-full rounded-full bg-orange-500'
    }
};

// Modal de configuración de alertas
const AlertConfigModal = ({ isOpen, onClose, thresholds, onUpdate }) => {
    const [localThresholds, setLocalThresholds] = useState(thresholds);
    
    if (!isOpen) return null;
    
    const handleSave = () => {
        onUpdate(localThresholds);
        onClose();
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
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-md w-full p-6 border border-[#1E90FF]/30 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#EAF3FF] flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[#1E90FF]" />
                        Configurar Alertas
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors">
                        <X className="w-5 h-5 text-[#AFC8E6]" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Alerta de CPU (%)</label>
                        <input
                            type="number"
                            value={localThresholds.cpu}
                            onChange={(e) => setLocalThresholds(prev => ({ ...prev, cpu: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Alerta de Memoria (%)</label>
                        <input
                            type="number"
                            value={localThresholds.memory}
                            onChange={(e) => setLocalThresholds(prev => ({ ...prev, memory: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Alerta de Temperatura (°C)</label>
                        <input
                            type="number"
                            value={localThresholds.temperature}
                            onChange={(e) => setLocalThresholds(prev => ({ ...prev, temperature: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Alerta de Tasa de Error (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={localThresholds.errorRate}
                            onChange={(e) => setLocalThresholds(prev => ({ ...prev, errorRate: parseFloat(e.target.value) }))}
                            className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF]"
                        />
                    </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                    <button onClick={handleSave} className="flex-1 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-medium">
                        Guardar Cambios
                    </button>
                    <button onClick={onClose} className="flex-1 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#AFC8E6] border border-[#1E90FF]/30">
                        Cancelar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Modal de exportación de datos
const ExportModal = ({ isOpen, onClose, metrics, historicalData, onExport }) => {
    if (!isOpen) return null;
    
    const handleExport = (format) => {
        if (format === 'json') {
            const exportData = {
                metrics,
                historicalData,
                timestamp: new Date().toISOString()
            };
            const dataStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `telemetry_${new Date().toISOString().slice(0, 19)}.json`;
            link.click();
            URL.revokeObjectURL(url);
        } else if (format === 'csv') {
            const csvData = historicalData.map(d => `${d.time},${d.responseTime},${d.requests}`).join('\n');
            const blob = new Blob([`Time,ResponseTime,Requests\n${csvData}`], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `telemetry_${new Date().toISOString().slice(0, 19)}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        }
        onExport(format);
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
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-sm w-full p-6 border border-[#1E90FF]/30 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#EAF3FF] flex items-center gap-2">
                        <Download className="w-5 h-5 text-[#1E90FF]" />
                        Exportar Datos
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors">
                        <X className="w-5 h-5 text-[#AFC8E6]" />
                    </button>
                </div>
                
                <div className="space-y-3">
                    <button onClick={() => handleExport('json')} className="w-full py-2 bg-[#0B1E3A]/80 rounded-lg text-[#EAF3FF] border border-[#1E90FF]/30 hover:bg-[#1E4D7A] transition-all flex items-center justify-center gap-2">
                        📄 Exportar como JSON
                    </button>
                    <button onClick={() => handleExport('csv')} className="w-full py-2 bg-[#0B1E3A]/80 rounded-lg text-[#EAF3FF] border border-[#1E90FF]/30 hover:bg-[#1E4D7A] transition-all flex items-center justify-center gap-2">
                        📊 Exportar como CSV
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Gráfico de radar para rendimiento del sistema - CORREGIDO
const PerformanceRadarChart = ({ metrics }) => {
    // Fallback data if metrics is undefined
    const safeMetrics = metrics || {
        cpu: 0,
        memory: 0,
        disk: 0,
        bandwidth: 0,
        avgResponseTime: 0,
        errorRate: 0
    };

    // Calcular valores seguros (0-100)
    const cpuScore = Math.min(100, Math.max(0, 100 - (safeMetrics.cpu || 0)));
    const memoryScore = Math.min(100, Math.max(0, 100 - (safeMetrics.memory || 0)));
    const diskScore = Math.min(100, Math.max(0, 100 - (safeMetrics.disk || 0)));
    const networkScore = Math.min(100, Math.max(0, ((safeMetrics.bandwidth || 0) / 1000) * 100));
    const responseScore = Math.min(100, Math.max(0, 100 - ((safeMetrics.avgResponseTime || 0) / 5)));
    const stabilityScore = Math.min(100, Math.max(0, 100 - ((safeMetrics.errorRate || 0) * 10)));

    const data = {
        labels: ['CPU', 'Memoria', 'Disco', 'Red', 'Respuesta', 'Estabilidad'],
        datasets: [{
            label: 'Rendimiento Actual',
            data: [cpuScore, memoryScore, diskScore, networkScore, responseScore, stabilityScore],
            backgroundColor: 'rgba(30, 144, 255, 0.2)',
            borderColor: '#1E90FF',
            borderWidth: 2,
            pointBackgroundColor: '#1E90FF',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#1E90FF'
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: { 
                    color: '#AFC8E6', 
                    stepSize: 20,
                    backdropColor: 'transparent'
                },
                grid: { color: 'rgba(30, 144, 255, 0.2)' },
                pointLabels: { color: '#AFC8E6', font: { size: 10 } }
            }
        },
        plugins: {
            legend: { 
                position: 'top',
                labels: { color: '#AFC8E6', font: { size: 10 } } 
            },
            tooltip: { 
                backgroundColor: '#0B1E3A', 
                titleColor: '#EAF3FF', 
                bodyColor: '#AFC8E6', 
                borderColor: '#1E90FF', 
                borderWidth: 1,
                callbacks: {
                    label: (context) => {
                        return `${context.label}: ${context.raw.toFixed(1)}%`;
                    }
                }
            }
        }
    };

    if (!data || !data.labels || !data.datasets) {
        return <div className="h-64 bg-[#0B1E3A]/60 rounded-lg animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#1E90FF]/30 border-t-[#1E90FF] rounded-full animate-spin"></div>
        </div>;
    }

    return (
        <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg border border-[#1E90FF]/20">
            <h3 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1E90FF]" />
                Rendimiento del Sistema (Radar)
            </h3>
            <div className="h-64">
                <Radar data={data} options={options} />
            </div>
        </div>
    );
};

// Componente de notificaciones
const NotificationToast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);
    
    const bgColor = type === 'warning' ? 'from-amber-500/90 to-orange-500/90' : 'from-emerald-500/90 to-teal-500/90';
    const icon = type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />;
    
    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`fixed bottom-4 right-4 bg-gradient-to-r ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 max-w-sm`}
        >
            {icon}
            <span className="text-sm">{message}</span>
            <button onClick={onClose} className="ml-auto">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

const Telemetry = () => {
    const [metrics, setMetrics] = useState({
        cpu: 23.4,
        memory: 67.2,
        disk: 45.8,
        uptime: 99.97,
        requestsPerMin: 124,
        avgResponseTime: 89,
        errorRate: 0.2,
        temperature: 52,
        networkLatency: 23,
        bandwidth: 845,
        activeConnections: 1247
    });
    
    const [loading, setLoading] = useState(true);
    const [selectedTimeRange, setSelectedTimeRange] = useState('5m');
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [alertThresholds, setAlertThresholds] = useState({
        cpu: 80,
        memory: 85,
        temperature: 75,
        errorRate: 2
    });
    const [expandedChart, setExpandedChart] = useState(null);
    
    const intervalRef = useRef(null);
    const prevMetricsRef = useRef(metrics);
    
    // Verificar alertas
    useEffect(() => {
        const alerts = [];
        if (metrics.cpu > alertThresholds.cpu && prevMetricsRef.current.cpu <= alertThresholds.cpu) {
            alerts.push({ message: `⚠️ Alerta: CPU al ${metrics.cpu}%`, type: 'warning' });
        }
        if (metrics.memory > alertThresholds.memory && prevMetricsRef.current.memory <= alertThresholds.memory) {
            alerts.push({ message: `⚠️ Alerta: Memoria al ${metrics.memory}%`, type: 'warning' });
        }
        if (metrics.temperature > alertThresholds.temperature && prevMetricsRef.current.temperature <= alertThresholds.temperature) {
            alerts.push({ message: `⚠️ Alerta: Temperatura a ${metrics.temperature}°C`, type: 'warning' });
        }
        if (metrics.errorRate > alertThresholds.errorRate && prevMetricsRef.current.errorRate <= alertThresholds.errorRate) {
            alerts.push({ message: `⚠️ Alerta: Tasa de error al ${metrics.errorRate}%`, type: 'warning' });
        }
        
        if (alerts.length > 0) {
            setNotifications(prev => [...alerts, ...prev].slice(0, 5));
        }
        
        prevMetricsRef.current = metrics;
    }, [metrics, alertThresholds]);
    
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        if (autoRefresh) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            
            intervalRef.current = setInterval(() => {
                setMetrics(prev => ({
                    ...prev,
                    cpu: Math.max(0, Math.min(100, +(prev.cpu + (Math.random() - 0.5) * 3).toFixed(1))),
                    memory: Math.max(0, Math.min(100, +(prev.memory + (Math.random() - 0.5) * 2).toFixed(1))),
                    disk: Math.max(0, Math.min(100, +(prev.disk + (Math.random() - 0.5) * 1).toFixed(1))),
                    requestsPerMin: Math.max(0, Math.min(500, Math.round(prev.requestsPerMin + (Math.random() - 0.5) * 10))),
                    avgResponseTime: Math.max(10, Math.min(500, Math.round(prev.avgResponseTime + (Math.random() - 0.5) * 5))),
                    errorRate: Math.max(0, Math.min(5, +(prev.errorRate + (Math.random() - 0.5) * 0.1).toFixed(2))),
                    temperature: Math.max(20, Math.min(90, +(prev.temperature + (Math.random() - 0.5) * 1).toFixed(1))),
                    networkLatency: Math.max(5, Math.min(150, Math.round(prev.networkLatency + (Math.random() - 0.5) * 2))),
                    bandwidth: Math.max(100, Math.min(1000, Math.round(prev.bandwidth + (Math.random() - 0.5) * 15))),
                    activeConnections: Math.max(500, Math.min(2000, Math.round(prev.activeConnections + (Math.random() - 0.5) * 25))),
                    uptime: prev.uptime
                }));
                setLastUpdate(new Date());
            }, 5000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [autoRefresh]);
    
    const getStatusColor = useCallback((value, goodRange, warningRange) => {
        const numValue = typeof value === 'number' ? value : parseFloat(value);
        if (numValue <= goodRange) return 'emerald';
        if (numValue <= warningRange) return 'amber';
        return 'red';
    }, []);
    
    const getStatusIcon = useCallback((value, goodRange, warningRange) => {
        const numValue = typeof value === 'number' ? value : parseFloat(value);
        if (numValue <= goodRange) return CheckCircle;
        if (numValue <= warningRange) return AlertCircle;
        return AlertTriangle;
    }, []);
    
    const getStatusText = useCallback((value, goodRange, warningRange) => {
        const numValue = typeof value === 'number' ? value : parseFloat(value);
        if (numValue <= goodRange) return 'Óptimo';
        if (numValue <= warningRange) return 'Atención';
        return 'Crítico';
    }, []);
    
    const historicalData = useMemo(() => {
        const data = [];
        const baseResponseTime = metrics.avgResponseTime;
        const baseRequests = metrics.requestsPerMin;
        
        for (let i = 10; i >= 0; i--) {
            const variation = Math.sin(i * 0.5) * 0.15;
            data.push({
                time: `${i}m`,
                responseTime: Math.max(20, Math.min(300, Math.round(baseResponseTime * (1 + variation * (Math.random() - 0.5))))),
                requests: Math.max(30, Math.min(450, Math.round(baseRequests * (1 + variation * (Math.random() - 0.5)))))
            });
        }
        return data;
    }, [metrics.avgResponseTime, metrics.requestsPerMin]);
    
    const chartStats = useMemo(() => {
        const responseTimes = historicalData.map(d => d.responseTime);
        const requests = historicalData.map(d => d.requests);
        return {
            minResponseTime: Math.min(...responseTimes),
            maxResponseTime: Math.max(...responseTimes),
            minRequests: Math.min(...requests),
            maxRequests: Math.max(...requests)
        };
    }, [historicalData]);
    
    const getBarHeight = useCallback((value, minValue, maxValue, maxHeight = 100) => {
        if (maxValue === minValue) return 50;
        const percentage = (value - minValue) / (maxValue - minValue);
        return Math.max(5, Math.min(maxHeight, percentage * maxHeight));
    }, []);
    
    const exportData = (format) => {
        console.log(`Exportando datos en formato ${format}`);
    };
    
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    
    const formattedUptime = `${metrics.uptime.toFixed(2)}%`;
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-[#1E90FF]/30 border-t-[#1E90FF] rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p className="text-[#AFC8E6] text-sm font-medium mt-4">Cargando métricas de telemetría...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">
                        Telemetría en Tiempo Real
                    </h1>
                    <p className="text-[#AFC8E6] mt-1 flex items-center gap-2">
                        <Activity size={14} className="text-[#1E90FF]" />
                        Monitoreo del sistema y métricas de performance
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {/* Time Range Selector */}
                    <div className="flex gap-1 bg-[#102A4C]/80 backdrop-blur-sm rounded-xl p-1 shadow-inner border border-[#1E90FF]/30">
                        {['1m', '5m', '15m', '1h', '24h'].map(range => (
                            <button
                                key={range}
                                onClick={() => setSelectedTimeRange(range)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    selectedTimeRange === range
                                        ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md'
                                        : 'text-[#AFC8E6] hover:text-[#EAF3FF] hover:bg-[#1E4D7A]'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    
                    {/* Auto Refresh Toggle */}
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            autoRefresh
                                ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md'
                                : 'bg-[#102A4C]/80 backdrop-blur-sm border border-[#1E90FF]/30 text-[#AFC8E6] hover:bg-[#1E4D7A]'
                        }`}
                    >
                        <RefreshCw size={14} className={autoRefresh ? 'animate-spin-slow' : ''} />
                        Auto-refresh
                    </button>
                    
                    {/* Alert Config Button */}
                    <button
                        onClick={() => setShowAlertModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm bg-[#102A4C]/80 backdrop-blur-sm border border-[#1E90FF]/30 text-[#AFC8E6] hover:bg-[#1E4D7A] transition-all"
                    >
                        <Bell size={14} />
                        Alertas
                    </button>
                    
                    {/* Export Button */}
                    <button
                        onClick={() => setShowExportModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm bg-[#102A4C]/80 backdrop-blur-sm border border-[#1E90FF]/30 text-[#AFC8E6] hover:bg-[#1E4D7A] transition-all"
                    >
                        <Download size={14} />
                        Exportar
                    </button>
                    
                    {/* Status Indicator */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#102A4C]/80 backdrop-blur-sm rounded-xl border border-[#1E90FF]/30">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-[#AFC8E6]">Sistema Online</span>
                    </div>
                </div>
            </div>
            
            {/* Last Update Info */}
            <div className="text-right">
                <p className="text-xs text-[#AFC8E6]/70">
                    Última actualización: {lastUpdate.toLocaleTimeString()}
                    {autoRefresh && ' (Actualización automática activa)'}
                </p>
            </div>
            
            {/* Main KPIs */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            >
                {[
                    { icon: Cpu, label: 'CPU', value: metrics.cpu, unit: '%', goodRange: 70, warningRange: 85 },
                    { icon: Database, label: 'Memoria RAM', value: metrics.memory, unit: '%', goodRange: 75, warningRange: 90 },
                    { icon: HardDrive, label: 'Disco', value: metrics.disk, unit: '%', goodRange: 80, warningRange: 92 },
                    { icon: Thermometer, label: 'Temperatura', value: metrics.temperature, unit: '°C', goodRange: 65, warningRange: 80 }
                ].map((metric, index) => {
                    const statusColor = getStatusColor(metric.value, metric.goodRange, metric.warningRange);
                    const StatusIcon = getStatusIcon(metric.value, metric.goodRange, metric.warningRange);
                    const statusText = getStatusText(metric.value, metric.goodRange, metric.warningRange);
                    const statusStyle = statusStyles[statusColor] || statusStyles.emerald;
                    
                    return (
                        <motion.div
                            key={metric.label}
                            variants={fadeInUp}
                            whileHover={{ y: -4 }}
                            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20 cursor-pointer"
                            onClick={() => setExpandedChart(expandedChart === metric.label ? null : metric.label)}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={statusStyle.iconBg}>
                                    <metric.icon className={`w-5 h-5 ${statusStyle.icon}`} />
                                </div>
                                <div className={statusStyle.badge}>
                                    <StatusIcon size={10} />
                                    {statusText}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-[#AFC8E6] uppercase tracking-wide font-medium">{metric.label}</p>
                                <p className="text-2xl font-bold text-[#EAF3FF]">
                                    {metric.value}
                                    <span className="text-sm font-normal text-[#AFC8E6]">{metric.unit}</span>
                                </p>
                            </div>
                            <div className="mt-3">
                                <div className="w-full bg-[#0B1E3A]/60 rounded-full h-1.5 overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, Math.max(0, metric.value))}%` }}
                                        className={statusStyle.bar}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
            
            {/* Performance Metrics */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
                {[
                    { icon: Zap, label: 'Requests por Minuto', value: metrics.requestsPerMin, unit: 'rpm', color: 'sky', trend: '+12%' },
                    { icon: Clock, label: 'Tiempo de Respuesta', value: metrics.avgResponseTime, unit: 'ms', color: 'emerald', trend: '-8%' },
                    { icon: AlertTriangle, label: 'Tasa de Error', value: metrics.errorRate, unit: '%', color: 'orange', trend: '-0.05%' }
                ].map((metric, index) => {
                    const metricStyle = statusStyles[metric.color] || statusStyles.sky;
                    const trendColor = (metric.label === 'Tasa de Error' && metric.trend.startsWith('-')) || 
                                      (metric.label === 'Tiempo de Respuesta' && metric.trend.startsWith('-')) ||
                                      (metric.label === 'Requests por Minuto' && metric.trend.startsWith('+'))
                                        ? 'text-emerald-400' : 'text-red-400';
                    
                    return (
                        <motion.div
                            key={metric.label}
                            variants={fadeInUp}
                            whileHover={{ y: -4 }}
                            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={metricStyle.iconBg}>
                                    <metric.icon className={`w-5 h-5 ${metricStyle.icon}`} />
                                </div>
                                <p className="text-xs text-[#AFC8E6] uppercase tracking-wide font-medium">{metric.label}</p>
                            </div>
                            <p className="text-3xl font-bold text-[#EAF3FF]">
                                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                                <span className="text-base font-normal text-[#AFC8E6] ml-1">{metric.unit}</span>
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <TrendingUp size={12} className={trendColor} />
                                <span className={`text-xs ${trendColor}`}>
                                    {metric.trend} vs período anterior
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Response Time Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#1E90FF] rounded-full animate-pulse"></div>
                            <h3 className="font-bold text-[#EAF3FF] text-sm">Tiempo de Respuesta (ms)</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-[#1E90FF]">{metrics.avgResponseTime}ms promedio</span>
                            <button 
                                onClick={() => setExpandedChart(expandedChart === 'response' ? null : 'response')}
                                className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors"
                            >
                                <Maximize2 size={12} className="text-[#AFC8E6]" />
                            </button>
                        </div>
                    </div>
                    <div className={`${expandedChart === 'response' ? 'h-96' : 'h-64'} bg-[#0B1E3A]/60 rounded-lg p-3 relative overflow-hidden transition-all duration-300`}>
                        <div className="h-full flex items-end gap-1.5">
                            {historicalData.map((data, i) => {
                                const height = getBarHeight(data.responseTime, chartStats.minResponseTime, chartStats.maxResponseTime, 90);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                        <div 
                                            className="w-full bg-gradient-to-t from-[#1E90FF] to-[#3B82F6] rounded transition-all duration-300 hover:opacity-80 cursor-pointer"
                                            style={{ height: `${height}%` }}
                                        />
                                        <span className="text-[7px] text-[#AFC8E6] rotate-45 origin-left group-hover:text-[#1E90FF] transition-colors">
                                            {data.time}
                                        </span>
                                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B1E3A] text-[#EAF3FF] text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap border border-[#1E90FF]/30">
                                            {data.responseTime}ms
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-[10px] text-[#AFC8E6]">
                        <span>Mín: {chartStats.minResponseTime}ms</span>
                        <span>Máx: {chartStats.maxResponseTime}ms</span>
                        <span className="text-emerald-400">✓ SLA: 98.5%</span>
                    </div>
                </motion.div>
                
                {/* Request Rate Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <h3 className="font-bold text-[#EAF3FF] text-sm">Peticiones por Minuto</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-emerald-400">{metrics.requestsPerMin} rpm</span>
                            <button 
                                onClick={() => setExpandedChart(expandedChart === 'requests' ? null : 'requests')}
                                className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors"
                            >
                                <Maximize2 size={12} className="text-[#AFC8E6]" />
                            </button>
                        </div>
                    </div>
                    <div className={`${expandedChart === 'requests' ? 'h-96' : 'h-64'} bg-[#0B1E3A]/60 rounded-lg p-3 relative overflow-hidden transition-all duration-300`}>
                        <div className="h-full flex items-end gap-1.5">
                            {historicalData.map((data, i) => {
                                const height = getBarHeight(data.requests, chartStats.minRequests, chartStats.maxRequests, 90);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                        <div 
                                            className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded transition-all duration-300 hover:opacity-80 cursor-pointer"
                                            style={{ height: `${height}%` }}
                                        />
                                        <span className="text-[7px] text-[#AFC8E6] rotate-45 origin-left group-hover:text-emerald-400 transition-colors">
                                            {data.time}
                                        </span>
                                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B1E3A] text-[#EAF3FF] text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap border border-emerald-500/30">
                                            {data.requests} rpm
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-[10px] text-[#AFC8E6]">
                        <span>Mín: {chartStats.minRequests} rpm</span>
                        <span>Máx: {chartStats.maxRequests} rpm</span>
                        <span className="text-emerald-400">↑ 8% vs ayer</span>
                    </div>
                </motion.div>
            </div>
            
            {/* Additional Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {metrics && (
                  <PerformanceRadarChart metrics={metrics} />
                )}
                
                {/* Health Score Gauge */}
                <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg border border-[#1E90FF]/20">
                    <h3 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#1E90FF]" />
                        Health Score del Sistema
                    </h3>
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" fill="none" stroke="#0B1E3A" strokeWidth="12" />
                                <circle 
                                    cx="80" cy="80" r="70" fill="none" 
                                    stroke="url(#healthGradient)" strokeWidth="12"
                                    strokeDasharray={`${Math.min(440, Math.max(0, (100 - metrics.errorRate * 2) * 4.4))} 440`}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#EF4444" />
                                        <stop offset="50%" stopColor="#F59E0B" />
                                        <stop offset="100%" stopColor="#10B981" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-[#EAF3FF]">{Math.min(100, Math.max(0, 100 - metrics.errorRate * 2)).toFixed(0)}</span>
                                <span className="text-xs text-[#AFC8E6]">/100</span>
                            </div>
                        </div>
                        <p className="text-sm text-[#AFC8E6] mt-4 text-center">
                            Basado en rendimiento, estabilidad y errores
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Network & System Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            >
                {[
                    { icon: Wifi, label: 'Latencia de Red', value: metrics.networkLatency, unit: 'ms', status: metrics.networkLatency < 50 ? 'good' : metrics.networkLatency < 100 ? 'warning' : 'critical', color: 'sky' },
                    { icon: Signal, label: 'Ancho de Banda', value: metrics.bandwidth, unit: 'Mbps', status: metrics.bandwidth > 500 ? 'good' : metrics.bandwidth > 200 ? 'warning' : 'critical', color: 'emerald' },
                    { icon: Radio, label: 'Conexiones Activas', value: metrics.activeConnections, unit: '', status: metrics.activeConnections < 1500 ? 'good' : metrics.activeConnections < 1800 ? 'warning' : 'critical', color: 'purple' },
                    { icon: Shield, label: 'Seguridad', value: 'Protegido', unit: '', status: 'good', color: 'indigo' }
                ].map((metric, index) => {
                    const metricStyle = statusStyles[metric.color] || statusStyles.sky;
                    const getStatusDisplay = () => {
                        if (metric.status === 'good') return { text: 'Operación normal', icon: CheckCircle, color: 'emerald' };
                        if (metric.status === 'warning') return { text: 'Atención', icon: AlertCircle, color: 'amber' };
                        return { text: 'Crítico', icon: AlertTriangle, color: 'red' };
                    };
                    const statusDisplay = getStatusDisplay();
                    const StatusDisplayIcon = statusDisplay.icon;
                    
                    return (
                        <motion.div
                            key={metric.label}
                            variants={fadeInUp}
                            whileHover={{ y: -4 }}
                            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={metricStyle.iconBg}>
                                    <metric.icon className={`w-5 h-5 ${metricStyle.icon}`} />
                                </div>
                                <p className="text-xs text-[#AFC8E6] uppercase tracking-wide font-medium">{metric.label}</p>
                            </div>
                            <p className="text-2xl font-bold text-[#EAF3FF]">
                                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                                <span className="text-sm font-normal text-[#AFC8E6] ml-1">{metric.unit}</span>
                            </p>
                            <div className={`flex items-center gap-1 mt-2 text-xs text-${statusDisplay.color}-400`}>
                                <StatusDisplayIcon size={10} />
                                <span>{statusDisplay.text}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
            
            {/* System Info & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Information */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Server className="w-4 h-4 text-[#1E90FF]" />
                        <h3 className="font-bold text-[#EAF3FF] text-sm">Información del Sistema</h3>
                    </div>
                    <div className="space-y-2">
                        {[
                            { label: 'Versión del Sistema', value: 'v2.0.0', icon: Activity },
                            { label: 'Entorno', value: 'Producción', icon: Server },
                            { label: 'Uptime', value: formattedUptime, icon: Clock },
                            { label: 'Último Deploy', value: '2026-04-01 10:30:00', icon: CalendarIcon },
                            { label: 'Base de Datos', value: 'PostgreSQL 15', icon: Database },
                            { label: 'Cache', value: 'Redis 7.0', icon: Zap }
                        ].map(info => (
                            <div key={info.label} className="flex items-center justify-between py-1.5 border-b border-[#1E90FF]/20 last:border-0">
                                <div className="flex items-center gap-2">
                                    <info.icon size={10} className="text-[#AFC8E6]" />
                                    <span className="text-xs text-[#AFC8E6]">{info.label}</span>
                                </div>
                                <span className="text-xs font-semibold text-[#EAF3FF]">{info.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
                
                {/* Logs Stream */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                        <h3 className="font-bold text-[#EAF3FF] text-sm">Stream de Logs en Tiempo Real</h3>
                        <button className="ml-auto text-[10px] text-[#1E90FF] hover:text-[#3B82F6]">
                            <Download size={12} />
                        </button>
                    </div>
                    <div className="font-mono text-[10px] bg-[#0B1E3A]/60 rounded-lg p-3 h-44 overflow-y-auto space-y-1">
                        <div className="flex items-start gap-2">
                            <span className="text-emerald-400 flex-shrink-0">[INFO]</span>
                            <span className="text-[#AFC8E6]">Sistema operativo: Windows 11 Pro | Node.js v20.12.2</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-[#1E90FF] flex-shrink-0">[API]</span>
                            <span className="text-[#AFC8E6]">GET /api/telemetry - 200 OK ({metrics.avgResponseTime}ms)</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-emerald-400 flex-shrink-0">[INFO]</span>
                            <span className="text-[#AFC8E6]">Frontend: http://localhost:5173 | Modo: Producción</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className={`flex-shrink-0 ${metrics.cpu > 80 ? 'text-red-400' : 'text-amber-400'}`}>
                                {metrics.cpu > 80 ? '[CRIT]' : metrics.cpu > 70 ? '[WARN]' : '[INFO]'}
                            </span>
                            <span className="text-[#AFC8E6]">Uso de CPU: {metrics.cpu}% {metrics.cpu > 80 ? '- Alta demanda detectada' : metrics.cpu > 70 ? '- Demanda moderada' : '- Normal'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-emerald-400 flex-shrink-0">[INFO]</span>
                            <span className="text-[#AFC8E6]">Telemetría activa ✓ | Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-[#1E90FF] flex-shrink-0">[DB]</span>
                            <span className="text-[#AFC8E6]">Conexión a base de datos estable (pool: {Math.floor(metrics.activeConnections / 100)} conexiones)</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="text-purple-400 flex-shrink-0">[CACHE]</span>
                            <span className="text-[#AFC8E6]">Redis cache hit rate: {(87.3 + Math.sin(Date.now() / 10000) * 2).toFixed(1)}% | {Math.floor(metrics.requestsPerMin / 2)} ops/seg</span>
                        </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[9px] text-[#AFC8E6]">
                        <span>📡 {Math.floor(Math.random() * 20) + 5} eventos nuevos</span>
                        <button className="text-[#1E90FF] hover:text-[#3B82F6]">Ver todos</button>
                    </div>
                </motion.div>
            </div>
            
            {/* Alert Banner - Dinámico */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`rounded-xl p-4 border transition-all cursor-pointer ${
                    metrics.cpu > 80 || metrics.memory > 85 || metrics.errorRate > 2
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30'
                        : 'bg-gradient-to-r from-[#1E90FF]/20 to-[#3B82F6]/20 border-[#1E90FF]/30'
                }`}
                onClick={() => setShowAlertModal(true)}
            >
                <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg ${
                        metrics.cpu > 80 || metrics.memory > 85 || metrics.errorRate > 2
                            ? 'bg-amber-500/20'
                            : 'bg-[#1E90FF]/20'
                    }`}>
                        <Shield className={`w-4 h-4 ${
                            metrics.cpu > 80 || metrics.memory > 85 || metrics.errorRate > 2
                                ? 'text-amber-400'
                                : 'text-[#1E90FF]'
                        }`} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-[#EAF3FF] text-sm mb-0.5">
                            {metrics.cpu > 80 || metrics.memory > 85 || metrics.errorRate > 2
                                ? '⚠️ Atención - Sistema con alta carga'
                                : '✅ Sistema Monitoreado'}
                        </h4>
                        <p className="text-xs text-[#AFC8E6]">
                            {metrics.cpu > 80 || metrics.memory > 85 || metrics.errorRate > 2
                                ? `Se detectó ${metrics.cpu > 80 ? 'alta utilización de CPU' : metrics.memory > 85 ? 'alta utilización de memoria' : 'tasa de error elevada'}. Revisar logs.`
                                : 'Todos los sistemas operan dentro de parámetros normales. Métricas actualizadas cada 5 segundos.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                            metrics.cpu > 80 || metrics.memory > 85 || metrics.errorRate > 2
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                        }`}></div>
                        <span className={`text-[10px] font-medium ${
                            metrics.cpu > 80 || metrics.memory > 85 || metrics.errorRate > 2
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                        }`}>
                            {metrics.cpu > 80 || metrics.memory > 85 || metrics.errorRate > 2
                                ? 'Rendimiento Degradado'
                                : '100% Operativo'}
                        </span>
                    </div>
                </div>
            </motion.div>
            
            {/* Modales */}
            <AnimatePresence>
                {showAlertModal && (
                    <AlertConfigModal 
                        isOpen={showAlertModal} 
                        onClose={() => setShowAlertModal(false)} 
                        thresholds={alertThresholds}
                        onUpdate={setAlertThresholds}
                    />
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {showExportModal && (
                    <ExportModal 
                        isOpen={showExportModal} 
                        onClose={() => setShowExportModal(false)} 
                        metrics={metrics}
                        historicalData={historicalData}
                        onExport={exportData}
                    />
                )}
            </AnimatePresence>
            
            {/* Notificaciones flotantes */}
            <AnimatePresence>
                {notifications.map((notification, index) => (
                    <NotificationToast
                        key={index}
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotifications(prev => prev.filter((_, i) => i !== index))}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Telemetry;