import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Lock, User, AlertCircle, LogIn, Shield,
  TrendingUp, Activity, Cpu, Zap, Fingerprint, CheckCircle,
  Wifi, Database, Cloud, Server, HardDrive, Terminal
} from 'lucide-react';

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ username: false, password: false });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    // Verificar soporte biométrico
    useEffect(() => {
        setIsBiometricSupported(
            window.PublicKeyCredential && 
            typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
        );
    }, []);

    // Animación de progreso para loading
    useEffect(() => {
        let interval;
        if (loading) {
            interval = setInterval(() => {
                setProgressValue(prev => {
                    if (prev >= 100) return 0;
                    return prev + 2;
                });
            }, 20);
        } else {
            setProgressValue(0);
        }
        return () => clearInterval(interval);
    }, [loading]);

    // Seguimiento del mouse para efecto de gradiente
    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Canvas avanzado con gráficas de mercado
    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let animationId;
        let time = 0;
        let particles = [];
        
        const updateDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // Datos de mercado de neumáticos
        const marketData = {
            michelin: [245, 248, 243, 250, 247, 252, 249, 251, 248, 253, 250, 256],
            bridgestone: [235, 238, 240, 237, 242, 239, 241, 244, 240, 245, 243, 248],
            goodyear: [225, 228, 230, 227, 232, 229, 231, 234, 230, 236, 233, 238],
            pirelli: [255, 258, 253, 260, 257, 262, 259, 261, 258, 263, 260, 266]
        };

        // Sistema de partículas
        class Particle {
            constructor(w, h) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.3;
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
                ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Inicializar partículas
        const initParticles = (w, h) => {
            particles = [];
            const particleCount = Math.min(80, Math.floor(w * h / 20000));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(w, h));
            }
        };

        // Dibujar grid tecnológico
        const drawTechGrid = (ctx, w, h) => {
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.06)';
            ctx.lineWidth = 0.5;
            
            // Grid principal
            for (let x = 0; x < w; x += 50) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += 50) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
            
            // Grid secundario más denso
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.03)';
            for (let x = 0; x < w; x += 25) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += 25) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
        };

        // Dibujar gráfica de líneas con área
        const drawAreaChart = (ctx, w, h, data, color, offsetY = 0, alpha = 0.6) => {
            if (!data.length) return;
            
            const step = w / (data.length - 1);
            const maxVal = Math.max(...data);
            const minVal = Math.min(...data);
            const range = maxVal - minVal || 1;
            
            // Área bajo la curva
            ctx.beginPath();
            data.forEach((value, index) => {
                const x = index * step;
                const y = h * 0.25 + offsetY - ((value - minVal) / range) * 80;
                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.lineTo(w, h * 0.25 + offsetY);
            ctx.lineTo(0, h * 0.25 + offsetY);
            ctx.closePath();
            ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
            ctx.fill();
            
            // Línea
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = color;
            data.forEach((value, index) => {
                const x = index * step;
                const y = h * 0.25 + offsetY - ((value - minVal) / range) * 80;
                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            
            // Puntos de datos
            ctx.shadowBlur = 0;
            data.forEach((value, index) => {
                const x = index * step;
                const y = h * 0.25 + offsetY - ((value - minVal) / range) * 80;
                ctx.beginPath();
                ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.shadowBlur = 4;
                ctx.shadowColor = color;
            });
            ctx.shadowBlur = 0;
        };

        // Dibujar anillos de frecuencia
        const drawFrequencyRings = (ctx, w, h, time) => {
            const centerX = w * 0.85;
            const centerY = h * 0.85;
            
            for (let i = 0; i < 3; i++) {
                const radius = 40 + i * 25 + Math.sin(time * 2) * 5;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 - i * 0.03})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            
            // Pulso central
            ctx.beginPath();
            ctx.arc(centerX, centerY, 8 + Math.sin(time * 4) * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, ${0.3 + Math.sin(time * 4) * 0.1})`;
            ctx.fill();
        };

        // Dibujar métricas en tiempo real
        const drawMetrics = (ctx, w, h, time) => {
            const metrics = [
                { label: 'LATENCIA', value: `${Math.floor(15 + Math.sin(time) * 5)}ms` },
                { label: 'THROUGHPUT', value: `${Math.floor(850 + Math.sin(time * 1.3) * 50)}MB/s` },
                { label: 'UPTIME', value: '99.98%' }
            ];
            
            ctx.font = 'bold 8px "Courier New", monospace';
            metrics.forEach((metric, idx) => {
                const x = w - 120;
                const y = 30 + idx * 18;
                ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
                ctx.fillText(`${metric.label}:`, x, y);
                ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
                ctx.fillText(metric.value, x + 65, y);
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
            
            // Fondo oscuro con gradiente
            ctx.fillStyle = '#0B0E14';
            ctx.fillRect(0, 0, w, h);
            
            const gradient = ctx.createLinearGradient(0, 0, w, h);
            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(1, '#0B0E14');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
            
            // Grid tecnológico
            drawTechGrid(ctx, w, h);
            
            // Gráficas de mercado
            const offsetY = Math.sin(time * 0.3) * 8;
            drawAreaChart(ctx, w, h, marketData.michelin, '#10B981', offsetY, 0.08);
            drawAreaChart(ctx, w, h, marketData.bridgestone, '#3B82F6', offsetY + 15, 0.06);
            drawAreaChart(ctx, w, h, marketData.goodyear, '#8B5CF6', offsetY + 30, 0.05);
            drawAreaChart(ctx, w, h, marketData.pirelli, '#EC4899', offsetY + 45, 0.04);
            
            // Anillos de frecuencia
            drawFrequencyRings(ctx, w, h, time);
            
            // Métricas
            drawMetrics(ctx, w, h, time);
            
            // Partículas
            particles.forEach(particle => {
                particle.update(w, h);
                particle.draw(ctx);
            });
            
            time += 0.016;
            animationId = requestAnimationFrame(animate);
        };

        updateDimensions();
        initParticles(canvas.width, canvas.height);
        animate();
        
        const handleResize = () => {
            updateDimensions();
            initParticles(canvas.width, canvas.height);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            if (animationId) cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Calcular fortaleza de contraseña
    const calculateStrength = useCallback((pass) => {
        let score = 0;
        if (pass.length >= 8) score += 20;
        if (pass.length >= 12) score += 15;
        if (/[A-Z]/.test(pass)) score += 20;
        if (/[a-z]/.test(pass)) score += 10;
        if (/[0-9]/.test(pass)) score += 15;
        if (/[^A-Za-z0-9]/.test(pass)) score += 20;
        return Math.min(score, 100);
    }, []);

    useEffect(() => {
        setPasswordStrength(calculateStrength(credentials.password));
    }, [credentials.password, calculateStrength]);

    const handleKeyPress = (e) => setCapsLockOn(e.getModifierState('CapsLock'));
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };
    
    const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }));
    
    const validateField = (field) => {
        if (!touched[field]) return null;
        if (!credentials[field]?.trim()) return 'Campo requerido';
        if (field === 'password' && credentials.password.length < 6) return 'Mínimo 6 caracteres';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ username: true, password: true });
        
        if (!credentials.username.trim() || !credentials.password.trim()) {
            setError('Complete todos los campos');
            return;
        }
        
        setLoading(true);
        setError('');
        
        // Simulación de autenticación
        setTimeout(() => {
            if (credentials.username === 'admin' && credentials.password === 'gproa2024') {
                const user = { name: 'Administrador', role: 'Super Admin', avatar: '👨‍💼' };
                localStorage.setItem('chvalue_token', 'secure-token-2026');
                localStorage.setItem('chvalue_user', JSON.stringify(user));
                sessionStorage.setItem('chvalue_token', 'secure-token-2026');
                onLogin(user);
            } else {
                setError('Credenciales incorrectas. Verifique usuario y contraseña.');
            }
            setLoading(false);
        }, 1800);
    };

    const handleBiometricAuth = async () => {
        if (!isBiometricSupported) return;
        setLoading(true);
        setTimeout(() => {
            setCredentials({ username: 'admin', password: 'gproa2024' });
            setLoading(false);
            handleSubmit(new Event('submit'));
        }, 1000);
    };

    const usernameError = validateField('username');
    const passwordError = validateField('password');
    
    const strengthColor = passwordStrength < 40 ? '#ef4444' : passwordStrength < 70 ? '#f59e0b' : '#10b981';
    const strengthText = passwordStrength < 40 ? 'BAJA' : passwordStrength < 70 ? 'MEDIA' : 'ALTA';

    return (
        <div className="relative min-h-screen overflow-hidden font-['Inter', 'Courier New', monospace]">
            
            {/* Canvas de fondo con gráficas */}
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 w-full h-full" />
            
            {/* Gradiente dinámico que sigue al mouse */}
            <div 
                className="fixed pointer-events-none z-0"
                style={{
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                    left: cursorPosition.x - 300,
                    top: cursorPosition.y - 300,
                    transition: 'all 0.2s ease-out'
                }}
            />
            
            {/* Contenedor principal */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
                
                {/* Tarjeta de Login */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                        duration: 0.6,
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                    }}
                    className="w-full max-w-[440px]"
                >
                    {/* Efecto de glow externo */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition duration-500" />
                        
                        {/* Tarjeta Glassmorphism */}
                        <div className="relative bg-black/90 backdrop-blur-2xl rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden">
                            
                            {/* Barra superior estilo terminal */}
                            <div className="relative">
                                <div className="flex items-center gap-2 px-5 pt-4 pb-3 bg-black/80 border-b border-emerald-500/20">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-all cursor-pointer" />
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-all cursor-pointer" />
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full hover:bg-emerald-400 transition-all cursor-pointer" />
                                    </div>
                                    <div className="flex-1 text-center">
                                        <span className="text-[9px] text-emerald-500/50 font-mono tracking-wider">CHValueGrowth@terminal:~</span>
                                    </div>
                                    <div className="w-16" />
                                </div>
                                
                                {/* Barra de progreso de sistema */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                            </div>
                            
                            {/* Contenido principal */}
                            <div className="p-6 md:p-7">
                                
                                {/* Header */}
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-center mb-7"
                                >
                                    <div className="relative inline-block mb-4">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl blur-md opacity-60 animate-pulse" />
                                        <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Terminal size={28} className="text-white" />
                                        </div>
                                    </div>
                                    
                                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400 bg-clip-text text-transparent mb-1.5">
                                        CHValueGrowth
                                    </h1>
                                    <p className="text-emerald-400/60 text-[10px] font-mono tracking-wider flex items-center justify-center gap-2">
                                        <Activity size={10} />
                                        <span>TERMINAL DE MERCADO · SECURE ACCESS v3.0</span>
                                        <Wifi size={10} />
                                    </p>
                                    <div className="w-12 h-px bg-gradient-to-r from-emerald-500 to-transparent mx-auto mt-3" />
                                </motion.div>
                                
                                {/* Formulario */}
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    
                                    {/* Campo Usuario */}
                                    <motion.div
                                        initial={{ x: -15, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <label className="block text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2 font-mono">
                                            <User size="11" className="inline mr-1" />
                                            USUARIO
                                        </label>
                                        <div className="relative group">
                                            <User size="16" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-400 transition-all duration-300" />
                                            <input
                                                type="text"
                                                name="username"
                                                value={credentials.username}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur('username')}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border-2 font-mono text-sm
                                                    ${usernameError && touched.username
                                                        ? 'border-red-500/50 focus:border-red-500'
                                                        : 'border-emerald-500/30 focus:border-emerald-500'
                                                    }
                                                    text-white placeholder-emerald-500/30 outline-none transition-all duration-300
                                                    focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] focus:bg-black/70`}
                                                placeholder="admin"
                                                disabled={loading}
                                                autoComplete="username"
                                            />
                                        </div>
                                        <AnimatePresence>
                                            {usernameError && touched.username && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -3 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-red-400 text-[10px] mt-1.5 ml-1 flex items-center gap-1 font-mono"
                                                >
                                                    <AlertCircle size="10" /> {usernameError}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                    
                                    {/* Campo Contraseña */}
                                    <motion.div
                                        initial={{ x: -15, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label className="block text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2 font-mono">
                                            <Lock size="11" className="inline mr-1" />
                                            CONTRASEÑA
                                        </label>
                                        <div className="relative group">
                                            <Lock size="16" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-400 transition-all duration-300" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={credentials.password}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur('password')}
                                                onKeyUp={handleKeyPress}
                                                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-black/50 border-2 font-mono text-sm
                                                    ${passwordError && touched.password
                                                        ? 'border-red-500/50 focus:border-red-500'
                                                        : 'border-emerald-500/30 focus:border-emerald-500'
                                                    }
                                                    text-white placeholder-emerald-500/30 outline-none transition-all duration-300
                                                    focus:shadow-[0_0_15px_rgba(16,185,129,0.15)] focus:bg-black/70`}
                                                placeholder="gproa2024"
                                                disabled={loading}
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500/50 hover:text-emerald-400 transition-all duration-300"
                                            >
                                                {showPassword ? <EyeOff size="16" /> : <Eye size="16" />}
                                            </button>
                                        </div>
                                        
                                        {/* Indicadores */}
                                        <div className="mt-2 space-y-1.5">
                                            {capsLockOn && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-yellow-400 text-[10px] flex items-center gap-1 font-mono"
                                                >
                                                    <AlertCircle size="10" /> CAPS LOCK ACTIVADO
                                                </motion.p>
                                            )}
                                            
                                            {credentials.password.length > 0 && (
                                                <div className="space-y-1">
                                                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{ 
                                                                backgroundColor: strengthColor,
                                                                width: `${passwordStrength}%`,
                                                                boxShadow: `0 0 6px ${strengthColor}`
                                                            }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${passwordStrength}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] text-gray-500 font-mono">FORTALEZA:</span>
                                                        <span className="text-[9px] font-mono font-bold" style={{ color: strengthColor }}>{strengthText}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <AnimatePresence>
                                            {passwordError && touched.password && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -3 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-red-400 text-[10px] mt-1.5 ml-1 flex items-center gap-1 font-mono"
                                                >
                                                    <AlertCircle size="10" /> {passwordError}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                    
                                    {/* Opciones */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.25 }}
                                        className="flex items-center justify-between"
                                    >
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="w-3.5 h-3.5 rounded border-emerald-500/50 bg-black/50 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                                                />
                                            </div>
                                            <span className="text-[10px] text-emerald-400/70 group-hover:text-emerald-400 transition font-mono">RECORDARME</span>
                                        </label>
                                        <button
                                            type="button"
                                            className="text-[10px] text-emerald-400/70 hover:text-emerald-400 transition-colors duration-200 font-mono"
                                            onClick={() => setError('Contacte al administrador del sistema')}
                                        >
                                            ¿OLVIDASTE TU CONTRASEÑA?
                                        </button>
                                    </motion.div>
                                    
                                    {/* Mensaje de error */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="bg-red-500/10 border border-red-500/30 rounded-xl p-3"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle size="14" className="text-red-400 flex-shrink-0" />
                                                    <span className="text-red-300 text-xs font-mono">{error}</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    
                                    {/* Botones de acción */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-3"
                                    >
                                        {/* Botón principal */}
                                        <motion.button
                                            whileHover={{ scale: loading ? 1 : 1.01 }}
                                            whileTap={{ scale: loading ? 1 : 0.99 }}
                                            type="submit"
                                            disabled={loading}
                                            className="group relative w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                            
                                            <span className="relative z-10 flex items-center gap-2 text-sm font-mono tracking-wider">
                                                {loading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        <span>AUTENTICANDO...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <LogIn size="16" />
                                                        <span>INGRESAR AL SISTEMA</span>
                                                        <Zap size="12" className="opacity-50" />
                                                    </>
                                                )}
                                            </span>
                                        </motion.button>
                                        
                                        {/* Botón biométrico */}
                                        {isBiometricSupported && (
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                type="button"
                                                onClick={handleBiometricAuth}
                                                disabled={loading}
                                                className="w-full py-3 rounded-xl font-mono text-xs transition-all duration-300
                                                    flex items-center justify-center gap-2
                                                    bg-black/50 border border-emerald-500/30 text-emerald-400/70
                                                    hover:bg-black/70 hover:border-emerald-500/50 hover:text-emerald-400"
                                            >
                                                <Fingerprint size="14" />
                                                <span>ACCESO BIOMÉTRICO</span>
                                            </motion.button>
                                        )}
                                    </motion.div>
                                </form>
                                
                                {/* Barra de progreso durante loading */}
                                {loading && (
                                    <motion.div
                                        className="mt-4 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                                        style={{ width: `${progressValue}%` }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressValue}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                )}
                                
                                {/* Credenciales de demostración */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-5 pt-4 border-t border-emerald-500/20"
                                >
                                    <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20">
                                        <p className="text-[9px] text-emerald-400/50 text-center mb-2 flex items-center justify-center gap-1 font-mono">
                                            <Shield size="10" />
                                            CREDENCIALES DE DEMOSTRACIÓN
                                        </p>
                                        <div className="flex flex-col sm:flex-row justify-center gap-2 text-[9px] font-mono">
                                            <div className="flex items-center justify-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10">
                                                <code className="text-emerald-300">admin</code>
                                                <span className="text-emerald-500/30">/</span>
                                                <code className="text-emerald-300">gproa2024</code>
                                                <span className="text-emerald-500/50 ml-0.5">(ADMIN)</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                {/* Footer con métricas del sistema */}
                                <div className="mt-4 text-center">
                                    <div className="flex justify-center gap-3 text-[8px] text-emerald-500/40 font-mono">
                                        <span className="flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                            ONLINE
                                        </span>
                                        <span>🔒 SECURE</span>
                                        <span>📡 LIVE</span>
                                        <span>⚡ 23ms</span>
                                    </div>
                                    <p className="text-[8px] text-emerald-500/30 mt-2 font-mono">
                                        © 2026 CHValueGrowth · TERMINAL DE MERCADO v3.0
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;