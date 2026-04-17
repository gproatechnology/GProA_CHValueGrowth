import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, ShoppingCart, Package, Clock, CheckCircle, AlertCircle,
  Filter, Search, Download, ChevronDown, ChevronUp, RefreshCw,
  TrendingUp, User, Calendar, DollarSign, MapPin, Phone, Mail,
  Star, Sparkles, Eye, BarChart3, PieChart, X, Edit, Trash2,
  Printer, Send, MoreVertical, MessageSquare, FileText, TruckIcon, Database
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import OrdersTable from './OrdersTable';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// =============================================
// DATOS DE ÓRDENES MEJORADOS
// =============================================
const generateOrdersData = () => {
  const customers = [
    { name: 'AutoSport Racing', email: 'ventas@autosport.com', phone: '+52 55 1234 5678', address: 'Av. Paseo de la Reforma 123, CDMX' },
    { name: 'Performance Motors', email: 'info@performance.com', phone: '+52 55 8765 4321', address: 'Blvd. Manuel Ávila Camacho 456, CDMX' },
    { name: 'Luxury Wheels', email: 'contacto@luxurywheels.com', phone: '+52 55 2345 6789', address: 'Av. Insurgentes Sur 789, CDMX' },
    { name: 'Supercar Center', email: 'ventas@supercarcenter.com', phone: '+52 55 3456 7890', address: 'Periférico Sur 321, CDMX' },
    { name: 'AutoMundo Express', email: 'pedidos@automundo.com', phone: '+52 55 4567 8901', address: 'Eje Central 654, CDMX' },
    { name: 'Neumáticos del Valle', email: 'contacto@neumaticosvalle.com', phone: '+52 55 5678 9012', address: 'Av. Universidad 987, CDMX' },
    { name: 'Racing Parts MX', email: 'racing@partsmx.com', phone: '+52 55 6789 0123', address: 'Calzada de Tlalpan 147, CDMX' },
    { name: 'Todo Neumáticos', email: 'ventas@todoreumaticos.com', phone: '+52 55 7890 1234', address: 'Av. Taxqueña 258, CDMX' },
  ];
  
  const brands = ['Michelin', 'Pirelli', 'Bridgestone', 'Continental', 'Goodyear', 'Hankook', 'Yokohama', 'Dunlop'];
  const models = {
    'Michelin': ['Pilot Sport 4S', 'Primacy 4', 'CrossClimate 2'],
    'Pirelli': ['P Zero Corsa', 'Cinturato P7', 'Scorpion Verde'],
    'Bridgestone': ['Potenza RE-71R', 'Turanza T005', 'Dueler H/P'],
    'Continental': ['PremiumContact 6', 'SportContact 7', 'EcoContact 6'],
    'Goodyear': ['Eagle F1 Asymmetric', 'EfficientGrip', 'Wrangler AT'],
    'Hankook': ['Ventus S1 evo3', 'Kinergy 4S', 'Dynapro AT2'],
    'Yokohama': ['Advan Sport V105', 'Geolandar G015', 'BluEarth GT'],
    'Dunlop': ['Sport Maxx RT2', 'Grandtrek AT5', 'SP Sport LM705'],
  };
  
  const statuses = ['Entregado', 'Enviado', 'Procesando', 'Almacén'];
  const priorities = ['Urgente', 'Alta', 'Media', 'Baja'];
  const types = ['Racing', 'Premium', 'Standard'];
  
  const orders = [];
  let id = 1;
  
  for (let i = 0; i < 24; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const modelList = models[brand];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const qty = [2, 4, 6, 8][Math.floor(Math.random() * 4)];
    const unitPrice = Math.floor(Math.random() * 2000) + 1500;
    const total = qty * unitPrice;
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    orders.push({
      id: `ORD-${9900 + id}`,
      brand,
      model: modelList[Math.floor(Math.random() * modelList.length)],
      qty,
      unitPrice,
      total,
      status,
      type,
      date: date.toISOString().split('T')[0],
      tracking: `TRK-${String(id).padStart(3, '0')}`,
      customer: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      priority,
      paymentMethod: ['Tarjeta', 'Transferencia', 'PayPal', 'Contraentrega'][Math.floor(Math.random() * 4)],
      shippingMethod: ['Estándar', 'Express', 'Same Day'][Math.floor(Math.random() * 3)],
      notes: Math.random() > 0.7 ? 'Cliente solicita factura' : '',
      timeline: [
        { status: 'Orden creada', date: date.toISOString(), completed: true },
        { status: 'Confirmación de pago', date: new Date(date.getTime() + 3600000).toISOString(), completed: status !== 'Almacén' },
        { status: 'Preparación', date: new Date(date.getTime() + 7200000).toISOString(), completed: status === 'Enviado' || status === 'Entregado' },
        { status: 'En tránsito', date: new Date(date.getTime() + 86400000).toISOString(), completed: status === 'Entregado' },
        { status: 'Entregado', date: new Date(date.getTime() + 172800000).toISOString(), completed: status === 'Entregado' }
      ]
    });
    id++;
  }
  
  return orders;
};

// =============================================
// COMPONENTES
// =============================================

// Modal de análisis de órdenes
const OrderAnalyticsModal = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;
  
  // Datos para gráficos
  const statusData = {
    labels: ['Entregado', 'Enviado', 'Procesando', 'Almacén'],
    datasets: [{
      data: [
        orders.filter(o => o.status === 'Entregado').length,
        orders.filter(o => o.status === 'Enviado').length,
        orders.filter(o => o.status === 'Procesando').length,
        orders.filter(o => o.status === 'Almacén').length
      ],
      backgroundColor: ['#10B981', '#1E90FF', '#F59E0B', '#6B7280'],
      borderWidth: 0
    }]
  };
  
  const salesByDay = Array(7).fill(0);
  orders.forEach(order => {
    const dayIndex = new Date(order.date).getDay();
    salesByDay[dayIndex] += order.total;
  });
  
  const salesTrendData = {
    labels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    datasets: [{
      label: 'Ventas (MXN)',
      data: salesByDay,
      borderColor: '#1E90FF',
      backgroundColor: 'rgba(30, 144, 255, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };
  
  const totalValue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = totalValue / orders.length;
  const avgDeliveryTime = orders.filter(o => o.status === 'Entregado').length > 0 ? 4.2 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-4xl w-full p-6 border border-[#1E90FF]/30 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#EAF3FF] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1E90FF]" />
            Analítica de Órdenes
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors">
            <X className="w-5 h-5 text-[#AFC8E6]" />
          </button>
        </div>
        
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
            <p className="text-xs text-[#AFC8E6]">Total Órdenes</p>
            <p className="text-2xl font-bold text-[#EAF3FF]">{orders.length}</p>
          </div>
          <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
            <p className="text-xs text-[#AFC8E6]">Valor Total</p>
            <p className="text-2xl font-bold text-[#1E90FF]">${(totalValue / 1000).toFixed(0)}K</p>
          </div>
          <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
            <p className="text-xs text-[#AFC8E6]">Valor Promedio</p>
            <p className="text-2xl font-bold text-[#EAF3FF]">${Math.round(avgOrderValue).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
            <p className="text-xs text-[#AFC8E6]">Entrega Promedio</p>
            <p className="text-2xl font-bold text-emerald-400">{avgDeliveryTime} días</p>
          </div>
        </div>
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0B1E3A]/60 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-[#EAF3FF] mb-3">Distribución por Estado</h4>
            <div className="h-64">
              <Doughnut data={statusData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#AFC8E6' } } } }} />
            </div>
          </div>
          <div className="bg-[#0B1E3A]/60 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-[#EAF3FF] mb-3">Tendencia de Ventas</h4>
            <div className="h-64">
              <Line data={salesTrendData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#AFC8E6' } } }, scales: { y: { ticks: { color: '#AFC8E6' } }, x: { ticks: { color: '#AFC8E6' } } } }} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Modal de detalles de orden expandido
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;
  
  const statusTimeline = order.timeline || [
    { status: 'Orden creada', date: order.date, completed: true },
    { status: 'Confirmación de pago', date: order.date, completed: order.status !== 'Almacén' },
    { status: 'Preparación', date: order.date, completed: order.status === 'Enviado' || order.status === 'Entregado' },
    { status: 'En tránsito', date: order.date, completed: order.status === 'Entregado' },
    { status: 'Entregado', date: order.date, completed: order.status === 'Entregado' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-2xl w-full p-6 border border-[#1E90FF]/30 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-[#EAF3FF]">{order.id}</h3>
            <p className="text-sm text-[#AFC8E6]">{order.date}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors">
            <X className="w-5 h-5 text-[#AFC8E6]" />
          </button>
        </div>
        
        {/* Estado actual */}
        <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusStyle(order.status).bg} ${getStatusStyle(order.status).text} shadow-md border ${getStatusStyle(order.status).border} mb-4`}>
          {React.createElement(getStatusStyle(order.status).icon, { className: 'w-3 h-3' })}
          {order.status}
        </div>
        
        {/* Timeline */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1E90FF]" />
            Línea de tiempo
          </h4>
          <div className="space-y-3">
            {statusTimeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-2 h-2 mt-1.5 rounded-full ${item.completed ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${item.completed ? 'text-[#EAF3FF]' : 'text-[#AFC8E6]'}`}>{item.status}</p>
                  <p className="text-xs text-[#AFC8E6]">{item.date}</p>
                </div>
                {item.completed && <CheckCircle className="w-4 h-4 text-emerald-500" />}
              </div>
            ))}
          </div>
        </div>
        
        {/* Detalles del producto */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-[#0B1E3A]/60 rounded-lg">
          <div>
            <p className="text-xs text-[#AFC8E6]">Producto</p>
            <p className="text-sm font-semibold text-[#EAF3FF]">{order.brand} {order.model}</p>
          </div>
          <div>
            <p className="text-xs text-[#AFC8E6]">Cantidad</p>
            <p className="text-sm font-semibold text-[#EAF3FF]">{order.qty} unidades</p>
          </div>
          <div>
            <p className="text-xs text-[#AFC8E6]">Precio unitario</p>
            <p className="text-sm font-semibold text-[#1E90FF]">${order.unitPrice?.toLocaleString() || (order.total / order.qty).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-[#AFC8E6]">Total</p>
            <p className="text-sm font-semibold text-[#1E90FF]">${order.total.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Información del cliente */}
        <div className="mb-4 p-3 bg-[#0B1E3A]/60 rounded-lg">
          <h4 className="text-sm font-semibold text-[#EAF3FF] mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-[#1E90FF]" />
            Cliente
          </h4>
          <p className="text-sm text-[#EAF3FF]">{order.customer}</p>
          <p className="text-xs text-[#AFC8E6] flex items-center gap-2 mt-1"><Mail className="w-3 h-3" /> {order.email}</p>
          <p className="text-xs text-[#AFC8E6] flex items-center gap-2 mt-1"><Phone className="w-3 h-3" /> {order.phone}</p>
          <p className="text-xs text-[#AFC8E6] flex items-center gap-2 mt-1"><MapPin className="w-3 h-3" /> {order.address}</p>
        </div>
        
        {/* Envío y pago */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-[#0B1E3A]/60 rounded-lg">
          <div>
            <p className="text-xs text-[#AFC8E6]">Método de pago</p>
            <p className="text-sm font-semibold text-[#EAF3FF]">{order.paymentMethod || 'Tarjeta'}</p>
          </div>
          <div>
            <p className="text-xs text-[#AFC8E6]">Método de envío</p>
            <p className="text-sm font-semibold text-[#EAF3FF]">{order.shippingMethod || 'Estándar'}</p>
          </div>
          <div>
            <p className="text-xs text-[#AFC8E6]">N° Seguimiento</p>
            <p className="text-sm font-semibold text-[#1E90FF]">{order.tracking}</p>
          </div>
          <div>
            <p className="text-xs text-[#AFC8E6]">Prioridad</p>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityStyle(order.priority)}`}>
              {order.priority}
            </span>
          </div>
        </div>
        
        {/* Acciones */}
        <div className="flex gap-3 mt-6">
          <button className="flex-1 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-medium flex items-center justify-center gap-2">
            <Edit className="w-4 h-4" /> Editar
          </button>
          <button className="flex-1 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#1E90FF] border border-[#1E90FF]/30 flex items-center justify-center gap-2">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
          <button className="flex-1 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#1E90FF] border border-[#1E90FF]/30 flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Notificar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Helper functions
const getStatusStyle = (status) => {
  const styles = {
    'Entregado': { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-400', icon: CheckCircle, border: 'border-emerald-500/30' },
    'Enviado': { bg: 'from-[#1E90FF] to-[#3B82F6]', text: 'text-[#1E90FF]', icon: Truck, border: 'border-[#1E90FF]/30' },
    'Procesando': { bg: 'from-amber-500 to-orange-600', text: 'text-amber-400', icon: RefreshCw, border: 'border-amber-500/30' },
    'Almacén': { bg: 'from-slate-500 to-gray-600', text: 'text-slate-400', icon: Package, border: 'border-slate-500/30' }
  };
  return styles[status] || styles['Almacén'];
};

const getPriorityStyle = (priority) => {
  const styles = {
    'Urgente': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Alta': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Media': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Baja': 'bg-green-500/20 text-green-400 border-green-500/30'
  };
  return styles[priority] || styles['Media'];
};

// =============================================
// COMPONENTE PRINCIPAL ORDERS
// =============================================
const Orders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [view, setView] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Generar datos al montar
  useEffect(() => {
    const data = generateOrdersData();
    setOrdersData(data);
  }, []);
  
  // Filtrar órdenes
  const filteredOrders = useMemo(() => {
    return ordersData.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'all' || order.brand === selectedBrand;
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      const matchesView = view === 'all' || order.type.toLowerCase() === view.toLowerCase();
      return matchesSearch && matchesBrand && matchesStatus && matchesView;
    });
  }, [ordersData, searchTerm, selectedBrand, selectedStatus, view]);
  
  // Métricas
  const metrics = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalValue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const completed = filteredOrders.filter(o => o.status === 'Entregado').length;
    const pending = filteredOrders.filter(o => o.status !== 'Entregado').length;
    const completionRate = totalOrders > 0 ? Math.round((completed / totalOrders) * 100) : 0;
    return { totalOrders, totalValue, completed, pending, completionRate };
  }, [filteredOrders]);
  
  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const exportToCSV = () => {
    const headers = ['ID', 'Marca', 'Modelo', 'Cliente', 'Cantidad', 'Total', 'Estado', 'Fecha', 'Prioridad'];
    const rows = filteredOrders.map(o => [
      o.id, o.brand, o.model, o.customer, o.qty, o.total, o.status, o.date, o.priority
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `ordenes_${new Date().toISOString().slice(0, 19)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const uniqueBrands = useMemo(() => ['all', ...new Set(ordersData.map(o => o.brand))], [ordersData]);
  const uniqueStatuses = useMemo(() => ['all', ...new Set(ordersData.map(o => o.status))], [ordersData]);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#0B1E3A]/90 to-[#102A4C]/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-[#1E90FF]/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1E90FF]/10 to-[#3B82F6]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#1E90FF]/5 to-[#3B82F6]/5 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">
              Gestión de Órdenes
            </h1>
            <p className="text-md text-[#AFC8E6] font-medium mt-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1E90FF]" />
              Seguimiento y administración de pedidos en tiempo real
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAnalytics(true)}
              className="bg-[#102A4C]/80 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-md border border-[#1E90FF]/30 hover:shadow-lg transition-all text-[#1E90FF] font-semibold flex items-center gap-2 text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              Analítica
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportToCSV}
              className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#1E90FF]/25 transition-all text-white font-semibold flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#102A4C]/80 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-md border border-[#1E90FF]/30 hover:shadow-lg transition-all text-[#1E90FF] font-semibold flex items-center gap-2 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Nueva Orden
            </motion.button>
          </div>
        </div>
      </motion.header>
      
      {/* Metrics Cards */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {[
          { title: 'Órdenes Totales', value: metrics.totalOrders, icon: Package, color: 'from-[#1E90FF] to-[#3B82F6]', change: '+12%' },
          { title: 'Valor Total', value: `$${(metrics.totalValue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'from-emerald-500 to-teal-600', change: '+8%' },
          { title: 'Tasa de Completado', value: `${metrics.completionRate}%`, icon: CheckCircle, color: 'from-emerald-500 to-teal-600', change: '+5%' },
          { title: 'Pendientes', value: metrics.pending, icon: Clock, color: 'from-amber-500 to-orange-600', change: '-3%' },
        ].map((metric, i) => (
          <motion.div
            key={metric.title}
            variants={fadeInUp}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#AFC8E6] uppercase tracking-wide">{metric.title}</p>
              <div className={`p-2 bg-gradient-to-br ${metric.color} rounded-xl shadow-md text-white`}>
                {React.createElement(metric.icon, { className: 'w-4 h-4' })}
              </div>
            </div>
            <p className="text-2xl font-bold text-[#EAF3FF]">{metric.value}</p>
            {metric.change && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-3 h-3 ${metric.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`} />
                <span className={`text-xs font-medium ${metric.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metric.change} vs mes anterior
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.section>
      
      {/* Filters & Controls */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] backdrop-blur-xl rounded-xl p-5 shadow-lg border border-[#1E90FF]/20"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E90FF]" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente, marca o modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0B1E3A]/80 border border-[#1E90FF]/30 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent shadow-inner text-[#EAF3FF] placeholder-[#AFC8E6]/50 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1E90FF] shadow-md text-[#EAF3FF]"
            >
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>
                  {brand === 'all' ? 'Todas las marcas' : brand}
                </option>
              ))}
            </select>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1E90FF] shadow-md text-[#EAF3FF]"
            >
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'Todos los estados' : status}
                </option>
              ))}
            </select>
            <div className="flex gap-1 bg-[#0B1E3A]/80 backdrop-blur-sm rounded-xl p-1 shadow-inner border border-[#1E90FF]/30">
              {[
                { key: 'all', label: 'Todos', icon: Package },
                { key: 'racing', label: 'Racing', icon: Truck },
                { key: 'premium', label: 'Premium', icon: Sparkles },
                { key: 'standard', label: 'Standard', icon: ShoppingCart }
              ].map(type => (
                <motion.button
                  key={type.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView(type.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    view === type.key 
                      ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md' 
                      : 'text-[#AFC8E6] hover:text-[#EAF3FF] hover:bg-[#1E90FF]/20'
                  }`}
                >
                  {React.createElement(type.icon, { className: 'w-3 h-3' })}
                  {type.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Active filters display */}
        {(selectedBrand !== 'all' || selectedStatus !== 'all' || view !== 'all' || searchTerm) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#1E90FF]/20">
            <span className="text-xs text-[#AFC8E6]">Filtros activos:</span>
            {selectedBrand !== 'all' && (
              <span className="text-xs bg-[#1E90FF]/20 text-[#1E90FF] px-2 py-1 rounded-full border border-[#1E90FF]/30">
                Marca: {selectedBrand}
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="text-xs bg-[#1E90FF]/20 text-[#1E90FF] px-2 py-1 rounded-full border border-[#1E90FF]/30">
                Estado: {selectedStatus}
              </span>
            )}
            {view !== 'all' && (
              <span className="text-xs bg-[#1E90FF]/20 text-[#1E90FF] px-2 py-1 rounded-full border border-[#1E90FF]/30">
                Tipo: {view}
              </span>
            )}
            {searchTerm && (
              <span className="text-xs bg-[#1E90FF]/20 text-[#1E90FF] px-2 py-1 rounded-full border border-[#1E90FF]/30">
                Búsqueda: {searchTerm}
              </span>
            )}
          </div>
        )}
      </motion.section>
      
      {/* Orders Cards */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {paginatedOrders.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] backdrop-blur-md rounded-2xl p-12 text-center border border-[#1E90FF]/20"
            >
              <Package className="w-16 h-16 text-[#1E90FF]/30 mx-auto mb-4" />
              <p className="text-[#AFC8E6] text-lg">No se encontraron órdenes con los filtros aplicados</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBrand('all');
                  setSelectedStatus('all');
                  setView('all');
                }}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:shadow-[#1E90FF]/25 transition-all"
              >
                Limpiar filtros
              </button>
            </motion.div>
          ) : (
            paginatedOrders.map((order, index) => {
              const statusStyle = getStatusStyle(order.status);
              const StatusIcon = statusStyle.icon;
              return (
                <motion.div
                  key={order.id}
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all duration-300 border border-[#1E90FF]/20"
                >
                  {/* Order Header */}
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 rounded-xl flex items-center justify-center shadow-inner border border-[#1E90FF]/30">
                          <ShoppingCart className="w-6 h-6 text-[#1E90FF]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-[#EAF3FF]">{order.id}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityStyle(order.priority)}`}>
                              {order.priority}
                            </span>
                          </div>
                          <p className="text-sm text-[#AFC8E6]">
                            {order.date} • {order.customer}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="text-right">
                          <p className="text-xs text-[#AFC8E6]">Total</p>
                          <p className="text-xl font-bold text-[#1E90FF]">${order.total.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${statusStyle.bg} ${statusStyle.text} shadow-md border ${statusStyle.border}`}>
                            {React.createElement(StatusIcon, { className: 'w-3 h-3' })}
                            {order.status}
                          </span>
                          <div className="flex gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                              className="p-2 rounded-xl bg-[#0B1E3A]/80 hover:bg-[#1E4D7A] shadow-md text-[#1E90FF] border border-[#1E90FF]/30"
                            >
                              {expandedOrder === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 rounded-xl bg-[#0B1E3A]/80 hover:bg-[#1E4D7A] shadow-md text-[#1E90FF] border border-[#1E90FF]/30"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Details (Expandable) */}
                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-[#1E90FF]/20 bg-[#0B1E3A]/50"
                      >
                        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                          {/* Product Info */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#1E90FF] mb-3 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Detalles del Producto
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm"><span className="text-[#AFC8E6]">Marca:</span> <span className="font-medium text-[#EAF3FF]">{order.brand}</span></p>
                              <p className="text-sm"><span className="text-[#AFC8E6]">Modelo:</span> <span className="font-medium text-[#EAF3FF]">{order.model}</span></p>
                              <p className="text-sm"><span className="text-[#AFC8E6]">Cantidad:</span> <span className="font-medium text-[#EAF3FF]">{order.qty} unidades</span></p>
                              <p className="text-sm"><span className="text-[#AFC8E6]">Tipo:</span> <span className="font-medium text-[#EAF3FF]">{order.type}</span></p>
                            </div>
                          </div>
                          
                          {/* Customer Info */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#1E90FF] mb-3 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Información del Cliente
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm"><span className="text-[#AFC8E6]">Nombre:</span> <span className="font-medium text-[#EAF3FF]">{order.customer}</span></p>
                              <p className="text-sm flex items-center gap-2"><Mail className="w-3 h-3 text-[#AFC8E6]" /> <span className="text-[#EAF3FF]">{order.email}</span></p>
                              <p className="text-sm flex items-center gap-2"><Phone className="w-3 h-3 text-[#AFC8E6]" /> <span className="text-[#EAF3FF]">{order.phone}</span></p>
                              <p className="text-sm flex items-center gap-2"><MapPin className="w-3 h-3 text-[#AFC8E6]" /> <span className="text-[#EAF3FF]">{order.address}</span></p>
                            </div>
                          </div>
                          
                          {/* Shipping Info */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#1E90FF] mb-3 flex items-center gap-2">
                              <Truck className="w-4 h-4" />
                              Información de Envío
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm"><span className="text-[#AFC8E6]">N° Seguimiento:</span> <span className="font-mono text-[#1E90FF]">{order.tracking}</span></p>
                              <p className="text-sm"><span className="text-[#AFC8E6]">Método de envío:</span> <span className="text-[#EAF3FF]">{order.shippingMethod || 'Estándar'}</span></p>
                              <p className="text-sm"><span className="text-[#AFC8E6]">Fecha del pedido:</span> <span className="text-[#EAF3FF]">{order.date}</span></p>
                              {order.notes && (
                                <p className="text-sm"><span className="text-[#AFC8E6]">Notas:</span> <span className="text-[#EAF3FF]">{order.notes}</span></p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.section>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4 pt-4"
        >
          <p className="text-sm text-[#AFC8E6]">
            Mostrando <span className="font-semibold text-[#EAF3FF]">{paginatedOrders.length}</span> de <span className="font-semibold text-[#EAF3FF]">{filteredOrders.length}</span> órdenes
          </p>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                currentPage === 1
                  ? 'bg-[#0B1E3A]/50 text-[#AFC8E6]/50 cursor-not-allowed'
                  : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:text-[#EAF3FF] border border-[#1E90FF]/30 hover:shadow-lg'
              }`}
            >
              Anterior
            </motion.button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              
              return (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all text-sm ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md shadow-[#1E90FF]/25'
                      : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:bg-[#1E4D7A] border border-[#1E90FF]/30'
                  }`}
                >
                  {pageNum}
                </motion.button>
              );
            })}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                currentPage === totalPages
                  ? 'bg-[#0B1E3A]/50 text-[#AFC8E6]/50 cursor-not-allowed'
                  : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:text-[#EAF3FF] border border-[#1E90FF]/30 hover:shadow-lg'
              }`}
            >
              Siguiente
            </motion.button>
          </div>
        </motion.div>
      )}
      
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-6 border-t border-[#1E90FF]/20"
      >
        <p className="text-sm text-[#AFC8E6]">
          NeumatiQ Orders Management · Sistema de gestión de pedidos v2026 · © 2026
        </p>
      </motion.footer>
      
      {/* Modales */}
      <AnimatePresence>
        {showAnalytics && <OrderAnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} orders={filteredOrders} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      </AnimatePresence>

        {/* API Data Table Section */}
        <div className="mt-8 border-t border-[#1E90FF]/20 pt-6">
            <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-[#1E90FF]" />
                <h3 className="text-lg font-semibold text-[#EAF3FF]">Datos desde API</h3>
            </div>
            <OrdersTable />
        </div>
    </div>
  );
};

export default Orders;