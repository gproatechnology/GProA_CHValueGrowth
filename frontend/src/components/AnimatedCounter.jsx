import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * AnimatedCounter - Anima un número cuando entra en el viewport.
 * Usa requestAnimationFrame para mayor rendimiento y compatibilidad.
 *
 * @param {number}  props.value     - Valor final a mostrar
 * @param {string}  [props.prefix]  - Prefijo (ej. '$')
 * @param {string}  [props.suffix]  - Sufijo (ej. '%')
 * @param {number}  [props.decimals]- Decimales (default 0)
 * @param {number}  [props.duration]- Duración ms (default 1500)
 */
const AnimatedCounter = ({
    value = 0,
    prefix = '',
    suffix = '',
    decimals = 0,
    duration = 1500,
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const rafRef       = useRef(null);
    const startTimeRef = useRef(null);
    const startValRef  = useRef(0);
    const hasStartedRef = useRef(false);

    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true,
        fallbackInView: true,
    });

    // Easing: easeOutQuad
    const easeOut = (t) => 1 - (1 - t) * (1 - t);

    const startAnimation = (from, to) => {
        // Cancel any running animation
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        startTimeRef.current = null;
        startValRef.current  = from;

        const animate = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed  = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased    = easeOut(progress);
            const current  = startValRef.current + (to - startValRef.current) * eased;
            setDisplayValue(current);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValue(to);
                rafRef.current = null;
            }
        };

        rafRef.current = requestAnimationFrame(animate);
    };

    // Start when visible for the first time
    useEffect(() => {
        if (inView && !hasStartedRef.current) {
            hasStartedRef.current = true;
            startAnimation(0, value);
        }
    }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update if value changes after initial animation
    useEffect(() => {
        if (hasStartedRef.current) {
            startAnimation(displayValue, value);
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const formatted = displayValue.toLocaleString('es-MX', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

    return (
        <span ref={ref}>
            {prefix}{formatted}{suffix}
        </span>
    );
};

export default AnimatedCounter;