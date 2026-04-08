import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Estilos avanzados con animaciones HTML5
const splashStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes rotateTire {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulseGlow {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.05);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes borderFlow {
  0%, 100% { 
    border-color: rgba(16, 185, 129, 0.2);
    box-shadow: 0 0 0px rgba(16, 185, 129, 0);
  }
  50% { 
    border-color: rgba(16, 185, 129, 0.6);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
  }
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes floatParticle {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 0.5; }
  90% { opacity: 0.5; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
}

@keyframes scanLine {
  0% { top: 0%; }
  100% { top: 100%; }
}

.animate-shimmer {
  animation: shimmer 1.8s infinite;
}

.animate-border-glow {
  animation: borderFlow 2s ease-in-out infinite;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

.typing-effect {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 2s steps(40, end);
}

.scan-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #10B981, #3B82F6, #10B981, transparent);
  animation: scanLine 3s linear infinite;
}

.glass-terminal {
  background: rgba(10, 15, 30, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.terminal-text {
  font-family: 'Courier New', 'Fira Code', monospace;
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}
`;

let splashStyleInjected = false;
function injectSplashStyles() {
  if (splashStyleInjected) return;
  const el = document.createElement('style');
  el.textContent = splashStyles;
  document.head.appendChild(el);
  splashStyleInjected = true;
}

/**
 * SplashScreen - Pantalla de carga estilo terminal de mercado
 * @component
 * @param {Object} props
 * @param {Function} [props.onComplete] - Callback cuando la carga termina
 * @param {number} [props.minDuration=2500] - Duración mínima en ms
 */

const SplashScreen = ({ onComplete, minDuration = 2500 }) => {
    injectSplashStyles();

    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('Inicializando terminal de mercado...');
    const [currentIcon, setCurrentIcon] = useState('🖥️');
    const [isComplete, setIsComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [systemLogs, setSystemLogs] = useState([]);
    const [showCursor, setShowCursor] = useState(true);
    
    const startTimeRef = useRef(Date.now());
    const mountedRef = useRef(true);
    const canvasRef = useRef(null);

    // Sistema de partículas para el canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let animationId;
        let particles = [];
        let time = 0;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        class Particle {
            constructor(w, h) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.2 - 0.5;
                this.opacity = Math.random() * 0.3;
                this.color = Math.random() > 0.7 ? '#10B981' : '#3B82F6';
            }
            
            update(w, h) {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0) this.x = w;
                if (this.x > w) this.x = 0;
                if (this.y < 0) this.y = h;
                if (this.y > h) this.y = 0;
            }
            
            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.shadowBlur = 4;
                ctx.shadowColor = this.color;
            }
        }
        
        const initParticles = (w, h) => {
            particles = [];
            const particleCount = Math.min(60, Math.floor(w * h / 15000));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(w, h));
            }
        };
        
        const drawGrid = (ctx, w, h) => {
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
            ctx.lineWidth = 0.5;
            
            for (let x = 0; x < w; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        };
        
        const drawCircuitPattern = (ctx, w, h, time) => {
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
            ctx.lineWidth = 0.8;
            
            // Circuito decorativo en esquinas
            const corners = [
                { x: 30, y: 30 },
                { x: w - 30, y: 30 },
                { x: 30, y: h - 30 },
                { x: w - 30, y: h - 30 }
            ];
            
            corners.forEach(corner => {
                ctx.beginPath();
                ctx.moveTo(corner.x, corner.y);
                ctx.lineTo(corner.x + 40, corner.y);
                ctx.lineTo(corner.x + 40, corner.y + 20);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(corner.x, corner.y);
                ctx.lineTo(corner.x, corner.y + 40);
                ctx.lineTo(corner.x + 20, corner.y + 40);
                ctx.stroke();
            });
        };
        
        const animate = () => {
            if (!ctx) return;
            
            const w = canvas.width;
            const h = canvas.height;
            
            if (w === 0 || h === 0) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#0B0E14';
            ctx.fillRect(0, 0, w, h);
            
            const gradient = ctx.createLinearGradient(0, 0, w, h);
            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(1, '#0B0E14');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
            
            drawGrid(ctx, w, h);
            drawCircuitPattern(ctx, w, h, time);
            
            particles.forEach(particle => {
                particle.update(w, h);
                particle.draw(ctx);
            });
            
            time += 0.016;
            animationId = requestAnimationFrame(animate);
        };
        
        resizeCanvas();
        initParticles(canvas.width, canvas.height);
        animate();
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles(canvas.width, canvas.height);
        });
        
        return () => {
            if (animationId) cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    // Pasos de carga para sistema de neumáticos
    const loadingSteps = [
        { progress: 5, message: 'Iniciando terminal de mercado...', icon: '🖥️', log: '[INFO] CHValueGrowth Terminal v3.0 iniciando...' },
        { progress: 12, message: 'Verificando módulos de seguridad...', icon: '🔒', log: '[SEC] Verificación de integridad del sistema... OK' },
        { progress: 20, message: 'Conectando a base de datos de mercado...', icon: '🗄️', log: '[DB] Conectando a PostgreSQL cluster... CONECTADO' },
        { progress: 28, message: 'Cargando catálogo de neumáticos...', icon: '🛞', log: '[CATALOG] Cargando 2,450+ productos... COMPLETADO' },
        { progress: 36, message: 'Sincronizando precios en tiempo real...', icon: '💰', log: '[API] Sincronizando precios de 15+ proveedores... OK' },
        { progress: 44, message: 'Analizando tendencias de mercado...', icon: '📈', log: '[ANALYTICS] Procesando datos históricos... 44%' },
        { progress: 52, message: 'Actualizando inventario global...', icon: '📦', log: '[INVENTORY] Actualizando stock en 8 almacenes...' },
        { progress: 60, message: 'Optimizando motor de búsqueda...', icon: '🔍', log: '[SEARCH] Indexando catálogo de productos...' },
        { progress: 68, message: 'Cargando paneles de control...', icon: '📊', log: '[DASHBOARD] Inicializando widgets analíticos...' },
        { progress: 76, message: 'Estableciendo conexiones seguras...', icon: '🔐', log: '[SECURE] Estableciendo túneles SSL/TLS... OK' },
        { progress: 84, message: 'Preparando módulo de reportes...', icon: '📑', log: '[REPORTS] Cargando plantillas de reportes...' },
        { progress: 92, message: 'Verificación final del sistema...', icon: '✅', log: '[FINAL] Validando integridad del sistema...' },
        { progress: 100, message: '¡Sistema listo para operar!', icon: '🚀', log: '[READY] CHValueGrowth Terminal lista. Bienvenido.' }
    ];

    const simulateLoading = useCallback(async () => {
        try {
            for (let i = 0; i < loadingSteps.length; i++) {
                const step = loadingSteps[i];
                if (!mountedRef.current) return;
                
                setCurrentStep(i);
                setProgress(step.progress);
                setLoadingMessage(step.message);
                setCurrentIcon(step.icon);
                setSystemLogs(prev => [...prev, step.log]);
                
                // Tiempo variable para cada paso
                const stepDelay = i === loadingSteps.length - 1 ? 300 : 150;
                await new Promise(resolve => setTimeout(resolve, stepDelay));
            }

            const elapsed = Date.now() - startTimeRef.current;
            if (elapsed < minDuration && mountedRef.current) {
                await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
            }

            if (mountedRef.current) {
                setIsComplete(true);
                if (onComplete) onComplete();
            }
        } catch (error) {
            console.error('Error durante la carga:', error);
            if (mountedRef.current) {
                setLoadingMessage('Error crítico. Reiniciando sistema...');
                setCurrentIcon('⚠️');
                setSystemLogs(prev => [...prev, '[ERROR] Fallo en la inicialización. Reiniciando...']);
                setTimeout(() => {
                    if (mountedRef.current) simulateLoading();
                }, 3000);
            }
        }
    }, [minDuration, onComplete]);

    useEffect(() => {
        mountedRef.current = true;
        simulateLoading();
        
        // Cursor blink effect
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        
        return () => {
            mountedRef.current = false;
            clearInterval(cursorInterval);
        };
    }, [simulateLoading]);

    // Variantes de animación
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.5 }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.3 }
        }
    };

    const terminalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    const tireVariants = {
        animate: {
            rotate: [0, 360],
            transition: {
                duration: 15,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const logVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            
            {/* Canvas de fondo con partículas */}
            <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />
            
            {/* Efecto de gradiente superpuesto */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#0B0E14] via-[#0f172a] to-[#0B0E14] opacity-90 z-0" />
            
            {/* Círculos decorativos flotantes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-5 animate-pulse" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-5 animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] opacity-5 animate-pulse delay-2000" />
            </div>
            
            {/* Contenido principal */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-6">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full max-w-[520px]"
                >
                    {/* Terminal Glassmorphism */}
                    <motion.div
                        variants={terminalVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative group"
                    >
                        {/* Efecto de glow externo */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500" />
                        
                        {/* Terminal principal */}
                        <div className="relative glass-terminal rounded-2xl shadow-2xl overflow-hidden animate-border-glow">
                            
                            {/* Barra superior estilo terminal */}
                            <div className="relative">
                                <div className="flex items-center gap-2 px-5 pt-4 pb-3 bg-black/50 border-b border-emerald-500/20">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-all cursor-pointer" />
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-all cursor-pointer" />
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full hover:bg-emerald-400 transition-all cursor-pointer" />
                                    </div>
                                    <div className="flex-1 text-center">
                                        <span className="text-[9px] text-emerald-500/50 terminal-text tracking-wider">
                                            CHValueGrowth@terminal:~/splash
                                        </span>
                                    </div>
                                    <div className="w-16 flex justify-end">
                                        <span className="text-[8px] text-emerald-500/30 terminal-text">
                                            {new Date().toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Efecto de escaneo */}
                                <div className="scan-effect absolute inset-0 pointer-events-none" />
                            </div>
                            
                            {/* Contenido del terminal */}
                            <div className="p-6 md:p-7">
                                
                                {/* Header con logo animado */}
                                <div className="text-center mb-6">
                                    <motion.div
                                        variants={tireVariants}
                                        animate="animate"
                                        className="relative inline-block mb-4"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
                                        <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                            <span className="text-4xl">{currentIcon}</span>
                                        </div>
                                    </motion.div>
                                    
                                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent mb-1 terminal-text">
                                        CHValueGrowth
                                    </h1>
                                    <p className="text-emerald-400/60 text-[10px] terminal-text tracking-wider flex items-center justify-center gap-2">
                                        <span>TERMINAL DE MERCADO v3.0</span>
                                        <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                        <span>SECURE BOOT</span>
                                    </p>
                                </div>
                                
                                {/* Sistema de logs en tiempo real */}
                                <div className="mb-5 bg-black/50 rounded-xl p-3 border border-emerald-500/20 h-32 overflow-y-auto font-mono">
                                    <AnimatePresence>
                                        {systemLogs.slice(-5).map((log, idx) => (
                                            <motion.div
                                                key={idx}
                                                variants={logVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                transition={{ delay: idx * 0.05 }}
                                                className="text-[9px] text-emerald-400/70 py-0.5 flex items-start gap-2"
                                            >
                                                <span className="text-emerald-500/30">$</span>
                                                <span>{log}</span>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {showCursor && (
                                        <span className="inline-block w-2 h-3 bg-emerald-500 ml-1 cursor-blink" />
                                    )}
                                </div>
                                
                                {/* Barra de progreso estilo terminal */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] text-emerald-400/60 terminal-text">
                                        <span className="flex items-center gap-1">
                                            <span className="text-emerald-500">▶</span>
                                            PROCESANDO
                                        </span>
                                        <span className="font-mono font-bold text-emerald-400">{Math.floor(progress)}%</span>
                                    </div>
                                    <div className="relative h-2 bg-black/50 rounded-full overflow-hidden border border-emerald-500/20">
                                        <motion.div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                                            style={{ width: `${progress}%` }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                        </motion.div>
                                    </div>
                                    
                                    {/* Mensaje de estado dinámico */}
                                    <motion.div
                                        key={loadingMessage}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center mt-3"
                                    >
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                            <span className="text-sm">{currentIcon}</span>
                                            <span className="text-[10px] text-emerald-400 terminal-text">
                                                {loadingMessage}
                                            </span>
                                            {progress < 100 && (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-2 h-2 border border-emerald-500 border-t-transparent rounded-full"
                                                />
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                                
                                {/* Métricas del sistema */}
                                <div className="mt-5 pt-4 border-t border-emerald-500/20">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-2 rounded-lg bg-black/30 border border-emerald-500/20">
                                            <p className="text-[8px] text-emerald-500/50 terminal-text uppercase tracking-wider">Base de Datos</p>
                                            <p className="text-[10px] text-emerald-400 font-mono font-bold">PostgreSQL 15</p>
                                        </div>
                                        <div className="text-center p-2 rounded-lg bg-black/30 border border-emerald-500/20">
                                            <p className="text-[8px] text-emerald-500/50 terminal-text uppercase tracking-wider">API Gateway</p>
                                            <p className="text-[10px] text-emerald-400 font-mono font-bold">RESTful v2.1</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Footer con información del sistema */}
                                <div className="mt-4 text-center">
                                    <div className="flex justify-center gap-3 text-[8px] text-emerald-500/40 terminal-text">
                                        <span className="flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                            ONLINE
                                        </span>
                                        <span>🔒 TLS 1.3</span>
                                        <span>⚡ REAL-TIME</span>
                                        <span>📡 WEBSOCKET</span>
                                    </div>
                                    <div className="flex justify-center gap-3 text-[7px] text-emerald-500/30 mt-2 terminal-text">
                                        <span>© 2026 CHValueGrowth</span>
                                        <span>Terminal de Mercado v3.0.0</span>
                                        <span>Build: 2026.04.07</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Barra de estado inferior */}
                            <div className="bg-black/50 border-t border-emerald-500/20 px-5 py-2 flex justify-between text-[8px] text-emerald-500/40 terminal-text">
                                <span>🔋 SISTEMA OPERATIVO</span>
                                <span>💾 MEM: 2.4GB/8GB</span>
                                <span>🔄 AUTO-UPDATE: ON</span>
                                <span>🌐 LATENCIA: 23ms</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default SplashScreen;