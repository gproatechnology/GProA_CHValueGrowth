import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, CheckCircle, AlertTriangle, X, RefreshCw, 
  Filter, Calendar, Trash2, CheckCheck, Eye, EyeOff,
  Download, Archive, Settings, Clock, MessageSquare,
  Package, Truck, User, CreditCard, Shield, Zap,
  Star, Award, TrendingUp, Activity, Users, FileText
} from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Simulate API call con datos más realistas
    setTimeout(() => {
      const mockNotifications = [
        { 
          id: 1, 
          title: 'Nuevo pedido #ORD-9921', 
          message: 'Cliente AutoSport Racing realizó un pedido de 4 llantas Michelin Pilot Sport 4S por $18,500 MXN.',
          type: 'order', 
          date: '2026-04-12 09:30:00', 
          read: false,
          icon: Package,
          link: '/orders'
        },
        { 
          id: 2, 
          title: 'Stock crítico en neumático', 
          message: 'El producto Pirelli P Zero Corsa tiene solo 15 unidades disponibles. Se recomienda realizar pedido urgente.',
          type: 'warning', 
          date: '2026-04-12 08:15:00', 
          read: false,
          icon: AlertTriangle,
          link: '/products'
        },
        { 
          id: 3, 
          title: 'Nuevo cliente registrado', 
          message: 'Transportes del Norte se ha registrado como nuevo cliente. Completa su perfil para comenzar.',
          type: 'success', 
          date: '2026-04-11 16:45:00', 
          read: true,
          icon: User,
          link: '/customers'
        },
        { 
          id: 4, 
          title: 'Alerta: Retraso en envío', 
          message: 'El envío ENV-002 con destino a Bodega Central presenta un retraso de 24 horas debido a condiciones climáticas.',
          type: 'error', 
          date: '2026-04-11 14:20:00', 
          read: false,
          icon: Truck,
          link: '/logistica'
        },
        { 
          id: 5, 
          title: 'Sistema actualizado', 
          message: 'NeumatiQ ha sido actualizado a la versión v2.1.3. Nuevas funcionalidades disponibles.',
          type: 'info', 
          date: '2026-04-11 10:00:00', 
          read: true,
          icon: Zap,
          link: null
        },
        { 
          id: 6, 
          title: 'Meta de ventas superada', 
          message: 'Has superado la meta mensual de ventas en un 15%. ¡Excelente trabajo!',
          type: 'achievement', 
          date: '2026-04-10 18:30:00', 
          read: false,
          icon: Award,
          link: '/analytics'
        },
        { 
          id: 7, 
          title: 'Competidor bajó precios', 
          message: 'Llantas México ha reducido sus precios en un 5% en el segmento Premium.',
          type: 'warning', 
          date: '2026-04-10 12:15:00', 
          read: true,
          icon: TrendingUp,
          link: '/analytics'
        },
        { 
          id: 8, 
          title: 'Pago recibido', 
          message: 'Se ha recibido el pago de $25,000 MXN de Flota Industrial SA.',
          type: 'success', 
          date: '2026-04-09 15:45:00', 
          read: true,
          icon: CreditCard,
          link: '/orders'
        }
      ];
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];
    
    // Filtrar por estado de lectura
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.read);
    }
    
    // Filtrar por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === selectedType);
    }
    
    // Filtrar por fecha
    if (selectedDate !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      filtered = filtered.filter(n => {
        const notifDate = new Date(n.date);
        if (selectedDate === 'today') return notifDate >= today;
        if (selectedDate === 'yesterday') return notifDate >= yesterday && notifDate < today;
        if (selectedDate === 'week') return notifDate >= weekAgo;
        return true;
      });
    }
    
    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return filtered;
  }, [notifications, filter, selectedType, selectedDate]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    showNotification('✅ Notificación marcada como leída');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showNotification(`✅ ${unreadCount} notificaciones marcadas como leídas`);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showNotification('🗑️ Notificación eliminada');
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
    showNotification(`✅ ${selectedNotifications.length} notificaciones eliminadas`);
    setSelectedNotifications([]);
    setSelectMode(false);
    setShowDeleteModal(false);
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const exportNotifications = () => {
    const exportData = filteredNotifications.map(n => ({
      Título: n.title,
      Mensaje: n.message,
      Tipo: n.type,
      Fecha: n.date,
      Estado: n.read ? 'Leída' : 'No leída'
    }));
    const csvContent = [Object.keys(exportData[0]), ...exportData.map(row => Object.values(row))].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notificaciones_${new Date().toISOString().slice(0, 19)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('📥 Notificaciones exportadas correctamente');
  };

  const showNotification = (message) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const refreshNotifications = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
    showNotification('🔄 Notificaciones actualizadas');
  };

  const getTypeStyles = (type) => {
    const styles = {
      order: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: 'text-blue-400', label: 'Pedido' },
      warning: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: 'text-yellow-400', label: 'Alerta' },
      error: { bg: 'bg-red-500/20', border: 'border-red-500/30', icon: 'text-red-400', label: 'Error' },
      success: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', icon: 'text-emerald-400', label: 'Éxito' },
      info: { bg: 'bg-sky-500/20', border: 'border-sky-500/30', icon: 'text-sky-400', label: 'Info' },
      achievement: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', icon: 'text-purple-400', label: 'Logro' }
    };
    return styles[type] || styles.info;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const typeOptions = [
    { value: 'all', label: 'Todos', icon: Bell },
    { value: 'order', label: 'Pedidos', icon: Package },
    { value: 'warning', label: 'Alertas', icon: AlertTriangle },
    { value: 'success', label: 'Éxitos', icon: CheckCircle },
    { value: 'info', label: 'Información', icon: InfoIcon },
    { value: 'achievement', label: 'Logros', icon: Award }
  ];

  const dateOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'today', label: 'Hoy' },
    { value: 'yesterday', label: 'Ayer' },
    { value: 'week', label: 'Última semana' }
  ];

  const stats = {
    total: notifications.length,
    unread: unreadCount,
    read: notifications.filter(n => n.read).length,
    byType: {
      order: notifications.filter(n => n.type === 'order').length,
      warning: notifications.filter(n => n.type === 'warning').length,
      success: notifications.filter(n => n.type === 'success').length
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050c1a] to-[#0B1E3A] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-xl hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5 text-[#AFC8E6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">
                Notificaciones
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-[#AFC8E6]">{unreadCount} sin leer</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={refreshNotifications}
              className="p-2 rounded-xl bg-[#102A4C]/80 hover:bg-[#1E4D7A] transition-all border border-[#1E90FF]/30 text-[#1E90FF]"
              title="Actualizar"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={exportNotifications}
              className="p-2 rounded-xl bg-[#102A4C]/80 hover:bg-[#1E4D7A] transition-all border border-[#1E90FF]/30 text-[#1E90FF]"
              title="Exportar"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={() => setSelectMode(!selectMode)}
              className={`p-2 rounded-xl transition-all border ${selectMode ? 'bg-[#1E90FF] text-white border-[#1E90FF]' : 'bg-[#102A4C]/80 text-[#1E90FF] border-[#1E90FF]/30'}`}
              title="Seleccionar múltiples"
            >
              <CheckCheck size={18} />
            </button>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white text-sm font-semibold hover:shadow-lg transition-all"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-5 h-5 text-[#1E90FF]" />
              <span className="text-2xl font-bold text-[#EAF3FF]">{stats.total}</span>
            </div>
            <p className="text-xs text-[#AFC8E6]">Total notificaciones</p>
          </div>
          <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              <span className="text-2xl font-bold text-[#EAF3FF]">{stats.unread}</span>
            </div>
            <p className="text-xs text-[#AFC8E6]">Sin leer</p>
          </div>
          <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-[#EAF3FF]">{stats.byType.order}</span>
            </div>
            <p className="text-xs text-[#AFC8E6]">Pedidos</p>
          </div>
          <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-2xl font-bold text-[#EAF3FF]">{stats.byType.warning}</span>
            </div>
            <p className="text-xs text-[#AFC8E6]">Alertas</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20 mb-6"
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              {['all', 'unread', 'read'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === type
                      ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md'
                      : 'bg-[#0B1E3A]/80 text-[#AFC8E6] hover:bg-[#1E4D7A] border border-[#1E90FF]/30'
                  }`}
                >
                  {type === 'all' ? 'Todas' : type === 'unread' ? 'Sin leer' : 'Leídas'}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              {typeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedType(opt.value)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedType === opt.value
                      ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md'
                      : 'bg-[#0B1E3A]/80 text-[#AFC8E6] hover:bg-[#1E4D7A] border border-[#1E90FF]/30'
                  }`}
                >
                  <opt.icon size={12} />
                  {opt.label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              {dateOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedDate(opt.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedDate === opt.value
                      ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md'
                      : 'bg-[#0B1E3A]/80 text-[#AFC8E6] hover:bg-[#1E4D7A] border border-[#1E90FF]/30'
                  }`}
                >
                  <Calendar size={12} className="inline mr-1" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Selección múltiple bar */}
        {selectMode && selectedNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-xl p-3 mb-4 flex items-center justify-between"
          >
            <span className="text-white text-sm font-medium">
              {selectedNotifications.length} notificaciones seleccionadas
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="px-3 py-1 bg-red-500 rounded-lg text-white text-sm hover:bg-red-600 transition-all"
              >
                Eliminar seleccionadas
              </button>
              <button 
                onClick={() => setSelectMode(false)}
                className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm hover:bg-white/30 transition-all"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-4 border-[#1E90FF]/30 border-t-[#1E90FF] rounded-full"
            />
          </div>
        )}

        {/* Notifications List */}
        {!loading && (
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl border border-[#1E90FF]/20"
              >
                <Bell className="w-16 h-16 text-[#1E90FF]/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#EAF3FF] mb-2">Sin notificaciones</h3>
                <p className="text-[#AFC8E6]">No hay notificaciones que coincidan con los filtros seleccionados</p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, index) => {
                const typeStyle = getTypeStyles(notification.type);
                const IconComponent = notification.icon || Bell;
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border ${typeStyle.border} group ${
                      !notification.read ? 'ring-1 ring-[#1E90FF]/50' : ''
                    } ${selectMode ? 'cursor-pointer' : ''}`}
                    onClick={() => selectMode && toggleSelectNotification(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      {selectMode && (
                        <div className={`w-5 h-5 rounded-md border-2 mt-1 flex items-center justify-center transition-all ${
                          selectedNotifications.includes(notification.id) 
                            ? 'bg-[#1E90FF] border-[#1E90FF]' 
                            : 'border-[#1E90FF]/50'
                        }`}>
                          {selectedNotifications.includes(notification.id) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      )}
                      
                      <div className={`p-2 rounded-xl ${typeStyle.bg} border ${typeStyle.border}`}>
                        <IconComponent className={`w-5 h-5 ${typeStyle.icon}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-bold text-[#EAF3FF]">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#1E90FF] rounded-full animate-pulse" />
                          )}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${typeStyle.bg} ${typeStyle.icon} border ${typeStyle.border}`}>
                            {typeStyle.label}
                          </span>
                        </div>
                        <p className="text-sm text-[#AFC8E6] mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-[#AFC8E6]">
                            <Clock size={12} className="inline mr-1" />
                            {formatDate(notification.date)}
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            {!notification.read && (
                              <button
                                onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-[#1E90FF] transition-all"
                                title="Marcar como leída"
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}
                            {notification.link && (
                              <button
                                onClick={(e) => { e.stopPropagation(); navigate(notification.link); }}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-[#1E90FF] transition-all"
                                title="Ver detalles"
                              >
                                <Eye size={14} />
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-red-400 transition-all"
                              title="Eliminar"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modal Eliminar Seleccionados */}
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
                <h2 className="text-xl font-bold text-[#EAF3FF]">Eliminar notificaciones</h2>
                <p className="text-sm text-[#AFC8E6] mt-2">
                  ¿Estás seguro de que deseas eliminar {selectedNotifications.length} notificaciones seleccionadas? Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={deleteSelected} className="flex-1 py-3 bg-red-500 rounded-lg text-white font-semibold hover:bg-red-600 transition-all">
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

// Componente auxiliar para icono Info
const InfoIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Notifications;