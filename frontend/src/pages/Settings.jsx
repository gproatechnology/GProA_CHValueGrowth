import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Shield, Palette, Bell, CreditCard, Globe, Key, HelpCircle,
    Save, Download, ChevronLeft, ChevronRight, Lock, Mail, Phone,
    MapPin, Building, Moon, Sun, Monitor, AlertCircle, CheckCircle,
    Smartphone, Database, RefreshCw, Trash2, Award, Star, Heart,
    LogOut, History, Clock, FileText, Printer, ExternalLink,
    Plus, Minus, Copy, Eye, EyeOff, X, AlertTriangle
} from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saving, setSaving] = useState(false);
    const [theme, setTheme] = useState('dark');
    const [notificationsEnabled, setNotificationsEnabled] = useState({
        email: true,
        push: true,
        sms: false,
        marketing: false,
        stockAlerts: true,
        priceAlerts: true,
        orderUpdates: true
    });
    const [profileData, setProfileData] = useState({
        fullName: 'Carlos Rafael Heredia Loperena',
        email: 'carlos@neumatiq.com',
        phone: '+52 448 127 4392',
        company: 'NeumatiQ',
        address: 'Av. Paseo de la Reforma 123, CDMX',
        position: 'CEO & Fundador',
        timezone: 'America/Mexico_City',
        language: 'es'
    });
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [apiKeys, setApiKeys] = useState([
        { id: 1, name: 'API Key Principal', key: 'sk_live_4eR9tY8uI2oP1aZ7xV3c', createdAt: '2026-01-15', lastUsed: '2026-04-09' },
        { id: 2, name: 'API Key Secundaria', key: 'sk_test_7wQ3eR5tY8uI2oP1aZ', createdAt: '2026-02-20', lastUsed: '2026-04-08' }
    ]);
    const [webhookUrl, setWebhookUrl] = useState('https://api.neumatiq.com/webhooks/inventory');
    const [paymentMethods, setPaymentMethods] = useState([
        { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
        { id: 2, type: 'Mastercard', last4: '8888', expiry: '08/25', isDefault: false }
    ]);
    const [connectedDevices, setConnectedDevices] = useState([
        { id: 1, name: 'Windows PC - Chrome', lastActive: 'Hace 2 minutos', location: 'CDMX, México', isCurrent: true },
        { id: 2, name: 'MacBook - Safari', lastActive: 'Hace 3 horas', location: 'CDMX, México', isCurrent: false },
        { id: 3, name: 'iPhone - App', lastActive: 'Ayer', location: 'Guadalajara, México', isCurrent: false }
    ]);
    const [showNewApiKeyModal, setShowNewApiKeyModal] = useState(false);
    const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [backupCodes, setBackupCodes] = useState(['XXXX-XXXX-XXXX', 'YYYY-YYYY-YYYY', 'ZZZZ-ZZZZ-ZZZZ']);
    const [showBackupCodes, setShowBackupCodes] = useState(false);
    const [activityLog, setActivityLog] = useState([
        { action: 'Inicio de sesión', date: '2026-04-09 08:30:00', ip: '192.168.1.1', status: 'success' },
        { action: 'Cambio de contraseña', date: '2026-04-08 15:20:00', ip: '192.168.1.1', status: 'success' },
        { action: 'Actualización de perfil', date: '2026-04-07 10:15:00', ip: '192.168.1.1', status: 'success' },
        { action: 'Intento de inicio fallido', date: '2026-04-06 22:30:00', ip: '10.0.0.1', status: 'failed' }
    ]);

    // Calcular fortaleza de contraseña
    useEffect(() => {
        const calculateStrength = (pass) => {
            let score = 0;
            if (pass.length >= 8) score += 20;
            if (pass.length >= 12) score += 15;
            if (/[A-Z]/.test(pass)) score += 20;
            if (/[a-z]/.test(pass)) score += 10;
            if (/[0-9]/.test(pass)) score += 15;
            if (/[^A-Za-z0-9]/.test(pass)) score += 20;
            return Math.min(score, 100);
        };
        setPasswordStrength(calculateStrength(securityData.newPassword));
    }, [securityData.newPassword]);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setHasUnsavedChanges(false);
            setSuccessMessage('Configuración guardada exitosamente');
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        }, 1500);
    };

    const handleInputChange = () => setHasUnsavedChanges(true);

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
        handleInputChange();
    };

    const handleSecurityChange = (field, value) => {
        setSecurityData(prev => ({ ...prev, [field]: value }));
        handleInputChange();
    };

    const handleUpdatePassword = () => {
        if (!securityData.currentPassword) {
            alert('Ingrese su contraseña actual');
            return;
        }
        if (securityData.newPassword !== securityData.confirmPassword) {
            alert('Las contraseñas nuevas no coinciden');
            return;
        }
        if (securityData.newPassword.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        alert('Contraseña actualizada correctamente');
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        handleInputChange();
    };

    const handleAddApiKey = () => {
        const newKey = {
            id: apiKeys.length + 1,
            name: `API Key ${apiKeys.length + 1}`,
            key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
            createdAt: new Date().toISOString().split('T')[0],
            lastUsed: 'Nunca'
        };
        setApiKeys([...apiKeys, newKey]);
        setShowNewApiKeyModal(false);
        handleInputChange();
        setSuccessMessage('API Key generada exitosamente');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleRevokeApiKey = (id) => {
        setApiKeys(apiKeys.filter(key => key.id !== id));
        handleInputChange();
        setSuccessMessage('API Key revocada exitosamente');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleAddPaymentMethod = () => {
        const newPayment = {
            id: paymentMethods.length + 1,
            type: 'Nueva Tarjeta',
            last4: '1234',
            expiry: '12/28',
            isDefault: false
        };
        setPaymentMethods([...paymentMethods, newPayment]);
        setShowNewPaymentModal(false);
        handleInputChange();
        setSuccessMessage('Método de pago agregado');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleRemovePaymentMethod = (id) => {
        setPaymentMethods(paymentMethods.filter(p => p.id !== id));
        handleInputChange();
    };

    const handleSetDefaultPayment = (id) => {
        setPaymentMethods(paymentMethods.map(p => ({ ...p, isDefault: p.id === id })));
        handleInputChange();
    };

    const handleRevokeDevice = (id) => {
        setConnectedDevices(connectedDevices.filter(d => d.id !== id));
        handleInputChange();
        setSuccessMessage('Dispositivo revocado exitosamente');
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleGenerateBackupCodes = () => {
        const newCodes = Array(8).fill().map(() => Math.random().toString(36).substring(2, 10).toUpperCase());
        setBackupCodes(newCodes);
        setShowBackupCodes(true);
        handleInputChange();
    };

    const strengthColor = passwordStrength < 40 ? '#ef4444' : passwordStrength < 70 ? '#f59e0b' : '#10b981';
    const strengthText = passwordStrength < 40 ? 'DÉBIL' : passwordStrength < 70 ? 'MEDIA' : 'FUERTE';

    const tabs = [
        { id: 'profile', label: 'Perfil', icon: User, description: 'Información personal y cuenta' },
        { id: 'security', label: 'Seguridad', icon: Shield, description: 'Contraseña y autenticación' },
        { id: 'appearance', label: 'Apariencia', icon: Palette, description: 'Tema y visualización' },
        { id: 'notifications', label: 'Notificaciones', icon: Bell, description: 'Alertas y recordatorios' },
        { id: 'payments', label: 'Pagos', icon: CreditCard, description: 'Métodos de pago' },
        { id: 'integration', label: 'Integraciones', icon: Key, description: 'API y conexiones' },
        { id: 'activity', label: 'Actividad', icon: History, description: 'Registro de acciones' },
        { id: 'support', label: 'Soporte', icon: HelpCircle, description: 'Ayuda y recursos' }
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    return (
        <div className="min-h-screen bg-[#0B1E3A]">
            <div className="max-w-7xl mx-auto space-y-6 p-6">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-gradient-to-r from-[#0B1E3A]/90 to-[#102A4C]/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-[#1E90FF]/20"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1E90FF]/10 to-[#3B82F6]/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#1E90FF]/5 to-[#3B82F6]/5 rounded-full blur-3xl"></div>
                    
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-[#1E90FF] to-[#3B82F6] rounded-xl shadow-md">
                                <SettingsIcon className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">
                                Configuración
                            </h1>
                        </div>
                        <p className="text-md text-[#AFC8E6] font-medium">
                            Personaliza tu experiencia y gestiona las preferencias de tu cuenta
                        </p>
                    </div>
                </motion.header>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <motion.aside
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="lg:col-span-1 space-y-2"
                    >
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-lg shadow-[#1E90FF]/25'
                                        : 'bg-[#102A4C]/80 backdrop-blur-md border border-[#1E90FF]/20 hover:bg-[#1E4D7A] text-[#AFC8E6]'
                                }`}
                            >
                                <div className={`p-2 rounded-lg transition-all ${
                                    activeTab === tab.id 
                                        ? 'bg-white/20' 
                                        : 'bg-[#1E90FF]/20 group-hover:bg-[#1E90FF]/30'
                                }`}>
                                    <tab.icon className={`w-5 h-5 ${
                                        activeTab === tab.id ? 'text-white' : 'text-[#1E90FF]'
                                    }`} />
                                </div>
                                <div className="text-left flex-1">
                                    <p className={`font-semibold text-sm ${
                                        activeTab === tab.id ? 'text-white' : 'text-[#EAF3FF]'
                                    }`}>
                                        {tab.label}
                                    </p>
                                    <p className={`text-xs mt-0.5 ${
                                        activeTab === tab.id ? 'text-white/70' : 'text-[#AFC8E6]'
                                    }`}>
                                        {tab.description}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </motion.aside>

                    {/* Main Content */}
                    <motion.main
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3 bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl shadow-lg border border-[#1E90FF]/20 overflow-hidden relative"
                    >
                        {/* Action Bar */}
                        <div className="sticky top-0 z-10 bg-[#0B1E3A]/80 backdrop-blur-md border-b border-[#1E90FF]/20 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {hasUnsavedChanges && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded-lg text-amber-400 text-xs font-medium border border-amber-500/30"
                                    >
                                        <AlertCircle className="w-3 h-3" />
                                        Cambios sin guardar
                                    </motion.div>
                                )}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                disabled={!hasUnsavedChanges || saving}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:shadow-[#1E90FF]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Guardar Cambios
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {/* Dynamic Content */}
                        <div className="p-6">
                            <AnimatePresence mode="popLayout">
                                {/* Perfil */}
                                {activeTab === 'profile' && (
                                    <motion.section
                                        key="profile"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, x: -50 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            <div className="flex-shrink-0">
                                                <div className="relative">
                                                    <img 
                                                        src="/assets/Heredia_logo_circular.png"
                                                        alt="Carlos Heredia" 
                                                        className="w-24 h-24 rounded-2xl object-contain shadow-lg border-2 border-[#1E90FF]/50 bg-gradient-to-br from-[#163A6B] to-[#102A4C] ring-2 ring-[#1E90FF]/30"
                                                    />
                                                    <button className="absolute -bottom-2 -right-2 p-1.5 bg-[#102A4C] rounded-full shadow-md border border-[#1E90FF]/30">
                                                        <Camera className="w-3 h-3 text-[#1E90FF]" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <motion.div variants={fadeInUp}>
                                                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1 flex items-center gap-2">
                                                            <User className="w-3 h-3 text-[#1E90FF]" />
                                                            Nombre Completo
                                                        </label>
                                                        <input 
                                                            id="fullName"
                                                            name="fullName"
                                                            type="text" 
                                                            value={profileData.fullName}
                                                            onChange={(e) => handleProfileChange('fullName', e.target.value)}
                                                            className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent shadow-inner text-[#EAF3FF] placeholder-[#AFC8E6]/50 transition-all"
                                                        />
                                                    </motion.div>
                                                    <motion.div variants={fadeInUp}>
                                                        <label htmlFor="email" className="block text-sm font-semibold text-[#AFC8E6] mb-1 flex items-center gap-2">
                                                            <Mail className="w-3 h-3 text-[#1E90FF]" />
                                                            Correo Electrónico
                                                        </label>
                                                        <input 
                                                            id="email"
                                                            name="email"
                                                            type="email" 
                                                            value={profileData.email}
                                                            onChange={(e) => handleProfileChange('email', e.target.value)}
                                                            className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent shadow-inner text-[#EAF3FF] placeholder-[#AFC8E6]/50 transition-all"
                                                        />
                                                    </motion.div>
                                                    <motion.div variants={fadeInUp}>
                                                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1 flex items-center gap-2">
                                                            <Phone className="w-3 h-3 text-[#1E90FF]" />
                                                            Teléfono
                                                        </label>
                                                        <input 
                                                            type="tel" 
                                                            value={profileData.phone}
                                                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                                                            className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent shadow-inner text-[#EAF3FF] placeholder-[#AFC8E6]/50 transition-all"
                                                        />
                                                    </motion.div>
                                                    <motion.div variants={fadeInUp}>
                                                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1 flex items-center gap-2">
                                                            <Building className="w-3 h-3 text-[#1E90FF]" />
                                                            Empresa
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            value={profileData.company}
                                                            onChange={(e) => handleProfileChange('company', e.target.value)}
                                                            className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent shadow-inner text-[#EAF3FF] placeholder-[#AFC8E6]/50 transition-all"
                                                        />
                                                    </motion.div>
                                                    <motion.div variants={fadeInUp}>
                                                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1 flex items-center gap-2">
                                                            <Briefcase className="w-3 h-3 text-[#1E90FF]" />
                                                            Cargo
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            value={profileData.position}
                                                            onChange={(e) => handleProfileChange('position', e.target.value)}
                                                            className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent shadow-inner text-[#EAF3FF] placeholder-[#AFC8E6]/50 transition-all"
                                                        />
                                                    </motion.div>
                                                    <motion.div variants={fadeInUp}>
                                                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1 flex items-center gap-2">
                                                            <Globe className="w-3 h-3 text-[#1E90FF]" />
                                                            Zona Horaria
                                                        </label>
                                                        <select id="timezone" name="timezone"
                                                            value={profileData.timezone}
                                                            onChange={(e) => handleProfileChange('timezone', e.target.value)}
                                                            className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                                        >
                                                            <option value="America/Mexico_City">CDMX (GMT-6)</option>
                                                            <option value="America/Bogota">Bogotá (GMT-5)</option>
                                                            <option value="America/Panama">Panamá (GMT-5)</option>
                                                        </select>
                                                    </motion.div>
                                                    <motion.div variants={fadeInUp} className="md:col-span-2">
                                                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1 flex items-center gap-2">
                                                            <MapPin className="w-3 h-3 text-[#1E90FF]" />
                                                            Dirección
                                                        </label>
                                                        <input id="address" name="address"
                                                            type="text" 
                                                            value={profileData.address}
                                                            onChange={(e) => handleProfileChange('address', e.target.value)}
                                                            className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent shadow-inner text-[#EAF3FF] placeholder-[#AFC8E6]/50 transition-all"
                                                        />
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.section>
                                )}

                                {/* Seguridad */}
                                {activeTab === 'security' && (
                                    <motion.section
                                        key="security"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, x: -50 }}
                                        className="space-y-6"
                                    >
                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <Lock className="w-5 h-5 text-[#1E90FF]" />
                                                Cambiar Contraseña
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Contraseña Actual</label>
                                                    <input 
                                                        type="password" 
                                                        value={securityData.currentPassword}
                                                        onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-[#EAF3FF]" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Nueva Contraseña</label>
                                                    <input 
                                                        type="password" 
                                                        value={securityData.newPassword}
                                                        onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-[#EAF3FF]" 
                                                    />
                                                    {securityData.newPassword && (
                                                        <div className="mt-2">
                                                            <div className="flex items-center justify-between text-[10px] mb-1">
                                                                <span className="text-[#AFC8E6]">Fortaleza:</span>
                                                                <span style={{ color: strengthColor }}>{strengthText}</span>
                                                            </div>
                                                            <div className="h-1 bg-[#0B1E3A] rounded-full overflow-hidden">
                                                                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${passwordStrength}%`, backgroundColor: strengthColor }} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Confirmar Nueva Contraseña</label>
                                                    <input 
                                                        type="password" 
                                                        value={securityData.confirmPassword}
                                                        onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-[#EAF3FF]" 
                                                    />
                                                    {securityData.confirmPassword && securityData.newPassword !== securityData.confirmPassword && (
                                                        <p className="text-red-400 text-[10px] mt-1">Las contraseñas no coinciden</p>
                                                    )}
                                                </div>
                                                <motion.button 
                                                    whileHover={{ scale: 1.02 }} 
                                                    onClick={handleUpdatePassword}
                                                    className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:shadow-[#1E90FF]/25 transition-all"
                                                >
                                                    Actualizar Contraseña
                                                </motion.button>
                                            </div>
                                        </motion.div>

                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <Shield className="w-5 h-5 text-[#1E90FF]" />
                                                Autenticación de Dos Factores
                                            </h3>
                                            <div className="flex items-center justify-between flex-wrap gap-4">
                                                <div>
                                                    <p className="text-[#AFC8E6]">Añade una capa extra de seguridad a tu cuenta</p>
                                                    <p className="text-sm text-[#AFC8E6]/70 mt-1">Protege tu cuenta con verificación en dos pasos</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <motion.button whileHover={{ scale: 1.02 }} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold shadow-md">
                                                        Configurar 2FA
                                                    </motion.button>
                                                    <motion.button whileHover={{ scale: 1.02 }} onClick={handleGenerateBackupCodes} className="px-4 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 text-[#1E90FF] rounded-lg font-semibold">
                                                        Generar Códigos de Respaldo
                                                    </motion.button>
                                                </div>
                                            </div>
                                            {showBackupCodes && (
                                                <div className="mt-4 p-4 bg-[#0B1E3A]/80 rounded-lg border border-[#1E90FF]/20">
                                                    <p className="text-sm text-[#AFC8E6] mb-2">Códigos de respaldo (guárdalos en un lugar seguro):</p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {backupCodes.map((code, idx) => (
                                                            <code key={idx} className="bg-[#0B1E3A] p-2 rounded text-center text-[#1E90FF] font-mono text-sm">{code}</code>
                                                        ))}
                                                    </div>
                                                    <button className="mt-3 text-xs text-[#1E90FF] hover:text-[#3B82F6]">Copiar códigos</button>
                                                </div>
                                            )}
                                        </motion.div>

                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <Smartphone className="w-5 h-5 text-[#1E90FF]" />
                                                Dispositivos Conectados
                                            </h3>
                                            <div className="space-y-3">
                                                {connectedDevices.map((device) => (
                                                    <div key={device.id} className="flex items-center justify-between py-2 border-b border-[#1E90FF]/20 last:border-0">
                                                        <div className="flex items-center gap-3">
                                                            <Smartphone className="w-4 h-4 text-[#AFC8E6]" />
                                                            <div>
                                                                <p className="text-[#EAF3FF] text-sm">{device.name}</p>
                                                                <p className="text-[10px] text-[#AFC8E6]">{device.location} • {device.lastActive}</p>
                                                            </div>
                                                            {device.isCurrent && (
                                                                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">Actual</span>
                                                            )}
                                                        </div>
                                                        {!device.isCurrent && (
                                                            <button onClick={() => handleRevokeDevice(device.id)} className="text-xs text-red-400 hover:text-red-300">Revocar</button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </motion.section>
                                )}

                                {/* Apariencia */}
                                {activeTab === 'appearance' && (
                                    <motion.section
                                        key="appearance"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, x: -50 }}
                                        className="space-y-6"
                                    >
                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <Palette className="w-5 h-5 text-[#1E90FF]" />
                                                Tema de la Aplicación
                                            </h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                {[
                                                    { id: 'light', label: 'Claro', icon: Sun },
                                                    { id: 'dark', label: 'Oscuro', icon: Moon },
                                                    { id: 'system', label: 'Sistema', icon: Monitor }
                                                ].map(themeOption => (
                                                    <button
                                                        key={themeOption.id}
                                                        onClick={() => {
                                                            setTheme(themeOption.id);
                                                            handleInputChange();
                                                        }}
                                                        className={`p-4 rounded-xl text-center transition-all ${
                                                            theme === themeOption.id
                                                                ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-lg'
                                                                : 'bg-[#0B1E3A]/60 border border-[#1E90FF]/30 hover:bg-[#1E4D7A] text-[#AFC8E6]'
                                                        }`}
                                                    >
                                                        <themeOption.icon className={`w-6 h-6 mx-auto mb-2 ${theme === themeOption.id ? 'text-white' : 'text-[#1E90FF]'}`} />
                                                        <p className="text-sm font-medium">{themeOption.label}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>

                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <Award className="w-5 h-5 text-[#1E90FF]" />
                                                Preferencias de Visualización
                                            </h3>
                                            <div className="space-y-3">
                                                <label className="flex items-center justify-between cursor-pointer">
                                                    <span className="text-[#AFC8E6]">Modo compacto</span>
                                                    <div className="relative">
                                                        <input type="checkbox" className="sr-only peer" onChange={handleInputChange} />
                                                        <div className="w-10 h-5 bg-[#0B1E3A] rounded-full peer peer-checked:bg-[#1E90FF] after:bg-white border border-[#1E90FF]/30"></div>
                                                    </div>
                                                </label>
                                                <label className="flex items-center justify-between cursor-pointer">
                                                    <span className="text-[#AFC8E6]">Mostrar animaciones</span>
                                                    <div className="relative">
                                                        <input type="checkbox" defaultChecked className="sr-only peer" onChange={handleInputChange} />
                                                        <div className="w-10 h-5 bg-[#0B1E3A] rounded-full peer peer-checked:bg-[#1E90FF] after:bg-white border border-[#1E90FF]/30"></div>
                                                    </div>
                                                </label>
                                                <label className="flex items-center justify-between cursor-pointer">
                                                    <span className="text-[#AFC8E6]">Modo de alto contraste</span>
                                                    <div className="relative">
                                                        <input type="checkbox" className="sr-only peer" onChange={handleInputChange} />
                                                        <div className="w-10 h-5 bg-[#0B1E3A] rounded-full peer peer-checked:bg-[#1E90FF] after:bg-white border border-[#1E90FF]/30"></div>
                                                    </div>
                                                </label>
                                            </div>
                                        </motion.div>
                                    </motion.section>
                                )}

                                {/* Notificaciones */}
                                {activeTab === 'notifications' && (
                                    <motion.section
                                        key="notifications"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, x: -50 }}
                                        className="space-y-4"
                                    >
                                        {[
                                            { key: 'email', label: 'Notificaciones por email', desc: 'Recibe alertas importantes en tu correo', icon: Mail },
                                            { key: 'push', label: 'Notificaciones push', desc: 'Alertas en tiempo real en tu navegador', icon: Bell },
                                            { key: 'sms', label: 'Notificaciones SMS', desc: 'Mensajes de texto para alertas críticas', icon: Smartphone },
                                            { key: 'stockAlerts', label: 'Alertas de stock', desc: 'Notificaciones cuando el stock es bajo', icon: AlertCircle },
                                            { key: 'priceAlerts', label: 'Alertas de precio', desc: 'Cambios significativos en precios', icon: TrendingUp },
                                            { key: 'orderUpdates', label: 'Actualizaciones de pedidos', desc: 'Estado de tus órdenes', icon: Package },
                                            { key: 'marketing', label: 'Ofertas y promociones', desc: 'Recibe información sobre promociones especiales', icon: Star }
                                        ].map(notif => (
                                            <motion.div key={notif.key} variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-4 border border-[#1E90FF]/20">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-[#1E90FF]/20 rounded-lg">
                                                            <notif.icon className="w-4 h-4 text-[#1E90FF]" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-[#EAF3FF]">{notif.label}</p>
                                                            <p className="text-xs text-[#AFC8E6]">{notif.desc}</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={notificationsEnabled[notif.key]}
                                                            onChange={() => {
                                                                setNotificationsEnabled(prev => ({ ...prev, [notif.key]: !prev[notif.key] }));
                                                                handleInputChange();
                                                            }}
                                                            className="sr-only peer" 
                                                        />
                                                        <div className="w-10 h-5 bg-[#0B1E3A] rounded-full peer peer-checked:bg-[#1E90FF] after:bg-white border border-[#1E90FF]/30"></div>
                                                    </label>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.section>
                                )}

                                {/* Pagos */}
                                {activeTab === 'payments' && (
                                    <motion.section
                                        key="payments"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, x: -50 }}
                                        className="space-y-6"
                                    >
                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-[#1E90FF]" />
                                                Métodos de Pago
                                            </h3>
                                            <div className="space-y-3">
                                                {paymentMethods.map((card) => (
                                                    <div key={card.id} className="flex items-center justify-between p-3 bg-[#0B1E3A]/80 rounded-xl border border-[#1E90FF]/20">
                                                        <div className="flex items-center gap-3">
                                                            <CreditCard className="w-6 h-6 text-[#1E90FF]" />
                                                            <div>
                                                                <p className="font-semibold text-[#EAF3FF]">{card.type} •••• {card.last4}</p>
                                                                <p className="text-xs text-[#AFC8E6]">Expira {card.expiry}</p>
                                                            </div>
                                                            {card.isDefault && (
                                                                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">Predeterminado</span>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {!card.isDefault && (
                                                                <button onClick={() => handleSetDefaultPayment(card.id)} className="text-xs text-[#1E90FF] hover:text-[#3B82F6]">Establecer como predeterminado</button>
                                                            )}
                                                            <button onClick={() => handleRemovePaymentMethod(card.id)} className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <motion.button 
                                                whileHover={{ scale: 1.02 }} 
                                                onClick={() => setShowNewPaymentModal(true)}
                                                className="mt-4 w-full py-3 bg-[#1E90FF]/20 text-[#1E90FF] rounded-lg font-semibold border border-[#1E90FF]/30 hover:bg-[#1E90FF]/30 transition"
                                            >
                                                + Agregar nuevo método de pago
                                            </motion.button>
                                        </motion.div>

                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <History className="w-5 h-5 text-[#1E90FF]" />
                                                Historial de Facturación
                                            </h3>
                                            <div className="space-y-2">
                                                {[
                                                    { date: '2026-04-01', amount: '$1,299', status: 'Pagado', invoice: 'INV-001' },
                                                    { date: '2026-03-01', amount: '$1,299', status: 'Pagado', invoice: 'INV-002' },
                                                    { date: '2026-02-01', amount: '$1,299', status: 'Pagado', invoice: 'INV-003' }
                                                ].map((invoice, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-[#0B1E3A]/80 rounded-lg border border-[#1E90FF]/20">
                                                        <div>
                                                            <p className="text-sm font-semibold text-[#EAF3FF]">{invoice.invoice}</p>
                                                            <p className="text-xs text-[#AFC8E6]">{invoice.date}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-[#1E90FF]">{invoice.amount}</p>
                                                            <p className="text-xs text-emerald-400">{invoice.status}</p>
                                                        </div>
                                                        <button className="text-xs text-[#1E90FF] hover:text-[#3B82F6] flex items-center gap-1">
                                                            <Download className="w-3 h-3" /> PDF
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </motion.section>
                                )}

                                {/* Integraciones */}
                                {activeTab === 'integration' && (
                                    <motion.section
                                        key="integration"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, x: -50 }}
                                        className="space-y-6"
                                    >
                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-[#EAF3FF] flex items-center gap-2">
                                                    <Key className="w-5 h-5 text-[#1E90FF]" />
                                                    API Keys
                                                </h3>
                                                <motion.button 
                                                    whileHover={{ scale: 1.02 }}
                                                    onClick={() => setShowNewApiKeyModal(true)}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white rounded-lg text-xs font-semibold shadow-md"
                                                >
                                                    + Nueva API Key
                                                </motion.button>
                                            </div>
                                            <div className="space-y-3">
                                                {apiKeys.map((key) => (
                                                    <div key={key.id} className="p-3 bg-[#0B1E3A]/80 rounded-xl border border-[#1E90FF]/20">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="font-semibold text-[#EAF3FF]">{key.name}</p>
                                                            <div className="flex gap-2">
                                                                <button className="text-xs text-[#1E90FF] hover:text-[#3B82F6]">Regenerar</button>
                                                                <button onClick={() => handleRevokeApiKey(key.id)} className="text-xs text-red-400 hover:text-red-300">Revocar</button>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-xs font-mono text-[#AFC8E6] bg-[#0B1E3A] p-1 rounded">{key.key}</code>
                                                            <button className="p-1 hover:bg-[#1E4D7A] rounded transition-colors">
                                                                <Copy className="w-3 h-3 text-[#AFC8E6]" />
                                                            </button>
                                                        </div>
                                                        <p className="text-[10px] text-[#AFC8E6] mt-2">Creada: {key.createdAt} • Último uso: {key.lastUsed}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <Globe className="w-5 h-5 text-[#1E90FF]" />
                                                Webhooks
                                            </h3>
                                            <div className="space-y-2">
                                                <input 
                                                    type="url" 
                                                    placeholder="https://tu-dominio.com/webhook"
                                                    value={webhookUrl}
                                                    onChange={(e) => handleWebhookChange(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-[#EAF3FF] placeholder-[#AFC8E6]/50"
                                                />
                                                <p className="text-xs text-[#AFC8E6]">Endpoint para recibir notificaciones de eventos del sistema</p>
                                                <div className="flex gap-2 mt-2">
                                                    <button className="px-3 py-1.5 bg-[#1E90FF]/20 text-[#1E90FF] rounded-lg text-xs">Probar Webhook</button>
                                                    <button className="px-3 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 text-[#AFC8E6] rounded-lg text-xs">Ver historial</button>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <Database className="w-5 h-5 text-[#1E90FF]" />
                                                Exportación de Datos
                                            </h3>
                                            <div className="space-y-3">
                                                <button className="w-full py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#AFC8E6] hover:bg-[#1E4D7A] transition flex items-center justify-center gap-2">
                                                    <Download className="w-4 h-4" /> Exportar mis datos (JSON)
                                                </button>
                                                <button className="w-full py-2 bg-[#0B1E3A]/80 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/10 transition flex items-center justify-center gap-2">
                                                    <Trash2 className="w-4 h-4" /> Solicitar eliminación de cuenta
                                                </button>
                                            </div>
                                        </motion.div>
                                    </motion.section>
                                )}

                                {/* Actividad */}
                                {activeTab === 'activity' && (
                                    <motion.section
                                        key="activity"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, x: -50 }}
                                        className="space-y-6"
                                    >
                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <History className="w-5 h-5 text-[#1E90FF]" />
                                                Registro de Actividad Reciente
                                            </h3>
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {activityLog.map((log, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 p-3 bg-[#0B1E3A]/80 rounded-lg border border-[#1E90FF]/20">
                                                        <div className={`p-1.5 rounded-lg ${log.status === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                                            {log.status === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-[#EAF3FF]">{log.action}</p>
                                                            <p className="text-xs text-[#AFC8E6]">{log.date} • IP: {log.ip}</p>
                                                        </div>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                            {log.status === 'success' ? 'Exitoso' : 'Fallido'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="mt-4 w-full py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#AFC8E6] hover:bg-[#1E4D7A] transition flex items-center justify-center gap-2">
                                                <Download className="w-4 h-4" /> Exportar historial
                                            </button>
                                        </motion.div>
                                    </motion.section>
                                )}

                                {/* Soporte */}
                                {activeTab === 'support' && (
                                    <motion.section
                                        key="support"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, x: -50 }}
                                        className="space-y-6"
                                    >
                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <HelpCircle className="w-5 h-5 text-[#1E90FF]" />
                                                Centro de Ayuda
                                            </h3>
                                            <div className="space-y-3">
                                                <button className="w-full text-left p-3 bg-[#0B1E3A]/80 rounded-lg border border-[#1E90FF]/20 hover:bg-[#1E4D7A] transition">
                                                    <p className="font-semibold text-[#EAF3FF]">📚 Documentación</p>
                                                    <p className="text-xs text-[#AFC8E6]">Guías y tutoriales para usar la plataforma</p>
                                                </button>
                                                <button className="w-full text-left p-3 bg-[#0B1E3A]/80 rounded-lg border border-[#1E90FF]/20 hover:bg-[#1E4D7A] transition">
                                                    <p className="font-semibold text-[#EAF3FF]">💬 Soporte técnico</p>
                                                    <p className="text-xs text-[#AFC8E6]">Contacta a nuestro equipo de soporte</p>
                                                </button>
                                                <button className="w-full text-left p-3 bg-[#0B1E3A]/80 rounded-lg border border-[#1E90FF]/20 hover:bg-[#1E4D7A] transition">
                                                    <p className="font-semibold text-[#EAF3FF]">🐛 Reportar problema</p>
                                                    <p className="text-xs text-[#AFC8E6]">Notifica errores o problemas técnicos</p>
                                                </button>
                                                <button className="w-full text-left p-3 bg-[#0B1E3A]/80 rounded-lg border border-[#1E90FF]/20 hover:bg-[#1E4D7A] transition">
                                                    <p className="font-semibold text-[#EAF3FF]">💡 Sugerencias</p>
                                                    <p className="text-xs text-[#AFC8E6]">Comparte tus ideas para mejorar la plataforma</p>
                                                </button>
                                            </div>
                                        </motion.div>

                                        <motion.div variants={fadeInUp} className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-5 border border-amber-500/30">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                                    <Heart className="w-5 h-5 text-amber-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-bold text-amber-400 mb-1">¿Necesitas ayuda inmediata?</h4>
                                                    <p className="text-sm text-amber-300 mb-3">Nuestro equipo está disponible 24/7 para asistirte</p>
                                                    <div className="flex gap-3">
                                                        <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition">
                                                            Contactar soporte
                                                        </button>
                                                        <button className="px-4 py-2 bg-[#0B1E3A]/80 border border-amber-500/30 text-amber-400 rounded-lg font-semibold">
                                                            Ver FAQ
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div variants={fadeInUp} className="bg-[#0B1E3A]/60 rounded-xl p-5 border border-[#1E90FF]/20">
                                            <h3 className="text-lg font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                                                <Globe className="w-5 h-5 text-[#1E90FF]" />
                                                Información del Sistema
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                                                    <span className="text-[#AFC8E6]">Versión</span>
                                                    <span className="text-[#EAF3FF] font-semibold">v2.0.0</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                                                    <span className="text-[#AFC8E6]">Última actualización</span>
                                                    <span className="text-[#EAF3FF]">2026-04-09</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                                                    <span className="text-[#AFC8E6]">Entorno</span>
                                                    <span className="text-[#EAF3FF]">Producción</span>
                                                </div>
                                                <div className="flex justify-between py-2">
                                                    <span className="text-[#AFC8E6]">ID de Sesión</span>
                                                    <span className="text-[#AFC8E6] font-mono text-xs">sess_8f9h3j2k1l4m5n6b7v8c</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.section>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.main>
                </div>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 border-t border-[#1E90FF]/20"
                >
                    <p className="text-sm text-[#AFC8E6]">
                        NeumatiQ Settings · Preferencias guardadas localmente · v2.0 · © 2026
                    </p>
                </motion.footer>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccessToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-4 right-4 bg-emerald-500/90 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3"
                    >
                        <CheckCircle className="w-5 h-5" />
                        <span>{successMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* New API Key Modal */}
            <AnimatePresence>
                {showNewApiKeyModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowNewApiKeyModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-md w-full p-6 border border-[#1E90FF]/30 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-[#EAF3FF] mb-4">Generar Nueva API Key</h3>
                            <input
                                type="text"
                                placeholder="Nombre de la API Key"
                                className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] mb-4"
                            />
                            <select className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] mb-4">
                                <option>Acceso completo</option>
                                <option>Solo lectura</option>
                                <option>Inventario</option>
                            </select>
                            <div className="flex gap-3">
                                <button onClick={handleAddApiKey} className="flex-1 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-medium">
                                    Generar
                                </button>
                                <button onClick={() => setShowNewApiKeyModal(false)} className="flex-1 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#AFC8E6] border border-[#1E90FF]/30">
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* New Payment Method Modal */}
            <AnimatePresence>
                {showNewPaymentModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowNewPaymentModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-md w-full p-6 border border-[#1E90FF]/30 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-[#EAF3FF] mb-4">Agregar Método de Pago</h3>
                            <input
                                type="text"
                                placeholder="Número de tarjeta"
                                className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] mb-3"
                            />
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <input type="text" placeholder="MM/AA" className="px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF]" />
                                <input type="text" placeholder="CVV" className="px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Nombre del titular"
                                className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] mb-4"
                            />
                            <div className="flex gap-3">
                                <button onClick={handleAddPaymentMethod} className="flex-1 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-medium">
                                    Agregar
                                </button>
                                <button onClick={() => setShowNewPaymentModal(false)} className="flex-1 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#AFC8E6] border border-[#1E90FF]/30">
                                    Cancelar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Componentes auxiliares
const SettingsIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Camera = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Briefcase = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const TrendingUp = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const Package = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

export default Settings;