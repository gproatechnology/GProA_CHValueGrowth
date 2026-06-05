import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * CircularProgress - Progreso circular animado con Canvas.
 * Diseño Sky Blue & Clean Glass
 *
 * @param {number}   props.value            - Valor actual (0-max)
 * @param {number}   [props.max=100]        - Valor máximo
 * @param {string|Array} [props.color]      - Color del arco (puede ser array para gradiente)
 * @param {string}   [props.backgroundColor]- Color fondo del arco
 * @param {number}   [props.size=80]        - Tamaño en px
 * @param {number}   [props.strokeWidth=8]  - Grosor del trazo
 * @param {boolean}  [props.rounded=true]   - Extremos redondeados
 * @param {boolean}  [props.animate=true]   - Animar o mostrar directo
 * @param {number}   [props.animationDuration=1000] - Duración ms
 * @param {Function} [props.textFormatter]  - Formato del texto central
 * @param {string}   [props.fontSize]       - Tamaño fuente texto
 * @param {string}   [props.fontColor]      - Color fuente texto
 * @param {number}   [props.decimals=0]     - Decimales del texto
 * @param {boolean}  [props.glow=false]     - Efecto de brillo
 * @param {string}   [props.easing='cubic'] - Tipo de easing: 'linear', 'quad', 'cubic', 'quart', 'expo'
 * @param {boolean}  [props.showPercentage=true] - Mostrar porcentaje en el centro
 * @param {boolean}  [props.triggerOnce=true] - Animar solo una vez al entrar en viewport
 * @param {number}   [props.threshold=0.3] - Threshold para el viewport
 */
const CircularProgress = ({
    value,
    max = 100,
    color = ['#1E90FF', '#3B82F6'], // Gradiente Sky Blue
    backgroundColor = '#1E90FF/20', // Azul translúcido
    size = 80,
    strokeWidth = 8,
    rounded = true,
    animate = true,
    animationDuration = 1000,
    textFormatter,
    fontSize = '14px',
    fontColor = '#EAF3FF', // Blanco azulado
    decimals = 0,
    glow = false,
    easing = 'cubic',
    showPercentage = true,
    triggerOnce = true,
    threshold = 0.3,
}) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const currentPctRef = useRef(0);
    const hasAnimatedRef = useRef(false);

    // Intersection Observer para animar solo cuando es visible
    const { ref: containerRef, inView } = useInView({
        threshold,
        triggerOnce,
        fallbackInView: true,
    });

    // Clamp value to [0, max]
    const clamp = useCallback((v) => Math.min(Math.max(v ?? 0, 0), max), [max]);
    const targetPct = useMemo(() => (clamp(value) / max) * 100, [value, max, clamp]);

    // Funciones de easing mejoradas
    const easingFunctions = useMemo(() => ({
        linear: (t) => t,
        quad: (t) => 1 - (1 - t) * (1 - t),
        cubic: (t) => 1 - Math.pow(1 - t, 3),
        quart: (t) => 1 - Math.pow(1 - t, 4),
        expo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        back: (t) => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        },
        elastic: (t) => {
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        },
    }), []);

    const easeOut = useCallback((t) => {
        const easingFn = easingFunctions[easing] || easingFunctions.cubic;
        return Math.min(1, Math.max(0, easingFn(t)));
    }, [easing, easingFunctions]);

    const draw = useCallback((pct, currentVal) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ajustar para alta densidad de píxeles (retina)
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        ctx.scale(dpr, dpr);

        const cx = size / 2;
        const cy = size / 2;
        const r = (size - strokeWidth) / 2;

        ctx.clearRect(0, 0, size, size);

        // Background arc con efecto glass
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(30, 144, 255, 0.2)`;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = rounded ? 'round' : 'butt';
        ctx.shadowBlur = 0;
        ctx.stroke();

        // Foreground arc
        const endAngle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
        let strokeStyle = color;
        
        // Manejar gradiente
        if (Array.isArray(color) && color.length >= 2) {
            const grad = ctx.createLinearGradient(0, 0, size, size);
            color.forEach((c, i) => grad.addColorStop(i / (color.length - 1), c));
            strokeStyle = grad;
        }

        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, endAngle);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = rounded ? 'round' : 'butt';
        
        // Efecto de brillo (glow)
        if (glow) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = Array.isArray(color) ? color[0] : color;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;

        // Center text con formato mejorado
        if (size > 40 && showPercentage) {
            ctx.fillStyle = fontColor;
            ctx.font = `600 ${fontSize} 'Inter', system-ui, -apple-system, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            let text;
            if (textFormatter) {
                text = textFormatter(currentVal, max);
            } else {
                const percentage = (currentVal / max) * 100;
                text = `${percentage.toFixed(decimals)}%`;
            }
            
            // Sombra sutil para el texto
            ctx.shadowBlur = 2;
            ctx.shadowColor = 'rgba(30, 144, 255, 0.3)';
            ctx.fillText(text, cx, cy);
            ctx.shadowBlur = 0;
        }
    }, [size, strokeWidth, rounded, color, glow, fontSize, fontColor, textFormatter, decimals, max, showPercentage]);

    // Iniciar animación
    const startAnimation = useCallback(() => {
        const startPct = currentPctRef.current;
        const endPct = targetPct;

        if (!animate || !inView) {
            currentPctRef.current = endPct;
            draw(endPct, clamp(value));
            return;
        }

        // Cancelar animación previa
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        startTimeRef.current = null;

        const tick = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / animationDuration, 1);
            const eased = easeOut(progress);
            const pct = startPct + (endPct - startPct) * eased;
            const val = (pct / 100) * max;

            currentPctRef.current = pct;
            draw(pct, val);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(tick);
            } else {
                currentPctRef.current = endPct;
                draw(endPct, clamp(value));
                animationRef.current = null;
            }
        };

        animationRef.current = requestAnimationFrame(tick);
    }, [animate, inView, targetPct, animationDuration, easeOut, draw, clamp, value, max]);

    // Observar cambios en el valor o visibilidad
    useEffect(() => {
        if (triggerOnce && hasAnimatedRef.current) return;
        
        if (inView || !triggerOnce) {
            hasAnimatedRef.current = true;
            startAnimation();
        }
    }, [value, max, inView, startAnimation, triggerOnce]);

    // Limpiar animación al desmontar
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, []);

    // Re-dibujar si cambian las props que afectan el estilo
    useEffect(() => {
        if (!animate || currentPctRef.current === targetPct) {
            draw(targetPct, clamp(value));
        }
    }, [color, strokeWidth, rounded, glow, fontSize, fontColor, draw, targetPct, clamp, value, animate]);

    return (
        <div 
            ref={containerRef}
            className="circular-progress-container inline-flex items-center justify-center"
            style={{
                filter: glow ? 'drop-shadow(0 0 8px rgba(30, 144, 255, 0.4))' : 'none',
            }}
        >
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                style={{ 
                    width: size, 
                    height: size, 
                    display: 'block',
                    borderRadius: '50%',
                }}
                className="circular-progress transition-all duration-300"
                aria-label={`Progreso: ${targetPct.toFixed(0)}%`}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
            />
        </div>
    );
};

// Componente adicional: CircularProgress con ícono central
export const CircularProgressWithIcon = ({
    icon: Icon,
    iconSize = 24,
    iconColor = '#1E90FF',
    ...props
}) => {
    const { size = 80, ...restProps } = props;
    
    return (
        <div className="relative inline-flex">
            <CircularProgress {...restProps} size={size} />
            {Icon && (
                <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ 
                        fontSize: iconSize,
                        color: iconColor,
                    }}
                >
                    <Icon size={iconSize} />
                </div>
            )}
        </div>
    );
};

// Componente adicional: CircularProgress con etiqueta
export const CircularProgressWithLabel = ({
    label,
    labelPosition = 'bottom',
    labelColor = '#AFC8E6',
    labelSize = '12px',
    ...props
}) => {
    return (
        <div className="inline-flex flex-col items-center gap-2">
            <CircularProgress {...props} />
            {label && (
                <span 
                    className="text-center font-medium"
                    style={{ 
                        color: labelColor,
                        fontSize: labelSize,
                    }}
                >
                    {label}
                </span>
            )}
        </div>
    );
};

// Componente adicional: Grupo de progresos circulares con estilo azul
export const CircularProgressGroup = ({
    items = [],
    columns = 4,
    className = '',
    ...props
}) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-5 ${className}`}>
            {items.map((item, index) => (
                <div
                    key={index}
                    className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20 text-center group"
                >
                    <div className="flex justify-center mb-3">
                        <CircularProgressWithLabel
                            value={item.value}
                            max={item.max || 100}
                            label={item.label}
                            size={item.size || 100}
                            color={item.color || ['#1E90FF', '#3B82F6']}
                            fontColor="#EAF3FF"
                            backgroundColor="rgba(30, 144, 255, 0.2)"
                            glow={item.glow || false}
                            {...props}
                        />
                    </div>
                    {item.description && (
                        <p className="text-xs text-[#AFC8E6] mt-2">{item.description}</p>
                    )}
                    {item.trend && (
                        <div className="flex items-center justify-center gap-1 mt-2">
                            <span className={`text-[10px] ${item.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {item.trend > 0 ? '↑' : '↓'} {Math.abs(item.trend)}%
                            </span>
                            <span className="text-[10px] text-[#AFC8E6]">vs anterior</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Componente adicional: CircularProgress con animación de carga
export const LoadingSpinner = ({
    size = 40,
    strokeWidth = 4,
    color = ['#1E90FF', '#3B82F6'],
    duration = 1000,
    ...props
}) => {
    return (
        <CircularProgress
            value={75}
            max={100}
            size={size}
            strokeWidth={strokeWidth}
            color={color}
            animate={true}
            animationDuration={duration}
            showPercentage={false}
            rounded={true}
            glow={true}
            {...props}
        />
    );
};

// Componente adicional: CircularProgress con métricas de rendimiento
export const PerformanceMetric = ({
    value,
    label,
    max = 100,
    size = 90,
    unit = '%',
    status = 'good',
    ...props
}) => {
    const statusColors = {
        good: { color: ['#10B981', '#34D399'], fontColor: '#10B981' },
        warning: { color: ['#F59E0B', '#FBBF24'], fontColor: '#F59E0B' },
        critical: { color: ['#EF4444', '#F87171'], fontColor: '#EF4444' },
    };

    const colors = statusColors[status] || statusColors.good;

    return (
        <div className="flex flex-col items-center">
            <CircularProgress
                value={value}
                max={max}
                size={size}
                color={colors.color}
                fontColor={colors.fontColor}
                glow={status === 'critical'}
                {...props}
            />
            <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-[#EAF3FF]">{label}</p>
                <p className="text-xs text-[#AFC8E6]">
                    {value}{unit} de {max}{unit}
                </p>
            </div>
        </div>
    );
};

export default CircularProgress;