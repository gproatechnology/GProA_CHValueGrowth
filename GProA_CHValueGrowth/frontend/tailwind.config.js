/** @type {import('tailwindcss').Config} */
export default {
    // Modo oscuro basado en clase (para control manual desde la app)
    darkMode: 'class',

    // Contenido a analizar para generar clases
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        // Extiende la configuración por defecto
        extend: {
            // Colores personalizados (neumórficos y acentos)
            colors: {
                primary: '#1a1b1e',
                secondary: '#232529',
                accent: {
                    primary: '#3b82f6',
                    secondary: '#10b981',
                    warning: '#f59e0b',
                    danger: '#ef4444',
                    purple: '#8b5cf6',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#9ca3af',
                    muted: '#6b7280',
                },
            },

            // Sombras neumórficas
            boxShadow: {
                'neumorph-outset': '9px 9px 16px rgba(0, 0, 0, 0.5), -9px -9px 16px rgba(255, 255, 255, 0.05)',
                'neumorph-inset': 'inset 6px 6px 12px rgba(0, 0, 0, 0.6), inset -6px -6px 12px rgba(255, 255, 255, 0.04)',
                'neumorph-sm': '4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.03)',
                'neumorph-inset-sm': 'inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.02)',
                // Efectos de vidrio (glassmorphism)
                'glass': '0 8px 32px rgba(0, 0, 0, 0.2)',
                'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
                'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
            },

            // Bordes redondeados extendidos
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '2.5rem',
            },

            // Fuentes
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },

            // Animaciones personalizadas
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'bounce-soft': 'bounceSoft 1.2s ease-in-out infinite',
                'pulse-soft': 'pulseSoft 1.5s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
                'shimmer': 'shimmer 2s infinite',
                'float': 'float 5s ease-in-out infinite',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
            },

            // Keyframes para las animaciones
            keyframes: {
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '0.8' },
                    '50%': { opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                    '25%': { transform: 'translateY(-10px) translateX(5px)' },
                    '50%': { transform: 'translateY(5px) translateX(-5px)' },
                    '75%': { transform: 'translateY(-5px) translateX(10px)' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(59,130,246,0.5)' },
                    '50%': { boxShadow: '0 0 20px rgba(59,130,246,0.8)' },
                },
            },

            // Backdrop blur para efectos de vidrio
            backdropBlur: {
                xs: '2px',
                sm: '4px',
                md: '8px',
                lg: '12px',
                xl: '16px',
            },

            // Configuración del contenedor (centrado automático)
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '2rem',
                    lg: '4rem',
                    xl: '5rem',
                },
            },

            // Breakpoints personalizados (además de los por defecto)
            screens: {
                'xs': '480px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
                '3xl': '1920px',
            },

            // Espaciado adicional (útil para componentes neumórficos)
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '30': '7.5rem',
                '88': '22rem',
                '100': '25rem',
                '120': '30rem',
                '128': '32rem',
            },

            // Tamaños de fuente personalizados
            fontSize: {
                'xxs': ['0.625rem', { lineHeight: '0.75rem' }],
                'tiny': ['0.6875rem', { lineHeight: '1rem' }],
            },

            // Opacidad
            opacity: {
                '15': '0.15',
                '85': '0.85',
            },
        },
    },

    // Plugins adicionales (opcional, puedes instalar tailwindcss-animate si lo deseas)
    plugins: [
        // Para usar animaciones más complejas (requiere npm install tailwindcss-animate)
        // require('tailwindcss-animate'),
    ],
};