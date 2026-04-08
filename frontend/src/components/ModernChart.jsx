import React, { useEffect, useRef, useMemo } from 'react';
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
} from 'chart.js';
import { Line, Bar, Doughnut, Radar, Pie } from 'react-chartjs-2';

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
    Colors
);

/**
 * Componente unificado para gráficos modernos con tema oscuro y animaciones.
 * 
 * @param {Object} props
 * @param {('line'|'bar'|'doughnut'|'radar'|'pie')} props.type - Tipo de gráfico.
 * @param {Object} props.data - Datos del gráfico (formato Chart.js).
 * @param {Object} [props.options] - Opciones adicionales (se fusionan con las predeterminadas).
 * @param {string} [props.title] - Título del gráfico.
 * @param {string} [props.height='400px'] - Altura del contenedor.
 * @param {boolean} [props.animated=true] - Activar animaciones.
 * @param {number} [props.animationDuration=1500] - Duración de la animación en ms.
 * @param {boolean} [props.showGrid=true] - Mostrar cuadrícula.
 * @param {boolean} [props.darkMode=true] - Modo oscuro (colores adaptados).
 * @param {Function} [props.onClick] - Callback al hacer clic en un elemento.
 */
const ModernChart = ({
    type = 'line',
    data,
    options = {},
    title = '',
    height = '400px',
    animated = true,
    animationDuration = 1500,
    showGrid = true,
    darkMode = true,
    onClick,
}) => {
    const chartRef = useRef(null);

    // Colores base según modo oscuro/claro
    const theme = useMemo(() => {
        if (darkMode) {
            return {
                gridColor: 'rgba(255, 255, 255, 0.08)',
                tickColor: '#9ca3af',
                tooltipBackground: 'rgba(0, 0, 0, 0.85)',
                tooltipBorderColor: '#3b82f6',
                legendLabelsColor: '#e5e7eb',
                titleColor: '#ffffff',
            };
        } else {
            return {
                gridColor: 'rgba(0, 0, 0, 0.08)',
                tickColor: '#4b5563',
                tooltipBackground: 'rgba(255, 255, 255, 0.95)',
                tooltipBorderColor: '#3b82f6',
                legendLabelsColor: '#1f2937',
                titleColor: '#111827',
            };
        }
    }, [darkMode]);

    // Opciones por defecto (fusionadas con las del usuario)
    const defaultOptions = useMemo(() => {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 16,
                        font: { size: 12, weight: 'normal' },
                        color: theme.legendLabelsColor,
                    },
                },
                tooltip: {
                    backgroundColor: theme.tooltipBackground,
                    titleColor: darkMode ? '#fff' : '#111',
                    bodyColor: darkMode ? '#ddd' : '#333',
                    borderColor: theme.tooltipBorderColor,
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    padding: 10,
                    caretSize: 6,
                },
                title: {
                    display: !!title,
                    text: title,
                    color: theme.titleColor,
                    font: { size: 16, weight: 'bold' },
                    padding: { top: 10, bottom: 20 },
                },
            },
            animation: animated ? {
                duration: animationDuration,
                easing: 'easeInOutQuart',
            } : false,
            onClick: (event, activeElements) => {
                if (onClick && activeElements.length) {
                    onClick(activeElements, event);
                }
            },
        };

        // Escalas (solo para gráficos que las usan)
        if (type !== 'doughnut' && type !== 'pie' && type !== 'radar') {
            baseOptions.scales = {
                x: {
                    grid: { display: showGrid, color: theme.gridColor },
                    ticks: { color: theme.tickColor },
                },
                y: {
                    grid: { display: showGrid, color: theme.gridColor },
                    ticks: { color: theme.tickColor },
                },
            };
        }

        // Para gráficos radiales (radar)
        if (type === 'radar') {
            baseOptions.scales = {
                r: {
                    grid: { color: theme.gridColor },
                    ticks: { color: theme.tickColor, backdropColor: 'transparent' },
                    angleLines: { color: theme.gridColor },
                },
            };
        }

        // Fusionar con opciones proporcionadas
        return {
            ...baseOptions,
            ...options,
            plugins: { ...baseOptions.plugins, ...options.plugins },
            scales: { ...baseOptions.scales, ...options.scales },
        };
    }, [type, title, animated, animationDuration, showGrid, theme, onClick, darkMode, options]);

    // Renderizar según tipo
    const renderChart = () => {
        const chartProps = {
            ref: chartRef,
            data,
            options: defaultOptions,
        };

        switch (type) {
            case 'bar':
                return <Bar {...chartProps} />;
            case 'doughnut':
                return <Doughnut {...chartProps} />;
            case 'radar':
                return <Radar {...chartProps} />;
            case 'pie':
                return <Pie {...chartProps} />;
            case 'line':
            default:
                return <Line {...chartProps} />;
        }
    };

    return (
        <div
            className="modern-chart-container"
            style={{ height, width: '100%', position: 'relative' }}
        >
            {renderChart()}
        </div>
    );
};

export default ModernChart;