import React, { useEffect, useRef, useCallback } from 'react';

/**
 * CircularProgress - Progreso circular animado con Canvas.
 *
 * @param {number}   props.value            - Valor actual (0-max)
 * @param {number}   [props.max=100]        - Valor máximo
 * @param {string}   [props.color]          - Color del arco
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
 */
const CircularProgress = ({
    value,
    max           = 100,
    color         = '#3b82f6',
    backgroundColor = '#2d2f36',
    size          = 80,
    strokeWidth   = 8,
    rounded       = true,
    animate       = true,
    animationDuration = 1000,
    textFormatter,
    fontSize      = '14px',
    fontColor     = '#ffffff',
    decimals      = 0,
    glow          = false,
}) => {
    const canvasRef      = useRef(null);
    const animationRef   = useRef(null);
    const startTimeRef   = useRef(null);
    const currentPctRef  = useRef(0);

    // Clamp value to [0, max]
    const clamp = (v) => Math.min(Math.max(v ?? 0, 0), max);
    const targetPct = (clamp(value) / max) * 100;

    const draw = useCallback((pct, currentVal) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cx = size / 2;
        const cy = size / 2;
        const r  = (size - strokeWidth) / 2;

        ctx.clearRect(0, 0, size, size);

        // Background arc
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.strokeStyle = backgroundColor;
        ctx.lineWidth   = strokeWidth;
        ctx.lineCap     = rounded ? 'round' : 'butt';
        ctx.stroke();

        // Foreground arc
        const endAngle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
        let strokeStyle = color;
        if (Array.isArray(color) && color.length >= 2) {
            const grad = ctx.createLinearGradient(0, 0, size, size);
            color.forEach((c, i) => grad.addColorStop(i / (color.length - 1), c));
            strokeStyle = grad;
        }

        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, endAngle);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth   = strokeWidth;
        ctx.lineCap     = rounded ? 'round' : 'butt';
        if (glow) {
            ctx.shadowBlur  = 8;
            ctx.shadowColor = typeof color === 'string' ? color : '#3b82f6';
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Center text
        if (size > 40) {
            ctx.fillStyle    = fontColor;
            ctx.font         = `bold ${fontSize} system-ui, sans-serif`;
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            const text = textFormatter
                ? textFormatter(currentVal, max)
                : `${((currentVal / max) * 100).toFixed(decimals)}%`;
            ctx.fillText(text, cx, cy);
        }
    }, [size, strokeWidth, rounded, backgroundColor, color, glow, fontSize, fontColor, textFormatter, decimals, max]);

    useEffect(() => {
        const startPct = currentPctRef.current;
        const endPct   = targetPct;

        if (!animate) {
            currentPctRef.current = endPct;
            draw(endPct, clamp(value));
            return;
        }

        // Cancel previous animation
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        startTimeRef.current = null;

        const tick = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed  = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / animationDuration, 1);
            // easeOutCubic
            const eased    = 1 - Math.pow(1 - progress, 3);
            const pct      = startPct + (endPct - startPct) * eased;
            const val      = (pct / 100) * max;

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

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [value, max, animate, animationDuration, draw, targetPct]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            style={{ width: size, height: size, display: 'block' }}
            className="circular-progress"
            aria-label={`Progreso: ${targetPct.toFixed(0)}%`}
        />
    );
};

export default CircularProgress;