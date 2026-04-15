import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Edit, Save, UserCircle, Shield, Lock, 
  Camera, Calendar, MapPin, Briefcase, Globe, Bell, 
  Smartphone, CreditCard, History, LogOut, Key, Fingerprint,
  CheckCircle, AlertCircle, X, ChevronRight, Eye, EyeOff,
  RefreshCw, Download, Trash2, Upload, Image as ImageIcon,
  Star, Award, Clock, Activity, TrendingUp, Users, FileText,
  MessageSquare, HelpCircle, Settings, Link as LinkIcon
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const [userData, setUserData] = useState({
    name: 'Carlos Rafael Heredia Loperena',
    email: 'carlos@neumatiq.com',
    role: 'Administrador',
    phone: '+52 55 1234 5678',
    avatar: '/assets/Heredia_logo_circular.png',
    position: 'CEO & Fundador',
    department: 'Tecnología',
    location: 'Ciudad de México, México',
    timezone: 'America/Mexico_City',
    language: 'Español',
    bio: 'Especialista en inteligencia de mercado y desarrollo de software para el sector automotriz. Fundador de NeumatiQ y CH ValueGrowth.',
    website: 'https://neumatiq.com',
    joinedDate: '2024-01-15',
    lastActive: '2026-04-12',
    twoFactorEnabled: false,
    emailVerified: true,
    phoneVerified: true
  });
  
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    marketingEmails: false,
    orderUpdates: true,
    stockAlerts: true,
    priceAlerts: true
  });
  
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: 'Windows PC - Chrome', location: 'CDMX, México', lastActive: 'Hace 2 minutos', current: true },
    { id: 2, name: 'MacBook Pro - Safari', location: 'CDMX, México', lastActive: 'Hace 3 horas', current: false },
    { id: 3, name: 'iPhone 15 Pro - App', location: 'Guadalajara, México', lastActive: 'Ayer', current: false }
  ]);
  
  const [activityLog, setActivityLog] = useState([
    { id: 1, action: 'Inicio de sesión', date: '2026-04-12 08:30:00', ip: '192.168.1.1', status: 'success' },
    { id: 2, action: 'Cambio de contraseña', date: '2026-04-10 15:20:00', ip: '192.168.1.1', status: 'success' },
    { id: 3, action: 'Actualización de perfil', date: '2026-04-08 10:15:00', ip: '192.168.1.1', status: 'success' },
    { id: 4, action: 'Intento de inicio fallido', date: '2026-04-06 22:30:00', ip: '10.0.0.1', status: 'failed' }
  ]);
  
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '08/25', isDefault: false }
  ]);
  
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'API Key Principal', key: 'sk_live_4eR9tY8uI2oP1aZ7xV3c', createdAt: '2026-01-15', lastUsed: '2026-04-12' }
  ]);
  
  // Estadísticas del usuario
  const userStats = {
    totalOrders: 156,
    totalSpent: 845000,
    memberSince: '2024-01-15',
    loyaltyPoints: 12500,
    loyaltyTier: 'Platinum'
  };
  
  const showNotification = (message) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setEditing(false);
    showNotification('✅ Perfil actualizado exitosamente');
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setUserData({ ...userData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUpdatePassword = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (securityData.newPassword.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    showNotification('✅ Contraseña actualizada exitosamente');
    setShowPasswordModal(false);
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };
  
  const handleRevokeDevice = (id) => {
    setConnectedDevices(connectedDevices.filter(d => d.id !== id));
    showNotification('✅ Dispositivo revocado exitosamente');
  };
  
  const handleDeleteAccount = () => {
    showNotification('⚠️ Solicitud de eliminación enviada. Revisa tu correo para confirmar.');
    setShowDeleteModal(false);
  };
  
  const handleSetDefaultPayment = (id) => {
    setPaymentMethods(paymentMethods.map(p => ({ ...p, isDefault: p.id === id })));
    showNotification('✅ Método de pago predeterminado actualizado');
  };
  
  const handleRemovePayment = (id) => {
    setPaymentMethods(paymentMethods.filter(p => p.id !== id));
    showNotification('✅ Método de pago eliminado');
  };
  
  const handleGenerateApiKey = () => {
    const newKey = {
      id: apiKeys.length + 1,
      name: `API Key ${apiKeys.length + 1}`,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Nunca'
    };
    setApiKeys([...apiKeys, newKey]);
    showNotification('✅ Nueva API Key generada');
  };
  
  const handleRevokeApiKey = (id) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    showNotification('✅ API Key revocada');
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'devices', label: 'Dispositivos', icon: Smartphone },
    { id: 'activity', label: 'Actividad', icon: History },
    { id: 'api', label: 'API Keys', icon: Key }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050c1a] to-[#0B1E3A] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5 text-[#AFC8E6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">
            Mi Perfil
          </h1>
        </motion.div>
        
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* Avatar */}
            <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-6 shadow-lg border border-[#1E90FF]/20 text-center">
              <div className="relative inline-block">
                <div className="w-28 h-28 bg-transparent rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/20 overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <img src="/assets/Heredia_logo_circular.png" alt="Avatar" className="w-full h-full object-contain" />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] p-2 rounded-xl shadow-lg hover:scale-110 transition-all"
                >
                  <Camera size={14} className="text-white" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>
              <h2 className="text-xl font-bold text-[#EAF3FF] mt-4">{userData.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {userData.role}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1E90FF]/20 text-[#1E90FF] border border-[#1E90FF]/30">
                  {userStats.loyaltyTier}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-[#1E90FF]/20">
                <p className="text-xs text-[#AFC8E6]">Miembro desde</p>
                <p className="text-sm font-semibold text-[#EAF3FF]">{userStats.memberSince}</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-4 shadow-lg border border-[#1E90FF]/20">
              <div className="flex justify-between items-center py-2 border-b border-[#1E90FF]/20">
                <span className="text-xs text-[#AFC8E6]">Total pedidos</span>
                <span className="text-sm font-bold text-[#EAF3FF]">{userStats.totalOrders}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#1E90FF]/20">
                <span className="text-xs text-[#AFC8E6]">Total gastado</span>
                <span className="text-sm font-bold text-[#1E90FF]">${(userStats.totalSpent / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-[#AFC8E6]">Puntos lealtad</span>
                <span className="text-sm font-bold text-amber-400">{userStats.loyaltyPoints.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl shadow-lg border border-[#1E90FF]/20 overflow-hidden"
          >
            {/* Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-[#1E90FF]/20 px-4 pt-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#0B1E3A] text-[#1E90FF] border-t border-x border-[#1E90FF]/30'
                      : 'text-[#AFC8E6] hover:text-[#EAF3FF] hover:bg-[#1E4D7A]/50'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Perfil */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-end">
                      <button
                        onClick={() => setEditing(!editing)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        <Edit size={14} />
                        {editing ? 'Cancelar' : 'Editar Perfil'}
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Nombre completo</label>
                        <input
                          value={userData.name}
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                          disabled={!editing}
                          className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Email</label>
                        <input
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          disabled={!editing}
                          className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] disabled:opacity-70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Teléfono</label>
                        <input
                          value={userData.phone}
                          onChange={(e) => setUserData({...userData, phone: e.target.value})}
                          disabled={!editing}
                          className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] disabled:opacity-70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Cargo</label>
                        <input
                          value={userData.position}
                          onChange={(e) => setUserData({...userData, position: e.target.value})}
                          disabled={!editing}
                          className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] disabled:opacity-70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Ubicación</label>
                        <input
                          value={userData.location}
                          onChange={(e) => setUserData({...userData, location: e.target.value})}
                          disabled={!editing}
                          className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] disabled:opacity-70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Sitio web</label>
                        <input
                          value={userData.website}
                          onChange={(e) => setUserData({...userData, website: e.target.value})}
                          disabled={!editing}
                          className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] disabled:opacity-70"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-[#AFC8E6] mb-1">Biografía</label>
                      <textarea
                        value={userData.bio}
                        onChange={(e) => setUserData({...userData, bio: e.target.value})}
                        disabled={!editing}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] disabled:opacity-70 resize-none"
                      />
                    </div>
                    
                    {editing && (
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                    )}
                  </motion.div>
                )}
                
                {/* Seguridad */}
                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between p-4 bg-[#0B1E3A]/60 rounded-xl border border-[#1E90FF]/20">
                      <div>
                        <h3 className="font-semibold text-[#EAF3FF]">Autenticación de Dos Factores</h3>
                        <p className="text-xs text-[#AFC8E6] mt-1">Añade una capa extra de seguridad a tu cuenta</p>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white text-sm font-semibold">
                        Configurar
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-[#0B1E3A]/60 rounded-xl border border-[#1E90FF]/20">
                      <div>
                        <h3 className="font-semibold text-[#EAF3FF]">Cambiar Contraseña</h3>
                        <p className="text-xs text-[#AFC8E6] mt-1">Actualiza tu contraseña regularmente</p>
                      </div>
                      <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#1E90FF] border border-[#1E90FF]/30 text-sm font-semibold"
                      >
                        Cambiar
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-[#0B1E3A]/60 rounded-xl border border-[#1E90FF]/20">
                      <div>
                        <h3 className="font-semibold text-[#EAF3FF]">Verificación de Email</h3>
                        <p className="text-xs text-[#AFC8E6] mt-1">Tu email está verificado</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Verificado
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-[#0B1E3A]/60 rounded-xl border border-[#1E90FF]/20">
                      <div>
                        <h3 className="font-semibold text-[#EAF3FF]">Verificación de Teléfono</h3>
                        <p className="text-xs text-[#AFC8E6] mt-1">Tu número está verificado</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Verificado
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full py-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-semibold hover:bg-red-500/30 transition-all"
                    >
                      Eliminar Cuenta
                    </button>
                  </motion.div>
                )}
                
                {/* Notificaciones */}
                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {[
                      { key: 'emailAlerts', label: 'Alertas por email', desc: 'Recibe notificaciones importantes por correo' },
                      { key: 'pushNotifications', label: 'Notificaciones push', desc: 'Alertas en tiempo real en tu navegador' },
                      { key: 'smsAlerts', label: 'Alertas SMS', desc: 'Mensajes de texto para alertas críticas' },
                      { key: 'orderUpdates', label: 'Actualizaciones de pedidos', desc: 'Notificaciones sobre el estado de tus órdenes' },
                      { key: 'stockAlerts', label: 'Alertas de stock', desc: 'Notificaciones cuando el stock es bajo' },
                      { key: 'priceAlerts', label: 'Alertas de precio', desc: 'Cambios significativos en precios' },
                      { key: 'marketingEmails', label: 'Ofertas y promociones', desc: 'Recibe información sobre promociones especiales' }
                    ].map(notif => (
                      <div key={notif.key} className="flex items-center justify-between p-4 bg-[#0B1E3A]/60 rounded-xl border border-[#1E90FF]/20">
                        <div>
                          <p className="font-semibold text-[#EAF3FF]">{notif.label}</p>
                          <p className="text-xs text-[#AFC8E6] mt-1">{notif.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[notif.key]}
                            onChange={() => setNotifications(prev => ({ ...prev, [notif.key]: !prev[notif.key] }))}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-[#0B1E3A] rounded-full peer peer-checked:bg-[#1E90FF] after:bg-white border border-[#1E90FF]/30"></div>
                        </label>
                      </div>
                    ))}
                  </motion.div>
                )}
                
                {/* Pagos */}
                {activeTab === 'payments' && (
                  <motion.div
                    key="payments"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      {paymentMethods.map(card => (
                        <div key={card.id} className="flex items-center justify-between p-4 bg-[#0B1E3A]/60 rounded-xl border border-[#1E90FF]/20">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-8 h-8 text-[#1E90FF]" />
                            <div>
                              <p className="font-semibold text-[#EAF3FF]">{card.type} •••• {card.last4}</p>
                              <p className="text-xs text-[#AFC8E6]">Expira {card.expiry}</p>
                            </div>
                            {card.isDefault && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                                Predeterminado
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {!card.isDefault && (
                              <button onClick={() => handleSetDefaultPayment(card.id)} className="text-xs text-[#1E90FF] hover:text-[#3B82F6]">
                                Establecer
                              </button>
                            )}
                            <button onClick={() => handleRemovePayment(card.id)} className="text-xs text-red-400 hover:text-red-300">
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#1E90FF] font-semibold hover:bg-[#1E4D7A] transition-all">
                      + Agregar nuevo método de pago
                    </button>
                  </motion.div>
                )}
                
                {/* Dispositivos */}
                {activeTab === 'devices' && (
                  <motion.div
                    key="devices"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {connectedDevices.map(device => (
                      <div key={device.id} className="flex items-center justify-between p-4 bg-[#0B1E3A]/60 rounded-xl border border-[#1E90FF]/20">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-8 h-8 text-[#1E90FF]" />
                          <div>
                            <p className="font-semibold text-[#EAF3FF]">{device.name}</p>
                            <p className="text-xs text-[#AFC8E6]">{device.location} • {device.lastActive}</p>
                          </div>
                          {device.current && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                              Actual
                            </span>
                          )}
                        </div>
                        {!device.current && (
                          <button onClick={() => handleRevokeDevice(device.id)} className="text-xs text-red-400 hover:text-red-300">
                            Revocar
                          </button>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
                
                {/* Actividad */}
                {activeTab === 'activity' && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {activityLog.map(log => (
                      <div key={log.id} className="flex items-start gap-3 p-4 bg-[#0B1E3A]/60 rounded-xl border border-[#1E90FF]/20">
                        <div className={`p-1.5 rounded-lg ${log.status === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                          {log.status === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#EAF3FF] text-sm">{log.action}</p>
                          <p className="text-xs text-[#AFC8E6]">{log.date} • IP: {log.ip}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {log.status === 'success' ? 'Exitoso' : 'Fallido'}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
                
                {/* API Keys */}
                {activeTab === 'api' && (
                  <motion.div
                    key="api"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      {apiKeys.map(key => (
                        <div key={key.id} className="p-4 bg-[#0B1E3A]/60 rounded-xl border border-[#1E90FF]/20">
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
                              <Copy size={12} className="text-[#AFC8E6]" />
                            </button>
                          </div>
                          <p className="text-[10px] text-[#AFC8E6] mt-2">Creada: {key.createdAt} • Último uso: {key.lastUsed}</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleGenerateApiKey} className="w-full py-3 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-semibold hover:shadow-lg transition-all">
                      + Generar nueva API Key
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Modal Cambiar Contraseña */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-6 w-full max-w-md border border-[#1E90FF]/30 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#EAF3FF]">Cambiar Contraseña</h2>
                <button onClick={() => setShowPasswordModal(false)} className="p-1 rounded-lg hover:bg-[#1E4D7A]">
                  <X className="w-5 h-5 text-[#AFC8E6]" />
                </button>
              </div>
              <div className="space-y-4">
                <input type="password" placeholder="Contraseña actual" value={securityData.currentPassword} onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})} className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF]" />
                <input type="password" placeholder="Nueva contraseña" value={securityData.newPassword} onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})} className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg" />
                <input type="password" placeholder="Confirmar nueva contraseña" value={securityData.confirmPassword} onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})} className="w-full px-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg" />
                <button onClick={handleUpdatePassword} className="w-full py-3 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-semibold">
                  Actualizar Contraseña
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Modal Eliminar Cuenta */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-6 w-full max-w-md border border-red-500/30 shadow-2xl"
            >
              <div className="text-center mb-4">
                <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-[#EAF3FF]">Eliminar Cuenta</h2>
                <p className="text-sm text-[#AFC8E6] mt-2">Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDeleteAccount} className="flex-1 py-3 bg-red-500 rounded-lg text-white font-semibold hover:bg-red-600 transition-all">
                  Eliminar
                </button>
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-[#0B1E3A]/80 rounded-lg text-[#AFC8E6] border border-[#1E90FF]/30">
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Toast Notificación */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 bg-emerald-500/90 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente Copy para API Keys
const Copy = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export default Profile;