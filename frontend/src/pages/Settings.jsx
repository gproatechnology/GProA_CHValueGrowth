import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, Building, Shield, Lock, Smartphone,
    Monitor, Moon, Sun, Palette, Type, Bell, CreditCard,
    Globe, Clock, DollarSign, Key, Webhook, HelpCircle,
    FileText, Save, Download, Upload, Copy, Check, AlertCircle,
    Plus, Trash2, Star, LogOut
} from 'lucide-react';

/**
 * Settings - Panel de configuración del sistema
 * @component
 */

const Settings = () => {
    // --------------------------------------------------------------
    // 1. Estados principales
    // --------------------------------------------------------------
    const [activeSection, setActiveSection] = useState('profile');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Account & Profile
    const [profile, setProfile] = useState({
        name: 'Administrador CHValue',
        email: 'admin@chvaluegrowth.com',
        role: 'Super Admin',
        avatar: '👤',
        phone: '+52 55 1234 5678',
        company: 'CHValueGrowth México',
    });

    // Privacy & Security
    const [twoFactor, setTwoFactor] = useState(false);
    const [passwordChange, setPasswordChange] = useState({ current: '', new: '', confirm: '' });
    const [passwordErrors, setPasswordErrors] = useState({ current: '', new: '', confirm: '' });
    const [activeSessions] = useState([
        { id: 1, device: 'Chrome en Windows', location: 'Ciudad de México', lastActive: '2026-03-27 14:30', current: true },
        { id: 2, device: 'Safari en iPhone', location: 'Guadalajara', lastActive: '2026-03-26 09:15', current: false },
    ]);

    // Appearance
    const [theme, setTheme] = useState('dark');
    const [accentColor, setAccentColor] = useState('blue');
    const [fontSize, setFontSize] = useState('medium');

    // Notifications
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        pushAlerts: true,
        priceThreshold: true,
        weeklyDigest: false,
        orderUpdates: true,
    });

    // Payment Methods
    const [paymentMethods, setPaymentMethods] = useState([
        { id: 1, type: 'Visa', last4: '4242', expiry: '12/28', default: true },
        { id: 2, type: 'Mastercard', last4: '5555', expiry: '09/27', default: false },
    ]);
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });

    // Language & Region
    const [language, setLanguage] = useState('es-MX');
    const [timezone, setTimezone] = useState('America/Mexico_City');
    const [currencyFormat, setCurrencyFormat] = useState('MXN');

    // Integration & API
    const [apiKeys, setApiKeys] = useState([
        { id: 1, name: 'Production Key', key: 'chv_live_abc123xyz', createdAt: '2026-01-15', lastUsed: '2026-03-27' },
    ]);
    const [webhookUrl, setWebhookUrl] = useState('https://api.chvaluegrowth.com/webhook');
    const [copiedKeyId, setCopiedKeyId] = useState(null);

    // Help & Support
    const [supportTicket, setSupportTicket] = useState({ subject: '', message: '' });

    // --------------------------------------------------------------
    // 2. Utilidades
    // --------------------------------------------------------------
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const markUnsaved = () => setHasUnsavedChanges(true);

    const validatePassword = () => {
        const errors = { current: '', new: '', confirm: '' };
        if (passwordChange.new && passwordChange.new.length < 6) errors.new = 'Mínimo 6 caracteres';
        if (passwordChange.new !== passwordChange.confirm) errors.confirm = 'Las contraseñas no coinciden';
        setPasswordErrors(errors);
        return !errors.new && !errors.confirm;
    };

    const handlePasswordChange = (field, value) => {
        setPasswordChange(prev => ({ ...prev, [field]: value }));
        markUnsaved();
        if (field === 'new' || field === 'confirm') validatePassword();
    };

    const updatePassword = () => {
        if (!validatePassword()) return;
        // Simular cambio de contraseña
        showToast('Contraseña actualizada correctamente', 'success');
        setPasswordChange({ current: '', new: '', confirm: '' });
        markUnsaved();
    };

    // Guardar todas las configuraciones
    const saveAllSettings = useCallback(async () => {
        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log('Guardando configuración:', {
            profile, twoFactor, theme, accentColor, fontSize, notifications, paymentMethods,
            language, timezone, currencyFormat, apiKeys, webhookUrl
        });
        setHasUnsavedChanges(false);
        showToast('Configuración guardada exitosamente', 'success');
        setSaving(false);
    }, [profile, twoFactor, theme, accentColor, fontSize, notifications, paymentMethods,
        language, timezone, currencyFormat, apiKeys, webhookUrl]);

    // API Keys
    const generateApiKey = () => {
        const newKey = `chv_${Math.random().toString(36).substring(2, 18)}`;
        const newId = Date.now();
        setApiKeys([...apiKeys, { id: newId, name: `API Key ${apiKeys.length + 1}`, key: newKey, createdAt: new Date().toISOString().slice(0, 10), lastUsed: 'Nunca' }]);
        markUnsaved();
        showToast('Nueva API key generada', 'success');
    };

    const revokeApiKey = (id) => {
        setApiKeys(apiKeys.filter(k => k.id !== id));
        markUnsaved();
        showToast('API key revocada', 'info');
    };

    const copyApiKey = (key, id) => {
        navigator.clipboard.writeText(key);
        setCopiedKeyId(id);
        setTimeout(() => setCopiedKeyId(null), 2000);
        showToast('API key copiada al portapapeles', 'success');
    };

    // Payment Methods
    const setDefaultPayment = (id) => {
        setPaymentMethods(paymentMethods.map(pm => ({ ...pm, default: pm.id === id })));
        markUnsaved();
    };

    const removePayment = (id) => {
        setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
        markUnsaved();
        showToast('Método de pago eliminado', 'info');
    };

    const addPaymentMethod = () => {
        if (!newCard.number || !newCard.expiry || !newCard.cvc) return;
        const newId = Date.now();
        const last4 = newCard.number.slice(-4);
        setPaymentMethods([...paymentMethods, { id: newId, type: 'Visa', last4, expiry: newCard.expiry, default: false }]);
        setShowAddPayment(false);
        setNewCard({ number: '', expiry: '', cvc: '' });
        markUnsaved();
        showToast('Tarjeta agregada correctamente', 'success');
    };

    // --------------------------------------------------------------
    // 3. Renderizado de secciones con animaciones
    // --------------------------------------------------------------
    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">{profile.avatar}</div>
                            <div><h3 className="text-white font-semibold text-xl">{profile.name}</h3><p className="text-sm text-gray-400">{profile.role}</p></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: 'Nombre completo', value: profile.name, field: 'name', icon: User },
                                { label: 'Correo electrónico', value: profile.email, field: 'email', icon: Mail, type: 'email' },
                                { label: 'Teléfono', value: profile.phone, field: 'phone', icon: Phone, type: 'tel' },
                                { label: 'Empresa', value: profile.company, field: 'company', icon: Building }
                            ].map(field => (
                                <div key={field.field}>
                                    <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1"><field.icon size={12} /> {field.label}</label>
                                    <input type={field.type || 'text'} value={profile[field.field]} onChange={(e) => { setProfile({ ...profile, [field.field]: e.target.value }); markUnsaved(); }} className="neumorph-input w-full" />
                                </div>
                            ))}
                        </div>
                        <button className="neumorph-btn text-blue-400 text-sm flex items-center gap-2 w-fit"><Smartphone size={14} /> Cambiar avatar</button>
                    </motion.div>
                );

            case 'security':
                return (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-[#1a1b1e]/50">
                            <div><p className="text-white font-medium flex items-center gap-2"><Shield size={18} /> Autenticación de dos factores (2FA)</p><p className="text-xs text-gray-400">Añade una capa extra de seguridad</p></div>
                            <button onClick={() => { setTwoFactor(!twoFactor); markUnsaved(); }} className={`w-11 h-6 rounded-full transition-all ${twoFactor ? 'bg-blue-600' : 'bg-gray-700'} shadow-neumorph-inset`}>
                                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${twoFactor ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                        <div className="border-t border-gray-800 pt-4">
                            <p className="text-white font-medium mb-3 flex items-center gap-2"><Lock size={18} /> Cambiar contraseña</p>
                            <div className="space-y-3">
                                <input type="password" placeholder="Contraseña actual" className="neumorph-input w-full" value={passwordChange.current} onChange={(e) => handlePasswordChange('current', e.target.value)} />
                                <input type="password" placeholder="Nueva contraseña" className="neumorph-input w-full" value={passwordChange.new} onChange={(e) => handlePasswordChange('new', e.target.value)} />
                                {passwordErrors.new && <p className="text-red-400 text-xs">{passwordErrors.new}</p>}
                                <input type="password" placeholder="Confirmar nueva contraseña" className="neumorph-input w-full" value={passwordChange.confirm} onChange={(e) => handlePasswordChange('confirm', e.target.value)} />
                                {passwordErrors.confirm && <p className="text-red-400 text-xs">{passwordErrors.confirm}</p>}
                                <button onClick={updatePassword} className="neumorph-btn text-blue-400 text-sm">Actualizar contraseña</button>
                            </div>
                        </div>
                        <div><p className="text-white font-medium mb-3 flex items-center gap-2"><Monitor size={18} /> Sesiones activas</p>
                            {activeSessions.map(session => (
                                <div key={session.id} className="neumorph-inset rounded-xl p-3 mb-2 flex justify-between items-center">
                                    <div><p className="text-sm text-white">{session.device}</p><p className="text-xs text-gray-400">{session.location} · Último acceso: {session.lastActive}</p></div>
                                    {session.current && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1"><LogOut size={10} /> Actual</span>}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );

            case 'appearance':
                return (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-5">
                        <div><p className="text-white font-medium mb-2 flex items-center gap-2"><Palette size={18} /> Tema</p><div className="flex gap-3">{['dark', 'light'].map(t => (<button key={t} onClick={() => { setTheme(t); markUnsaved(); }} className={`neumorph-btn px-4 py-2 flex items-center gap-2 ${theme === t ? 'shadow-neumorph-inset bg-blue-600 text-white' : ''}`}>{t === 'dark' ? <Moon size={16} /> : <Sun size={16} />}{t === 'dark' ? 'Oscuro' : 'Claro'}</button>))}</div></div>
                        <div><p className="text-white font-medium mb-2 flex items-center gap-2"><Palette size={18} /> Color de acento</p><div className="flex gap-3">{['blue', 'green', 'purple', 'orange'].map(c => (<button key={c} onClick={() => { setAccentColor(c); markUnsaved(); }} className={`w-8 h-8 rounded-full ${c === 'blue' ? 'bg-blue-500' : c === 'green' ? 'bg-green-500' : c === 'purple' ? 'bg-purple-500' : 'bg-orange-500'} ${accentColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-primary' : ''}`} />))}</div></div>
                        <div><p className="text-white font-medium mb-2 flex items-center gap-2"><Type size={18} /> Tamaño de fuente</p><select value={fontSize} onChange={(e) => { setFontSize(e.target.value); markUnsaved(); }} className="neumorph-input w-40"><option value="small">Pequeña</option><option value="medium">Mediana</option><option value="large">Grande</option></select></div>
                    </motion.div>
                );

            case 'notifications':
                return (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition">
                                <div><p className="text-white font-medium capitalize flex items-center gap-2"><Bell size={16} /> {key.replace(/([A-Z])/g, ' $1')}</p><p className="text-xs text-gray-400">Recibir alertas por {key.includes('email') ? 'correo' : key.includes('push') ? 'push' : 'resumen'}</p></div>
                                <button onClick={() => { setNotifications({ ...notifications, [key]: !value }); markUnsaved(); }} className={`w-11 h-6 rounded-full transition-all ${value ? 'bg-blue-600' : 'bg-gray-700'} shadow-neumorph-inset`}><div className={`w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
                            </div>
                        ))}
                    </motion.div>
                );

            case 'payments':
                return (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-5">
                        {paymentMethods.map(pm => (
                            <div key={pm.id} className="neumorph-inset rounded-xl p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3"><CreditCard size={24} className="text-gray-400" /><div><p className="text-white font-mono">•••• {pm.last4}</p><p className="text-xs text-gray-400">Expira {pm.expiry}</p></div>{pm.default && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full flex items-center gap-1"><Star size={10} /> Predeterminado</span>}</div>
                                <div className="flex gap-3">{!pm.default && <button onClick={() => setDefaultPayment(pm.id)} className="text-xs text-blue-400 hover:text-blue-300">Predeterminado</button>}<button onClick={() => removePayment(pm.id)} className="text-xs text-red-400 hover:text-red-300"><Trash2 size={14} /></button></div>
                            </div>
                        ))}
                        <button onClick={() => setShowAddPayment(true)} className="neumorph-btn w-full text-blue-400 flex items-center justify-center gap-2"><Plus size={16} /> Añadir método de pago</button>
                        <AnimatePresence>{showAddPayment && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="neumorph-inset rounded-xl p-4 overflow-hidden"><p className="text-white mb-3">Nueva tarjeta</p><input placeholder="Número de tarjeta" className="neumorph-input w-full mb-2" value={newCard.number} onChange={(e) => setNewCard({ ...newCard, number: e.target.value })} /><div className="flex gap-2"><input placeholder="MM/AA" className="neumorph-input w-1/2" value={newCard.expiry} onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })} /><input placeholder="CVC" className="neumorph-input w-1/2" value={newCard.cvc} onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })} /></div><div className="flex gap-3 mt-3"><button onClick={() => setShowAddPayment(false)} className="flex-1 neumorph-btn text-gray-400">Cancelar</button><button onClick={addPaymentMethod} className="flex-1 neumorph-btn bg-blue-600 text-white">Guardar tarjeta</button></div></motion.div>)}</AnimatePresence>
                    </motion.div>
                );

            case 'language':
                return (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-5">
                        <div><label className="block text-xs text-gray-400 mb-1 flex items-center gap-1"><Globe size={12} /> Idioma</label><select value={language} onChange={(e) => { setLanguage(e.target.value); markUnsaved(); }} className="neumorph-input w-full"><option value="es-MX">Español (México)</option><option value="en-US">English (US)</option><option value="pt-BR">Português (Brasil)</option></select></div>
                        <div><label className="block text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock size={12} /> Zona horaria</label><select value={timezone} onChange={(e) => { setTimezone(e.target.value); markUnsaved(); }} className="neumorph-input w-full"><option value="America/Mexico_City">CDMX (GMT-6)</option><option value="America/New_York">Nueva York (GMT-5)</option><option value="Europe/Madrid">Madrid (GMT+1)</option></select></div>
                        <div><label className="block text-xs text-gray-400 mb-1 flex items-center gap-1"><DollarSign size={12} /> Formato de moneda</label><select value={currencyFormat} onChange={(e) => { setCurrencyFormat(e.target.value); markUnsaved(); }} className="neumorph-input w-full"><option value="MXN">Peso Mexicano (MXN)</option><option value="USD">Dólar Americano (USD)</option><option value="EUR">Euro (EUR)</option></select></div>
                    </motion.div>
                );

            case 'api':
                return (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-5">
                        <div><p className="text-white font-medium mb-2 flex items-center gap-2"><Key size={18} /> API Keys</p>{apiKeys.map(key => (<div key={key.id} className="neumorph-inset rounded-xl p-3 mb-2 flex justify-between items-center"><div><p className="text-sm text-white font-mono">{key.name}</p><p className="text-xs text-gray-400">{key.key} · Creada {key.createdAt} · Último uso {key.lastUsed}</p></div><div className="flex gap-2"><button onClick={() => copyApiKey(key.key, key.id)} className="text-blue-400 text-xs hover:text-blue-300">{copiedKeyId === key.id ? <Check size={14} /> : <Copy size={14} />}</button><button onClick={() => revokeApiKey(key.id)} className="text-red-400 text-xs hover:text-red-300"><Trash2 size={14} /></button></div></div>))}<button onClick={generateApiKey} className="neumorph-btn text-blue-400 text-sm flex items-center gap-2"><Plus size={14} /> Generar nueva API Key</button></div>
                        <div><p className="text-white font-medium mb-2 flex items-center gap-2"><Webhook size={18} /> Webhook</p><input type="url" value={webhookUrl} onChange={(e) => { setWebhookUrl(e.target.value); markUnsaved(); }} className="neumorph-input w-full" /><p className="text-xs text-gray-400 mt-1">Recibirás eventos de precios, órdenes y alertas en esta URL.</p></div>
                    </motion.div>
                );

            case 'help':
                return (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-5">
                        <div className="neumorph-inset rounded-xl p-4 text-center"><HelpCircle size={32} className="mx-auto text-blue-400 mb-2" /><p className="text-white font-medium">Centro de ayuda</p><p className="text-xs text-gray-400 mt-1">Documentación, tutoriales y preguntas frecuentes</p><button className="neumorph-btn mt-3 text-blue-400">Ir al centro de ayuda</button></div>
                        <div><p className="text-white font-medium mb-2 flex items-center gap-2"><FileText size={18} /> Contactar soporte</p><input placeholder="Asunto" className="neumorph-input w-full mb-2" value={supportTicket.subject} onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })} /><textarea placeholder="Mensaje" rows="3" className="neumorph-input w-full" value={supportTicket.message} onChange={(e) => setSupportTicket({ ...supportTicket, message: e.target.value })} /><button className="neumorph-btn bg-blue-600 text-white mt-2">Enviar ticket</button></div>
                        <div className="flex flex-wrap gap-3"><button className="neumorph-btn text-gray-400 text-sm flex items-center gap-2"><Monitor size={14} /> Estado del sistema</button><button className="neumorph-btn text-gray-400 text-sm flex items-center gap-2"><FileText size={14} /> Términos legales</button><button className="neumorph-btn text-gray-400 text-sm flex items-center gap-2"><Shield size={14} /> Privacidad</button></div>
                    </motion.div>
                );
            default: return null;
        }
    };

    // --------------------------------------------------------------
    // 4. Render principal con fondo animado y toasts
    // --------------------------------------------------------------
    return (
        <div className="relative min-h-screen">
            <AnimatePresence>{toast.show && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-blue-500/90 text-white'}`}>{toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}{toast.message}</motion.div>)}</AnimatePresence>

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">⚙️ Configuración del Sistema</motion.h2>
                    {hasUnsavedChanges && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-400 text-xs"><span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span> Cambios sin guardar</motion.div>)}
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="lg:w-64 space-y-2">
                        {[
                            { id: 'profile', label: 'Account & Profile', icon: User },
                            { id: 'security', label: 'Privacy & Security', icon: Shield },
                            { id: 'appearance', label: 'Appearance', icon: Palette },
                            { id: 'notifications', label: 'Notifications', icon: Bell },
                            { id: 'payments', label: 'Payment Methods', icon: CreditCard },
                            { id: 'language', label: 'Language & Region', icon: Globe },
                            { id: 'api', label: 'Integration & API', icon: Key },
                            { id: 'help', label: 'Help & Support', icon: HelpCircle },
                        ].map(section => (
                            <motion.button key={section.id} whileHover={{ x: 4 }} onClick={() => setActiveSection(section.id)} className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 ${activeSection === section.id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 shadow-neumorph-inset text-blue-400 border-l-2 border-blue-500' : 'hover:bg-white/5'}`}>
                                <section.icon size={18} /> <span className="text-sm font-medium">{section.label}</span>
                            </motion.button>
                        ))}
                    </aside>

                    <main className="flex-1 rounded-2xl p-6 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
                        {renderSection()}
                    </main>
                </div>

                <div className="flex justify-end gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveAllSettings} disabled={!hasUnsavedChanges || saving} className={`neumorph-btn bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 font-semibold flex items-center gap-2 disabled:opacity-50`}>
                        {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />} Guardar Cambios
                    </motion.button>
                </div>

                <div className="rounded-2xl p-4 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div><p className="text-white font-medium flex items-center gap-2"><Download size={16} /> Exportar / Importar configuración</p><p className="text-xs text-gray-400">Respalda o restaura toda la configuración del sistema.</p></div>
                    <div className="flex gap-3"><button className="neumorph-btn text-sm flex items-center gap-2"><Download size={14} /> Exportar JSON</button><button className="neumorph-btn text-sm flex items-center gap-2"><Upload size={14} /> Importar</button></div>
                </div>

                <div className="rounded-2xl p-4 bg-gradient-to-br from-[#1f2125] to-[#16181c] shadow-neumorph-outset">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">📋 Actividad reciente</h3>
                    <div className="space-y-2"><div className="text-xs text-gray-400 flex justify-between"><span>Cambio de contraseña</span><span>27/03/2026 10:32</span></div><div className="text-xs text-gray-400 flex justify-between"><span>Nueva API key generada</span><span>26/03/2026 15:20</span></div><div className="text-xs text-gray-400 flex justify-between"><span>Método de pago actualizado</span><span>25/03/2026 09:15</span></div></div>
                </div>
            </div>
        </div>
    );
};

export default Settings;