import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
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
    ArcElement,
    RadialLinearScale,
    Filler,
    Colors,
    SubTitle,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar, Pie } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, Download, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

// Registrar todos los componentes necesarios
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    Filler,
    Colors,
    SubTitle
);

/**
 * Componente unificado para gráficos modernos con tema Sky Blue & Clean Glass.
 * 
 * @param {Object} props
 * @param {('line'|'bar'|'doughnut'|'radar'|'pie'|'area')} props.type - Tipo de gráfico.
 * @param {Object} props.data - Datos del gráfico (formato Chart.js).
 * @param {Object} [props.options] - Opciones adicionales (se fusionan con las predeterminadas).
 * @param {string} [props.title] - Título del gráfico.
 * @param {string} [props.subtitle] - Subtítulo del gráfico.
 * @param {string} [props.height='400px'] - Altura del contenedor.
 * @param {boolean} [props.animated=true] - Activar animaciones.
 * @param {number} [props.animationDuration=1500] - Duración de la animación en ms.
 * @param {boolean} [props.showGrid=true] - Mostrar cuadrícula.
 * @param {boolean} [props.showLegend=true] - Mostrar leyenda.
 * @param {boolean} [props.enableZoom=false] - Habilitar zoom/descarga.
 * @param {Function} [props.onClick] - Callback al hacer clic en un elemento.
 * @param {string} [props.theme='dark'] - Tema: 'light' o 'dark'
 * @param {string} [props.backgroundType='glass'] - Tipo de fondo: 'glass', 'solid', 'transparent'
 */
const ModernChart = ({
    type = 'line',
    data,
    options = {},
    title = '',
    subtitle = '',
    height = '400px',
    animated = true,
    animationDuration = 1500,
    showGrid = true,
    showLegend = true,
    enableZoom = false,
    onClick,
    theme = 'dark',
    backgroundType = 'glass',
}) => {
    const chartRef = useRef(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    // Colores base según tema Sky Blue
    const themeColors = useMemo(() => {
        if (theme === 'light') {
            return {
                gridColor: 'rgba(30, 144, 255, 0.12)',
                tickColor: '#64748B',
                tooltipBackground: 'rgba(255, 255, 255, 0.98)',
                tooltipBorderColor: '#1E90FF',
                legendLabelsColor: '#1E293B',
                titleColor: '#0F172A',
                subtitleColor: '#64748B',
                axisColor: '#94A3B8',
                backgroundColor: 'transparent',
            };
        } else {
            return {
                gridColor: 'rgba(30, 144, 255, 0.15)',
                tickColor: '#94A3B8',
                tooltipBackground: 'rgba(15, 23, 42, 0.95)',
                tooltipBorderColor: '#1E90FF',
                legendLabelsColor: '#E2E8F0',
                titleColor: '#F1F5F9',
                subtitleColor: '#94A3B8',
                axisColor: '#475569',
                backgroundColor: 'transparent',
            };
        }
    }, [theme]);

    // Paleta de colores Sky Blue para datasets
    const skyBluePalette = useMemo(() => [
        '#1E90FF', '#3B82F6', '#06B6D4', '#0284C7', '#38BDF8',
        '#7DD3FC', '#BAE6FD', '#F0F9FF', '#E0F2FE', '#1E3A8A'
    ], []);

    // Mejorar los datos con colores predeterminados
    const enhancedData = useMemo(() => {
        if (!data || !data.datasets) return data;
        
        const enhancedDatasets = data.datasets.map((dataset, index) => ({
            ...dataset,
            borderColor: dataset.borderColor || skyBluePalette[index % skyBluePalette.length],
            backgroundColor: dataset.backgroundColor || `${skyBluePalette[index % skyBluePalette.length]}20`,
            borderWidth: dataset.borderWidth || 2,
            pointBackgroundColor: dataset.pointBackgroundColor || skyBluePalette[index % skyBluePalette.length],
            pointBorderColor: dataset.pointBorderColor || '#FFFFFF',
            pointBorderWidth: dataset.pointBorderWidth || 2,
            pointRadius: dataset.pointRadius || 4,
            pointHoverRadius: dataset.pointHoverRadius || 6,
            tension: dataset.tension || 0.3,
            fill: type === 'area' ? true : (dataset.fill || false),
        }));
        
        return {
            ...data,
            datasets: enhancedDatasets,
        };
    }, [data, skyBluePalette, type]);

    // Opciones por defecto con tema Sky Blue
    const defaultOptions = useMemo(() => {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: showLegend,
                    position: 'top',
                    align: 'center',
                    labels: {
                        usePointStyle: true,
                        padding: 16,
                        font: { 
                            size: 12, 
                            weight: '500',
                            family: "'Inter', system-ui, -apple-system, sans-serif"
                        },
                        color: themeColors.legendLabelsColor,
                        boxWidth: 10,
                        boxHeight: 10,
                        borderRadius: 3,
                    },
                },
                tooltip: {
                    backgroundColor: themeColors.tooltipBackground,
                    titleColor: theme === 'light' ? '#0F172A' : '#F1F5F9',
                    bodyColor: theme === 'light' ? '#334155' : '#CBD5E1',
                    borderColor: themeColors.tooltipBorderColor,
                    borderWidth: 1,
                    cornerRadius: 12,
                    displayColors: true,
                    padding: 12,
                    caretSize: 8,
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            label += new Intl.NumberFormat('es-MX').format(context.parsed.y || context.parsed);
                            return label;
                        }
                    }
                },
                title: {
                    display: !!title,
                    text: title,
                    color: themeColors.titleColor,
                    font: { size: 18, weight: 'bold', family: "'Inter', system-ui, sans-serif" },
                    padding: { top: 10, bottom: subtitle ? 5 : 20 },
                },
                subtitle: {
                    display: !!subtitle,
                    text: subtitle,
                    color: themeColors.subtitleColor,
                    font: { size: 12, weight: 'normal' },
                    padding: { bottom: 20 },
                },
            },
            animation: animated ? {
                duration: animationDuration,
                easing: 'easeInOutQuart',
                onComplete: () => {
                    if (isRefreshing) setIsRefreshing(false);
                },
            } : false,
            onClick: (event, activeElements) => {
                if (onClick && activeElements.length) {
                    onClick(activeElements, event, chartRef.current);
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'xy',
                intersect: false,
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                },
            },
        };

        // Escalas (solo para gráficos que las usan)
        if (type !== 'doughnut' && type !== 'pie' && type !== 'radar') {
            baseOptions.scales = {
                x: {
                    grid: { 
                        display: showGrid, 
                        color: themeColors.gridColor,
                        drawBorder: false,
                        drawTicks: true,
                    },
                    ticks: { 
                        color: themeColors.tickColor,
                        font: { size: 11, family: "'Inter', monospace" },
                    },
                    border: { display: false },
                },
                y: {
                    grid: { 
                        display: showGrid, 
                        color: themeColors.gridColor,
                        drawBorder: false,
                    },
                    ticks: { 
                        color: themeColors.tickColor,
                        font: { size: 11, family: "'Inter', monospace" },
                        callback: (value) => {
                            if (value >= 1000) return `${value / 1000}k`;
                            return value;
                        }
                    },
                    border: { display: false },
                },
            };
        }

        // Configuración específica para área
        if (type === 'area') {
            baseOptions.plugins.tooltip.callbacks.label = (context) => {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                label += new Intl.NumberFormat('es-MX').format(context.parsed.y);
                return label;
            };
        }

        // Para gráficos radiales (radar)
        if (type === 'radar') {
            baseOptions.scales = {
                r: {
                    grid: { color: themeColors.gridColor },
                    ticks: { 
                        color: themeColors.tickColor, 
                        backdropColor: 'transparent',
                        stepSize: 20,
                    },
                    angleLines: { color: themeColors.gridColor },
                    pointLabels: { color: themeColors.tickColor, font: { size: 11 } },
                },
            };
        }

        // Para gráficos circulares
        if (type === 'doughnut' || type === 'pie') {
            baseOptions.plugins.tooltip.callbacks.label = (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${new Intl.NumberFormat('es-MX').format(value)} (${percentage}%)`;
            };
            baseOptions.cutout = type === 'doughnut' ? '60%' : undefined;
        }

        // Fusionar con opciones proporcionadas
        return {
            ...baseOptions,
            ...options,
            plugins: { ...baseOptions.plugins, ...options.plugins },
            scales: { ...baseOptions.scales, ...options.scales },
        };
    }, [type, title, subtitle, animated, animationDuration, showGrid, showLegend, 
        themeColors, onClick, options, theme, isRefreshing]);

    // Función para exportar el gráfico como imagen
    const exportAsImage = useCallback(() => {
        const canvas = chartRef.current?.canvas;
        if (!canvas) return;
        
        const link = document.createElement('a');
        link.download = `chart_${title || 'export'}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }, [title]);

    // Función para refrescar el gráfico
    const refreshChart = useCallback(() => {
        setIsRefreshing(true);
        if (chartRef.current && chartRef.current.update) {
            chartRef.current.update();
        }
        setTimeout(() => setIsRefreshing(false), animationDuration);
    }, [animationDuration]);

    // Función para hacer zoom
    const handleZoom = useCallback((direction) => {
        const newZoomLevel = direction === 'in' ? zoomLevel + 0.2 : Math.max(0.5, zoomLevel - 0.2);
        setZoomLevel(newZoomLevel);
        
        if (chartRef.current && chartRef.current.options) {
            chartRef.current.options.scales = {
                ...chartRef.current.options.scales,
                y: {
                    ...chartRef.current.options.scales?.y,
                    min: undefined,
                    max: undefined,
                }
            };
            chartRef.current.update();
        }
    }, [zoomLevel]);

    // Estilos del contenedor según backgroundType
    const getContainerStyles = () => {
        const baseStyles = {
            height: isZoomed ? 'calc(100vh - 200px)' : height,
            width: '100%',
            position: 'relative',
            transition: 'all 0.3s ease-in-out',
        };
        
        if (backgroundType === 'glass') {
            return {
                ...baseStyles,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(30, 144, 255, 0.2)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            };
        } else if (backgroundType === 'solid') {
            return {
                ...baseStyles,
                background: theme === 'light' ? '#FFFFFF' : '#0F172A',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(30, 144, 255, 0.2)',
            };
        }
        
        return baseStyles;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="modern-chart-container group"
            style={getContainerStyles()}
        >
            {/* Barra de herramientas */}
            {enableZoom && (
                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="p-2 bg-[#0B1E3A]/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all text-[#1E90FF] border border-[#1E90FF]/30"
                        title={isZoomed ? 'Salir de pantalla completa' : 'Pantalla completa'}
                    >
                        {isZoomed ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportAsImage}
                        className="p-2 bg-[#0B1E3A]/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all text-[#1E90FF] border border-[#1E90FF]/30"
                        title="Exportar como imagen"
                    >
                        <Download size={16} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={refreshChart}
                        className="p-2 bg-[#0B1E3A]/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all text-[#1E90FF] border border-[#1E90FF]/30"
                        title="Refrescar gráfico"
                    >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleZoom('in')}
                        className="p-2 bg-[#0B1E3A]/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all text-[#1E90FF] border border-[#1E90FF]/30"
                        title="Acercar"
                    >
                        <ZoomIn size={16} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleZoom('out')}
                        className="p-2 bg-[#0B1E3A]/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all text-[#1E90FF] border border-[#1E90FF]/30"
                        title="Alejar"
                    >
                        <ZoomOut size={16} />
                    </motion.button>
                </div>
            )}
            
            {/* Indicador de carga */}
            {isRefreshing && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0B1E3A]/50 backdrop-blur-sm rounded-2xl z-20">
                    <div className="w-8 h-8 border-2 border-[#1E90FF]/30 border-t-[#1E90FF] rounded-full animate-spin"></div>
                </div>
            )}
            
            {/* Zoom indicator */}
            {zoomLevel !== 1 && (
                <div className="absolute bottom-3 left-3 z-10 bg-[#0B1E3A]/80 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-[#AFC8E6] border border-[#1E90FF]/30">
                    Zoom: {Math.round(zoomLevel * 100)}%
                </div>
            )}
            
            {/* Gráfico */}
            <div 
                className="chart-wrapper" 
                style={{ 
                    height: '100%', 
                    width: '100%',
                    opacity: isRefreshing ? 0.5 : 1,
                    transition: 'opacity 0.2s ease',
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                }}
            >
                {type === 'bar' && <Bar ref={chartRef} data={enhancedData} options={defaultOptions} />}
                {type === 'doughnut' && <Doughnut ref={chartRef} data={enhancedData} options={defaultOptions} />}
                {type === 'radar' && <Radar ref={chartRef} data={enhancedData} options={defaultOptions} />}
                {type === 'pie' && <Pie ref={chartRef} data={enhancedData} options={defaultOptions} />}
                {(type === 'line' || type === 'area') && <Line ref={chartRef} data={enhancedData} options={defaultOptions} />}
            </div>
        </motion.div>
    );
};

// Componente adicional: ChartCard con encabezado y descripción
export const ChartCard = ({ title, description, children, className = '' }) => (
    <div className={`bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20 ${className}`}>
        {title && (
            <div className="mb-4">
                <h3 className="text-base font-semibold text-[#EAF3FF]">{title}</h3>
                {description && <p className="text-xs text-[#AFC8E6] mt-1">{description}</p>}
            </div>
        )}
        {children}
    </div>
);

// Componente adicional: DashboardChartGrid para múltiples gráficos
export const DashboardChartGrid = ({ children, columns = 2, className = '' }) => (
    <div className={`grid grid-cols-1 lg:grid-cols-${columns} gap-5 ${className}`}>
        {children}
    </div>
);

// Componente adicional: ChartSkeleton para loading
export const ChartSkeleton = ({ height = '400px' }) => (
    <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg border border-[#1E90FF]/20 animate-pulse">
        <div className="h-6 w-32 bg-[#1E90FF]/20 rounded mb-4"></div>
        <div className="h-64 bg-[#0B1E3A]/60 rounded-lg flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#1E90FF]/30 border-t-[#1E90FF] rounded-full animate-spin"></div>
        </div>
    </div>
);

export default ModernChart;