import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, UserPlus, Phone, MapPin, Mail, Search, Filter, 
    Star, TrendingUp, Award, Clock, Calendar, DollarSign,
    ShoppingBag, Truck, MessageCircle, FileText, Settings,
    ChevronRight, X, Download, RefreshCw, MoreVertical,
    CheckCircle, AlertCircle, Building, User, BarChart3,
    Activity, Target, Zap, Heart, Shield, Sparkles, Eye,
    Edit, Trash2, Send, Printer, PieChart, LineChart, Save
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
// DATOS MEJORADOS DE CLIENTES
// =============================================
const generateCustomersData = () => {
    const customersList = [
        { name: 'Flota Industrial SA', contact: 'Juan Pérez', email: 'juan@flotaindustrial.com', phone: '+52 55 1234 5678', location: 'CDMX', segment: 'Enterprise', type: 'Flota', preferredBrand: 'Michelin' },
        { name: 'Transportes del Norte', contact: 'María López', email: 'maria@transportesdelnorte.mx', phone: '+52 81 8765 4321', location: 'Monterrey', segment: 'Business', type: 'Transporte', preferredBrand: 'Bridgestone' },
        { name: 'Logística Express', contact: 'Carlos Ramírez', email: 'carlos@logisticaexpress.com', phone: '+52 33 4567 8901', location: 'Guadalajara', segment: 'Business', type: 'Logística', preferredBrand: 'Continental' },
        { name: 'AutoSport Racing', contact: 'Roberto Sánchez', email: 'roberto@autosportracing.com', phone: '+52 55 9876 5432', location: 'CDMX', segment: 'Premium', type: 'Racing', preferredBrand: 'Pirelli' },
        { name: 'Neumáticos Express', contact: 'Laura Gómez', email: 'laura@neumaticosexpress.com', phone: '+52 55 2345 6789', location: 'Querétaro', segment: 'Small Business', type: 'Revendedor', preferredBrand: 'Goodyear' },
        { name: 'Rutas del Bajío', contact: 'Fernando Mendoza', email: 'fernando@rutasbajio.com', phone: '+52 44 5678 9012', location: 'León', segment: 'Enterprise', type: 'Transporte', preferredBrand: 'Michelin' },
        { name: 'AutoLlantera Central', contact: 'Ana Martínez', email: 'ana@autollantera.com', phone: '+52 55 1234 9876', location: 'CDMX', segment: 'Business', type: 'Revendedor', preferredBrand: 'Continental' },
        { name: 'Ruedas y Llantas', contact: 'Pedro García', email: 'pedro@ruedas.com', phone: '+52 33 9876 5432', location: 'Guadalajara', segment: 'Small Business', type: 'Revendedor', preferredBrand: 'Goodyear' },
        { name: 'Neumáticos del Sureste', contact: 'Luisa Fernández', email: 'luisa@neumaticossureste.com', phone: '+52 99 8765 4321', location: 'Mérida', segment: 'Business', type: 'Distribuidor', preferredBrand: 'Bridgestone' },
        { name: 'Corporativo Wheels', contact: 'Ricardo Díaz', email: 'ricardo@corporativowheels.com', phone: '+52 55 5555 1234', location: 'CDMX', segment: 'Enterprise', type: 'Corporativo', preferredBrand: 'Pirelli' },
    ];
    
    const loyaltyTiers = ['Platinum', 'Gold', 'Silver'];
    const statuses = ['active', 'inactive'];
    
    return customersList.map((customer, index) => {
        const orders = Math.floor(Math.random() * 60) + 10;
        const avgOrder = Math.floor(Math.random() * 4000) + 2000;
        const totalSpent = orders * avgOrder;
        const rating = (3.5 + Math.random() * 1.5).toFixed(1);
        const vehicles = Math.floor(Math.random() * 20) + 1;
        const loyaltyTier = loyaltyTiers[Math.floor(Math.random() * loyaltyTiers.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const interactions = [];
        for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            const types = ['Pedido', 'Llamada', 'Email', 'Reunión', 'Cotización'];
            const type = types[Math.floor(Math.random() * types.length)];
            let description = '';
            if (type === 'Pedido') description = `Compra de ${Math.floor(Math.random() * 20) + 5} llantas`;
            if (type === 'Llamada') description = 'Seguimiento de pedido';
            if (type === 'Email') description = 'Envío de cotización';
            if (type === 'Reunión') description = 'Revisión de contrato';
            if (type === 'Cotización') description = 'Solicitud de presupuesto';
            interactions.push({ date: date.toISOString().split('T')[0], type, description });
        }
        
        return {
            id: index + 1,
            ...customer,
            orders,
            totalSpent,
            rating: parseFloat(rating),
            lastOrder: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status,
            vehicles,
            loyaltyTier,
            notes: Math.random() > 0.7 ? 'Cliente VIP - Atención prioritaria' : '',
            interactions: interactions.sort((a, b) => new Date(b.date) - new Date(a.date)),
            paymentHistory: [
                { month: 'Ene', amount: Math.floor(Math.random() * 50000) + 10000 },
                { month: 'Feb', amount: Math.floor(Math.random() * 50000) + 10000 },
                { month: 'Mar', amount: Math.floor(Math.random() * 50000) + 10000 },
                { month: 'Abr', amount: Math.floor(Math.random() * 50000) + 10000 },
                { month: 'May', amount: Math.floor(Math.random() * 50000) + 10000 },
                { month: 'Jun', amount: Math.floor(Math.random() * 50000) + 10000 },
            ]
        };
    });
};

// =============================================
// MODAL DE NUEVO CLIENTE
// =============================================
const NewCustomerModal = ({ isOpen, onClose, onAddCustomer }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        phone: '',
        location: '',
        segment: 'Business',
        type: 'Revendedor',
        preferredBrand: 'Michelin',
        status: 'active',
        vehicles: 1,
        loyaltyTier: 'Silver'
    });
    
    const [errors, setErrors] = useState({});
    
    const segments = ['Enterprise', 'Business', 'Premium', 'Small Business'];
    const types = ['Flota', 'Transporte', 'Logística', 'Racing', 'Revendedor', 'Distribuidor', 'Corporativo'];
    const brands = ['Michelin', 'Pirelli', 'Bridgestone', 'Continental', 'Goodyear', 'Hankook', 'Yokohama', 'Dunlop'];
    const loyaltyTiers = ['Platinum', 'Gold', 'Silver'];
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.contact.trim()) newErrors.contact = 'El contacto es requerido';
        if (!formData.email.trim()) newErrors.email = 'El email es requerido';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
        if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
        if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida';
        if (formData.vehicles < 1) newErrors.vehicles = 'Debe tener al menos 1 vehículo';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const newCustomer = {
            id: Date.now(),
            ...formData,
            orders: 0,
            totalSpent: 0,
            rating: 0,
            lastOrder: new Date().toISOString().split('T')[0],
            vehicles: parseInt(formData.vehicles),
            interactions: [],
            paymentHistory: [
                { month: 'Ene', amount: 0 },
                { month: 'Feb', amount: 0 },
                { month: 'Mar', amount: 0 },
                { month: 'Abr', amount: 0 },
                { month: 'May', amount: 0 },
                { month: 'Jun', amount: 0 }
            ]
        };
        
        onAddCustomer(newCustomer);
        onClose();
        setFormData({
            name: '',
            contact: '',
            email: '',
            phone: '',
            location: '',
            segment: 'Business',
            type: 'Revendedor',
            preferredBrand: 'Michelin',
            status: 'active',
            vehicles: 1,
            loyaltyTier: 'Silver'
        });
    };
    
    if (!isOpen) return null;
    
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
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#EAF3FF] flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-[#1E90FF]" />
                        Nuevo Cliente
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors">
                        <X className="w-5 h-5 text-[#AFC8E6]" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Nombre del Cliente *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-[#0B1E3A]/80 border ${errors.name ? 'border-red-500' : 'border-[#1E90FF]/30'} rounded-lg text-sm text-[#EAF3FF] placeholder-[#AFC8E6]/50 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]`}
                                placeholder="Ej: Empresa XYZ"
                            />
                            {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
                        </div>
                        
                        {/* Contacto */}
                        <div>
                            <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Persona de Contacto *</label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-[#0B1E3A]/80 border ${errors.contact ? 'border-red-500' : 'border-[#1E90FF]/30'} rounded-lg text-sm text-[#EAF3FF] placeholder-[#AFC8E6]/50 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]`}
                                placeholder="Ej: Juan Pérez"
                            />
                            {errors.contact && <p className="text-red-400 text-[10px] mt-1">{errors.contact}</p>}
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-[#0B1E3A]/80 border ${errors.email ? 'border-red-500' : 'border-[#1E90FF]/30'} rounded-lg text-sm text-[#EAF3FF] placeholder-[#AFC8E6]/50 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]`}
                                placeholder="cliente@empresa.com"
                            />
                            {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
                        </div>
                        
                        {/* Teléfono */}
                        <div>
                            <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Teléfono *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-[#0B1E3A]/80 border ${errors.phone ? 'border-red-500' : 'border-[#1E90FF]/30'} rounded-lg text-sm text-[#EAF3FF] placeholder-[#AFC8E6]/50 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]`}
                                placeholder="+52 55 1234 5678"
                            />
                            {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone}</p>}
                        </div>
                        
                        {/* Ubicación */}
                        <div>
                            <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Ubicación *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-[#0B1E3A]/80 border ${errors.location ? 'border-red-500' : 'border-[#1E90FF]/30'} rounded-lg text-sm text-[#EAF3FF] placeholder-[#AFC8E6]/50 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]`}
                                placeholder="Ciudad, Estado"
                            />
                            {errors.location && <p className="text-red-400 text-[10px] mt-1">{errors.location}</p>}
                        </div>
                        
                        {/* Segmento */}
                        <div>
                            <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Segmento</label>
                            <select
                                name="segment"
                                value={formData.segment}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                            >
                                {segments.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        
                        {/* Tipo */}
                        <div>
                            <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Tipo de Cliente</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                            >
                                {types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        
                        {/* Marca Preferida */}
                        <div>
                            <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Marca Preferida</label>
                            <select
                                name="preferredBrand"
                                value={formData.preferredBrand}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                            >
                                {brands.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        
                        {/* Nivel de Lealtad */}
                        <div>
                            <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Nivel de Lealtad</label>
                            <select
                                name="loyaltyTier"
                                value={formData.loyaltyTier}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                            >
                                {loyaltyTiers.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        
                        {/* Estado */}
                        <div>
                            <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Estado</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                        
                        {/* Vehículos */}
                        <div>
                            <label className="block text-xs font-semibold text-[#AFC8E6] mb-1">Número de Vehículos</label>
                            <input
                                type="number"
                                name="vehicles"
                                value={formData.vehicles}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 bg-[#0B1E3A]/80 border ${errors.vehicles ? 'border-red-500' : 'border-[#1E90FF]/30'} rounded-lg text-sm text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]`}
                                min="1"
                            />
                            {errors.vehicles && <p className="text-red-400 text-[10px] mt-1">{errors.vehicles}</p>}
                        </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            className="flex-1 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-medium flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Guardar Cliente
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#AFC8E6] border border-[#1E90FF]/30 flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancelar
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// =============================================
// MODAL DE DETALLE DE CLIENTE
// =============================================
const CustomerDetailModal = ({ customer, onClose }) => {
    if (!customer) return null;
    
    const paymentData = {
        labels: customer.paymentHistory.map(p => p.month),
        datasets: [{
            label: 'Gasto Mensual (MXN)',
            data: customer.paymentHistory.map(p => p.amount),
            borderColor: '#1E90FF',
            backgroundColor: 'rgba(30, 144, 255, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };
    
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
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-3xl w-full p-6 border border-[#1E90FF]/30 shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Contenido del modal de detalle - igual que antes */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#1E90FF] to-[#3B82F6] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#EAF3FF]">{customer.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${customer.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${customer.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                                    {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                                </span>
                                <span className="text-xs text-[#AFC8E6]">{customer.type}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors">
                        <X className="w-5 h-5 text-[#AFC8E6]" />
                    </button>
                </div>
                
                {/* KPIs del cliente */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
                        <p className="text-[10px] text-[#AFC8E6]">Total Gastado</p>
                        <p className="text-lg font-bold text-[#1E90FF]">${customer.totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
                        <p className="text-[10px] text-[#AFC8E6]">Pedidos</p>
                        <p className="text-lg font-bold text-[#EAF3FF]">{customer.orders}</p>
                    </div>
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
                        <p className="text-[10px] text-[#AFC8E6]">Rating</p>
                        <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-lg font-bold text-[#EAF3FF]">{customer.rating}</span>
                        </div>
                    </div>
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
                        <p className="text-[10px] text-[#AFC8E6]">Lealtad</p>
                        <p className="text-lg font-bold text-amber-400">{customer.loyaltyTier}</p>
                    </div>
                </div>
                
                {/* Información de contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-3 bg-[#0B1E3A]/60 rounded-lg">
                    <div>
                        <p className="text-xs text-[#AFC8E6] flex items-center gap-2"><User className="w-3 h-3" /> Contacto</p>
                        <p className="text-sm font-semibold text-[#EAF3FF]">{customer.contact}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#AFC8E6] flex items-center gap-2"><Mail className="w-3 h-3" /> Email</p>
                        <p className="text-sm text-[#EAF3FF]">{customer.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#AFC8E6] flex items-center gap-2"><Phone className="w-3 h-3" /> Teléfono</p>
                        <p className="text-sm text-[#EAF3FF]">{customer.phone}</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#AFC8E6] flex items-center gap-2"><MapPin className="w-3 h-3" /> Ubicación</p>
                        <p className="text-sm text-[#EAF3FF]">{customer.location}</p>
                    </div>
                </div>
                
                {/* Gráfico de gastos */}
                <div className="mb-6 p-3 bg-[#0B1E3A]/60 rounded-lg">
                    <h4 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#1E90FF]" />
                        Historial de Gastos (últimos 6 meses)
                    </h4>
                    <div className="h-64">
                        <Line data={paymentData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#AFC8E6' } } }, scales: { y: { ticks: { color: '#AFC8E6' } }, x: { ticks: { color: '#AFC8E6' } } } }} />
                    </div>
                </div>
                
                {/* Interacciones recientes */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[#EAF3FF] mb-3 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-[#1E90FF]" />
                        Interacciones Recientes
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {customer.interactions.slice(0, 5).map((interaction, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-2 bg-[#0B1E3A]/40 rounded-lg">
                                <div className="p-1 bg-[#1E90FF]/20 rounded-lg">
                                    {interaction.type === 'Pedido' ? <ShoppingBag className="w-3 h-3 text-[#1E90FF]" /> :
                                     interaction.type === 'Llamada' ? <Phone className="w-3 h-3 text-[#1E90FF]" /> :
                                     interaction.type === 'Email' ? <Mail className="w-3 h-3 text-[#1E90FF]" /> :
                                     <Calendar className="w-3 h-3 text-[#1E90FF]" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium text-[#EAF3FF]">{interaction.type}</p>
                                        <p className="text-[9px] text-[#AFC8E6]">{interaction.date}</p>
                                    </div>
                                    <p className="text-[10px] text-[#AFC8E6]">{interaction.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Acciones */}
                <div className="flex gap-3 mt-4">
                    <button className="flex-1 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-medium flex items-center justify-center gap-2 text-sm">
                        <Edit className="w-4 h-4" /> Editar
                    </button>
                    <button className="flex-1 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#1E90FF] border border-[#1E90FF]/30 flex items-center justify-center gap-2 text-sm">
                        <Send className="w-4 h-4" /> Enviar Mensaje
                    </button>
                    <button className="flex-1 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#1E90FF] border border-[#1E90FF]/30 flex items-center justify-center gap-2 text-sm">
                        <Printer className="w-4 h-4" /> Imprimir
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Modal de analítica de clientes
const CustomerAnalyticsModal = ({ isOpen, onClose, customers }) => {
    if (!isOpen) return null;
    
    const segmentData = {
        labels: ['Enterprise', 'Business', 'Premium', 'Small Business'],
        datasets: [{
            data: [
                customers.filter(c => c.segment === 'Enterprise').length,
                customers.filter(c => c.segment === 'Business').length,
                customers.filter(c => c.segment === 'Premium').length,
                customers.filter(c => c.segment === 'Small Business').length
            ],
            backgroundColor: ['#1E90FF', '#3B82F6', '#8B5CF6', '#10B981'],
            borderWidth: 0
        }]
    };
    
    const loyaltyData = {
        labels: ['Platinum', 'Gold', 'Silver'],
        datasets: [{
            data: [
                customers.filter(c => c.loyaltyTier === 'Platinum').length,
                customers.filter(c => c.loyaltyTier === 'Gold').length,
                customers.filter(c => c.loyaltyTier === 'Silver').length
            ],
            backgroundColor: ['#8B5CF6', '#F59E0B', '#6B7280'],
            borderWidth: 0
        }]
    };
    
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgCustomerValue = totalRevenue / customers.length;
    
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
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-3xl w-full p-6 border border-[#1E90FF]/30 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#EAF3FF] flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-[#1E90FF]" />
                        Analítica de Clientes
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors">
                        <X className="w-5 h-5 text-[#AFC8E6]" />
                    </button>
                </div>
                
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
                        <p className="text-xs text-[#AFC8E6]">Total Clientes</p>
                        <p className="text-2xl font-bold text-[#EAF3FF]">{customers.length}</p>
                    </div>
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
                        <p className="text-xs text-[#AFC8E6]">Ingresos Totales</p>
                        <p className="text-2xl font-bold text-[#1E90FF]">${(totalRevenue / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
                        <p className="text-xs text-[#AFC8E6]">Valor Promedio</p>
                        <p className="text-2xl font-bold text-[#EAF3FF]">${Math.round(avgCustomerValue).toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-[#0B1E3A]/60 rounded-lg text-center">
                        <p className="text-xs text-[#AFC8E6]">Clientes Activos</p>
                        <p className="text-2xl font-bold text-emerald-400">{customers.filter(c => c.status === 'active').length}</p>
                    </div>
                </div>
                
                {/* Gráficos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0B1E3A]/60 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-[#EAF3FF] mb-3">Distribución por Segmento</h4>
                        <div className="h-64">
                            <Doughnut data={segmentData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#AFC8E6' } } } }} />
                        </div>
                    </div>
                    <div className="bg-[#0B1E3A]/60 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-[#EAF3FF] mb-3">Niveles de Lealtad</h4>
                        <div className="h-64">
                            <Doughnut data={loyaltyData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#AFC8E6' } } } }} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// =============================================
// COMPONENTE PRINCIPAL CUSTOMERS
// =============================================
const Customers = () => {
    const [customersData, setCustomersData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSegment, setSelectedSegment] = useState('all');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    
    // Generar datos al montar
    useEffect(() => {
        const data = generateCustomersData();
        setCustomersData(data);
    }, []);
    
    // Agregar nuevo cliente
    const addCustomer = useCallback((newCustomer) => {
        setCustomersData(prev => [newCustomer, ...prev]);
        // Mostrar notificación de éxito
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-emerald-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up';
        notification.innerHTML = '✅ Cliente agregado exitosamente';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }, []);
    
    // Filtrar clientes
    const filteredCustomers = useMemo(() => {
        return customersData.filter(customer => {
            const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 customer.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSegment = selectedSegment === 'all' || customer.segment === selectedSegment;
            return matchesSearch && matchesSegment;
        });
    }, [customersData, searchTerm, selectedSegment]);
    
    // Estadísticas
    const stats = useMemo(() => {
        const totalCustomers = filteredCustomers.length;
        const activeCustomers = filteredCustomers.filter(c => c.status === 'active').length;
        const totalRevenue = filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
        const avgOrderValue = totalRevenue / filteredCustomers.reduce((sum, c) => sum + c.orders, 0);
        const segments = {
            Enterprise: filteredCustomers.filter(c => c.segment === 'Enterprise').length,
            Business: filteredCustomers.filter(c => c.segment === 'Business').length,
            Premium: filteredCustomers.filter(c => c.segment === 'Premium').length,
            'Small Business': filteredCustomers.filter(c => c.segment === 'Small Business').length
        };
        return { totalCustomers, activeCustomers, totalRevenue, avgOrderValue, segments };
    }, [filteredCustomers]);
    
    // Paginación
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    const exportToCSV = () => {
        const headers = ['Nombre', 'Contacto', 'Email', 'Teléfono', 'Ubicación', 'Segmento', 'Pedidos', 'Gasto Total', 'Status'];
        const rows = filteredCustomers.map(c => [
            c.name, c.contact, c.email, c.phone, c.location, c.segment, c.orders, c.totalSpent, c.status
        ]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `clientes_${new Date().toISOString().slice(0, 19)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    const getSegmentBadge = (segment) => {
        const colors = {
            'Enterprise': 'from-purple-500 to-indigo-600',
            'Business': 'from-[#1E90FF] to-[#3B82F6]',
            'Premium': 'from-amber-500 to-orange-600',
            'Small Business': 'from-emerald-500 to-teal-600'
        };
        return colors[segment] || 'from-gray-500 to-gray-600';
    };
    
    const getLoyaltyIcon = (tier) => {
        switch(tier) {
            case 'Platinum': return <Star className="w-4 h-4 text-purple-400 fill-purple-400" />;
            case 'Gold': return <Star className="w-4 h-4 text-amber-400 fill-amber-400" />;
            default: return <Star className="w-4 h-4 text-[#1E90FF]" />;
        }
    };
    
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">
                        Gestión de Clientes
                    </h1>
                    <p className="text-[#AFC8E6] mt-1 flex items-center gap-2">
                        <Users size={14} className="text-[#1E90FF]" />
                        CRM avanzado para relaciones comerciales
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full lg:w-80 pl-12 pr-4 py-3 bg-[#102A4C]/80 backdrop-blur-sm border border-[#1E90FF]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent shadow-inner text-[#EAF3FF] placeholder-[#AFC8E6]/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E90FF]" />
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAnalytics(true)}
                        className="px-5 py-3 rounded-xl font-semibold bg-[#102A4C]/80 backdrop-blur-sm border border-[#1E90FF]/30 text-[#1E90FF] shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <BarChart3 size={16} />
                        Analítica
                    </motion.button>
                    
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowNewCustomerModal(true)}
                        className="px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md hover:shadow-lg hover:shadow-[#1E90FF]/25 transition-all flex items-center gap-2"
                    >
                        <UserPlus size={16} />
                        Nuevo Cliente
                    </motion.button>
                </div>
            </div>
            
            {/* Stats Cards */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
                {[
                    { label: 'Clientes Totales', value: stats.totalCustomers, icon: Users, color: 'from-[#1E90FF] to-[#3B82F6]', change: '+12%' },
                    { label: 'Ingresos Totales', value: `$${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'from-emerald-500 to-teal-600', change: '+8%' },
                    { label: 'Valor Promedio', value: `$${Math.round(stats.avgOrderValue).toLocaleString()}`, icon: ShoppingBag, color: 'from-amber-500 to-orange-600', change: '+5%' },
                    { label: 'Clientes Activos', value: stats.activeCustomers, icon: Activity, color: 'from-purple-500 to-pink-600', change: '+15%' }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        variants={fadeInUp}
                        whileHover={{ y: -4 }}
                        className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-[#AFC8E6] uppercase tracking-wide">{stat.label}</p>
                            <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-xl shadow-md text-white`}>
                                {React.createElement(stat.icon, { className: 'w-4 h-4' })}
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-[#EAF3FF]">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-400">{stat.change} vs mes anterior</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            
            {/* Segments Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg border border-[#1E90FF]/20"
            >
                <h3 className="text-base font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#1E90FF]" />
                    Segmentación de Clientes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(stats.segments).map(([segment, count]) => (
                        <button
                            key={segment}
                            onClick={() => setSelectedSegment(selectedSegment === segment ? 'all' : segment)}
                            className={`p-3 rounded-xl text-center transition-all ${
                                selectedSegment === segment
                                    ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md'
                                    : 'bg-[#0B1E3A]/60 border border-[#1E90FF]/30 hover:bg-[#1E4D7A] text-[#AFC8E6]'
                            }`}
                        >
                            <p className="text-xl font-bold">{count}</p>
                            <p className="text-xs font-medium mt-1">{segment}</p>
                        </button>
                    ))}
                </div>
            </motion.div>
            
            {/* Customers Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-5"
            >
                {paginatedCustomers.map((customer) => (
                    <motion.div
                        key={customer.id}
                        variants={fadeInUp}
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#1E90FF]/20 transition-all border border-[#1E90FF]/20 cursor-pointer"
                        onClick={() => setSelectedCustomer(customer)}
                    >
                        {/* Customer Header */}
                        <div className="p-4 bg-gradient-to-r from-[#0B1E3A]/50 to-[#102A4C]/50 border-b border-[#1E90FF]/20">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${getSegmentBadge(customer.segment)} rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md`}>
                                        {customer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base font-bold text-[#EAF3FF]">{customer.name}</h3>
                                            {getLoyaltyIcon(customer.loyaltyTier)}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${customer.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${customer.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                                                {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                                            </span>
                                            <span className="text-[10px] text-[#AFC8E6]">{customer.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-[#1E90FF]">${customer.totalSpent.toLocaleString()}</p>
                                    <p className="text-[10px] text-[#AFC8E6]">Gasto total</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Customer Details */}
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-xs">
                                    <User className="w-3.5 h-3.5 text-[#1E90FF]" />
                                    <span className="text-[#AFC8E6]">{customer.contact}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Mail className="w-3.5 h-3.5 text-[#1E90FF]" />
                                    <span className="text-[#AFC8E6] truncate">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Phone className="w-3.5 h-3.5 text-[#1E90FF]" />
                                    <span className="text-[#AFC8E6]">{customer.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <MapPin className="w-3.5 h-3.5 text-[#1E90FF]" />
                                    <span className="text-[#AFC8E6]">{customer.location}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 pt-2">
                                <div className="text-center p-2 bg-[#0B1E3A]/60 rounded-lg border border-[#1E90FF]/20">
                                    <ShoppingBag className="w-3.5 h-3.5 text-[#1E90FF] mx-auto mb-1" />
                                    <p className="text-base font-bold text-[#EAF3FF]">{customer.orders}</p>
                                    <p className="text-[9px] text-[#AFC8E6]">Pedidos</p>
                                </div>
                                <div className="text-center p-2 bg-[#0B1E3A]/60 rounded-lg border border-[#1E90FF]/20">
                                    <Truck className="w-3.5 h-3.5 text-[#1E90FF] mx-auto mb-1" />
                                    <p className="text-base font-bold text-[#EAF3FF]">{customer.vehicles}</p>
                                    <p className="text-[9px] text-[#AFC8E6]">Vehículos</p>
                                </div>
                                <div className="text-center p-2 bg-[#0B1E3A]/60 rounded-lg border border-[#1E90FF]/20">
                                    <Star className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1 fill-amber-400" />
                                    <p className="text-base font-bold text-[#EAF3FF]">{customer.rating}</p>
                                    <p className="text-[9px] text-[#AFC8E6]">Rating</p>
                                </div>
                            </div>
                            
                            {/* Preferred Brand */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#1E90FF]/20">
                                <div className="flex items-center gap-2">
                                    <Award className="w-3.5 h-3.5 text-[#1E90FF]" />
                                    <span className="text-xs text-[#AFC8E6]">Marca preferida:</span>
                                    <span className="text-xs font-semibold text-[#EAF3FF]">{customer.preferredBrand}</span>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }}
                                    className="text-[#1E90FF] hover:text-[#3B82F6] text-xs font-medium flex items-center gap-1"
                                >
                                    Ver detalles <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
            
            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between flex-wrap gap-4 pt-4">
                    <p className="text-xs text-[#AFC8E6]">
                        Mostrando <span className="font-semibold text-[#EAF3FF]">{paginatedCustomers.length}</span> de <span className="font-semibold text-[#EAF3FF]">{filteredCustomers.length}</span> clientes
                    </p>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                                currentPage === 1
                                    ? 'bg-[#0B1E3A]/50 text-[#AFC8E6]/50 cursor-not-allowed'
                                    : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:text-[#EAF3FF] border border-[#1E90FF]/30 hover:shadow-lg'
                            }`}
                        >
                            Anterior
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-4 py-2 rounded-xl font-semibold transition-all text-sm ${
                                        currentPage === pageNum
                                            ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md shadow-[#1E90FF]/25'
                                            : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:bg-[#1E4D7A] border border-[#1E90FF]/30'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                                currentPage === totalPages
                                    ? 'bg-[#0B1E3A]/50 text-[#AFC8E6]/50 cursor-not-allowed'
                                    : 'bg-[#102A4C]/80 text-[#AFC8E6] hover:text-[#EAF3FF] border border-[#1E90FF]/30 hover:shadow-lg'
                            }`}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
            
            {/* Recent Interactions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg border border-[#1E90FF]/20"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-[#EAF3FF] flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#1E90FF]" />
                        Actividad Reciente
                    </h3>
                    <button className="text-xs text-[#1E90FF] hover:text-[#3B82F6] font-medium flex items-center gap-1">
                        Ver todas <ChevronRight size={12} />
                    </button>
                </div>
                
                <div className="space-y-2">
                    {customersData.slice(0, 5).flatMap(customer => 
                        customer.interactions.slice(0, 1).map((interaction, idx) => (
                            <div key={`${customer.id}-${idx}`} className="flex items-start gap-3 p-3 bg-[#0B1E3A]/60 rounded-xl border border-[#1E90FF]/20 hover:bg-[#1E4D7A]/30 transition-all cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                                <div className="p-1.5 bg-[#1E90FF]/20 rounded-lg">
                                    {interaction.type === 'Pedido' ? <ShoppingBag className="w-3.5 h-3.5 text-[#1E90FF]" /> :
                                     interaction.type === 'Llamada' ? <Phone className="w-3.5 h-3.5 text-[#1E90FF]" /> :
                                     interaction.type === 'Email' ? <Mail className="w-3.5 h-3.5 text-[#1E90FF]" /> :
                                     <Calendar className="w-3.5 h-3.5 text-[#1E90FF]" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-[#EAF3FF] text-sm">{customer.name}</p>
                                        <p className="text-[10px] text-[#AFC8E6]">{interaction.date}</p>
                                    </div>
                                    <p className="text-xs text-[#AFC8E6]">{interaction.description}</p>
                                    <p className="text-[10px] text-[#1E90FF] mt-1">{interaction.type}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
            
            {/* Loyalty Program Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-xl p-5 shadow-lg"
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-base">Programa de Fidelización</h4>
                            <p className="text-white/80 text-xs">Acumula puntos y obtén beneficios exclusivos</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1.5 bg-white/20 rounded-lg text-white text-xs font-medium">Platinum: 5% descuento</span>
                        <span className="px-3 py-1.5 bg-white/20 rounded-lg text-white text-xs font-medium">Gold: 3% descuento</span>
                        <span className="px-3 py-1.5 bg-white/20 rounded-lg text-white text-xs font-medium">Silver: 1% descuento</span>
                    </div>
                </div>
            </motion.div>
            
            {/* Export Footer */}
            <div className="flex justify-between items-center pt-4">
                <p className="text-xs text-[#AFC8E6]">
                    Mostrando <span className="font-semibold text-[#EAF3FF]">{filteredCustomers.length}</span> de <span className="font-semibold text-[#EAF3FF]">{customersData.length}</span> clientes
                </p>
                <div className="flex gap-2">
                    <button onClick={exportToCSV} className="px-3 py-1.5 bg-[#102A4C]/80 backdrop-blur rounded-lg shadow-md border border-[#1E90FF]/30 hover:shadow-lg text-[#AFC8E6] hover:text-[#EAF3FF] font-medium transition-all text-xs flex items-center gap-2">
                        <Download size={12} />
                        Exportar CSV
                    </button>
                    <button className="px-3 py-1.5 bg-[#102A4C]/80 backdrop-blur rounded-lg shadow-md border border-[#1E90FF]/30 hover:shadow-lg text-[#AFC8E6] hover:text-[#EAF3FF] font-medium transition-all text-xs flex items-center gap-2">
                        <RefreshCw size={12} />
                        Sincronizar
                    </button>
                </div>
            </div>
            
            {/* Modales */}
            <AnimatePresence>
                {selectedCustomer && <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
            </AnimatePresence>
            
            <AnimatePresence>
                {showAnalytics && <CustomerAnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} customers={filteredCustomers} />}
            </AnimatePresence>
            
            <AnimatePresence>
                {showNewCustomerModal && <NewCustomerModal isOpen={showNewCustomerModal} onClose={() => setShowNewCustomerModal(false)} onAddCustomer={addCustomer} />}
            </AnimatePresence>
        </div>
    );
};

export default Customers;