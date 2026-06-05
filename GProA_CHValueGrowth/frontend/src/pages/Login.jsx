import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, AlertCircle, LogIn, Zap } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem('chvalue_token', Date.now().toString());
        setLoading(false);
        navigate('/');
      }, 1200);
      return;
    }

    setError('Credenciales incorrectas');
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/fONDO lOGIN.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-sm relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#0A1628]/95 backdrop-blur-xl rounded-2xl p-6 border border-[#1E90FF]/20 shadow-2xl shadow-[#1E90FF]/5"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(30, 144, 255, 0.1) inset',
          }}
        >
          <div className="text-center mb-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#0A1628] to-[#0F2040] rounded-full flex items-center justify-center shadow-lg border border-[#1E90FF]/30 overflow-hidden"
            >
              <img 
                src="/assets/neumatiq-logo.png" 
                alt="NeumatiQ Logo" 
                className="w-full h-full object-contain rounded-full" 
              />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold bg-gradient-to-r from-white to-[#AFC8E6] bg-clip-text text-transparent mb-1"
            >
              NeumatiQ
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[#AFC8E6]/60 font-mono text-xs uppercase tracking-wider"
            >
              Terminal Seguro
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="username" className="block mb-2 text-xs font-bold uppercase tracking-wider text-[#38BDF8] font-mono">
                IDENTIFICADOR
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#38BDF8]/70" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0A1628]/80 border border-[#1E90FF]/20 rounded-lg font-mono text-white placeholder-[#AFC8E6]/50 focus:ring-2 focus:ring-[#1E90FF]/50 focus:border-[#1E90FF] transition-all duration-300"
                  disabled={loading}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="password" className="block mb-2 text-xs font-bold uppercase tracking-wider text-[#38BDF8] font-mono">
                CLAVE DE ACCESO
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#38BDF8]/70" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="admin123"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0A1628]/80 border border-[#1E90FF]/20 rounded-lg font-mono text-white placeholder-[#AFC8E6]/50 focus:ring-2 focus:ring-[#1E90FF]/50 focus:border-[#1E90FF] transition-all duration-300"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#38BDF8]/60 hover:text-[#38BDF8] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-400/50 rounded-lg backdrop-blur text-red-200 font-mono text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(30, 144, 255, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 bg-gradient-to-r from-[#1E90FF] to-[#00D4FF] hover:from-[#1677D7] hover:to-[#00B0D9] text-white font-bold text-base rounded-lg shadow-xl hover:shadow-2xl focus:ring-4 focus:ring-[#1E90FF]/50 transition-all duration-300 flex items-center justify-center gap-2 font-mono uppercase tracking-wide backdrop-blur disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Acceder Terminal
                </>
              )}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-6 border-t border-[#1E90FF]/20"
          >
            <div className="p-4 rounded-lg bg-[#0A1628]/60 border border-[#1E90FF]/20 backdrop-blur">
              <p className="text-xs font-bold text-[#38BDF8]/80 text-center mb-3 uppercase tracking-wider font-mono">
                Credenciales Prueba
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="text-center p-2 bg-blue-500/10 rounded border border-blue-500/30">
                  <code className="block font-bold text-blue-300">admin</code>
                  <span className="text-blue-400 text-[10px] uppercase">Usuario</span>
                </div>
                <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/30">
                  <code className="block font-bold text-green-300">admin123</code>
                  <span className="text-green-400 text-[10px] uppercase">Clave</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;