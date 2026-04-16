import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, Plus, MapPin, Clock, CheckCircle, AlertCircle, 
  X, Download, Eye, ArrowDown, History, BarChart3, 
  Package, TrendingUp, Users, Calendar, Filter, Search,
  ChevronDown, ChevronUp, RefreshCw, Shield, Award,
  Globe, Phone, Mail, Navigation, Target, Activity,
  AlertTriangle, Gauge, Route, Bell, Zap, Wind, Sun, CloudRain,
  Thermometer, Compass, Fuel, Battery, Wifi, Signal, Car,
  Map as MapIcon, Layers, Navigation2, Radio, Radar, Info, FileSpreadsheet
} from 'lucide-react';

// ==================== COMPONENTE DE MAPA CON CARGA DINÁMICA ====================
const LazyMap = ({ center, zoom, mapContent, ...props }) => {
  const [LeafletComponents, setLeafletComponents] = useState(null);
  const [L, setL] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const createVehicleIcon = React.useCallback((status, isSelected = false) => {
    if (!L) return null;
    const colors = {
      'En tránsito': '#1E90FF',
      'Pendiente': '#F59E0B',
      'Entregado': '#10B981',
      'Retrasado': '#EF4444'
    };
    const color = colors[status] || '#6B7280';
    const size = isSelected ? 36 : 32;
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
        <svg width="${size-12}" height="${size-12}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <circle cx="12" cy="12" r="3" fill="white"/>
        </svg>
      </div>`,
      className: 'custom-vehicle-marker',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2]
    });
  }, [L]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
      import('leaflet/dist/leaflet.css')
    ]).then(([leafletModule, reactLeafletModule]) => {
      if (!isMounted) return;
      try {
        const L = leafletModule.default;
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        setL(L);
        setLeafletComponents(reactLeafletModule);
        setIsLoading(false);
      } catch (e) {
        console.error('Error configuring Leaflet:', e);
        setIsLoading(false);
      }
    }).catch(err => {
      console.error('Error cargando Leaflet:', err);
      setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  if (isLoading || !LeafletComponents || !L) {
    return (
      <div className="h-full w-full bg-[#0B1E3A] rounded-xl flex items-center justify-center text-[#AFC8E6]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1E90FF] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } = LeafletComponents;

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (center && map) {
        try {
          map.setView([center.lat, center.lng], zoom || 6);
        } catch (e) {
          console.error('Error setting view:', e);
        }
      }
    }, [center, map, zoom]);
    return null;
  };

  const content = typeof mapContent === 'function' 
    ? mapContent({ Marker, Popup, Polyline, CircleMarker, createVehicleIcon }) 
    : mapContent;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={{ height: '100%', width: '100%', background: '#0B1E3A' }}
      zoomControl={false}
      {...props}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapUpdater />
      {content}
    </MapContainer>
  );
};

// ==================== COMPONENTE DOLLAR SIGN ====================
const DollarSign = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ==================== COMPONENTE PRINCIPAL LOGISTIC ====================
const Logistic = () => {
  // ==================== INVENTARIO ====================
  const [inventory, setInventory] = useState({
    "Michelin Pilot Sport 4S": { stock: 184, minStock: 50, maxStock: 300, location: "Bodega Central" },
    "Hankook Ventus S1 evo3": { stock: 312, minStock: 60, maxStock: 400, location: "Bodega Norte" },
    "Bridgestone Turanza T005": { stock: 87, minStock: 40, maxStock: 250, location: "Bodega Sur" },
    "Michelin Energy Saver": { stock: 245, minStock: 55, maxStock: 350, location: "Bodega Central" },
    "Continental PremiumContact 6": { stock: 156, minStock: 45, maxStock: 280, location: "Bodega Este" },
    "Pirelli P Zero Corsa": { stock: 42, minStock: 30, maxStock: 200, location: "Bodega Oeste" },
    "Goodyear Eagle F1": { stock: 98, minStock: 35, maxStock: 220, location: "Bodega Norte" },
    "Yokohama Advan Sport": { stock: 67, minStock: 25, maxStock: 180, location: "Bodega Sur" }
  });

  // ==================== HISTORIAL ====================
  const [history, setHistory] = useState([
    { id: 1, date: "2026-04-11", type: "Salida", product: "Bridgestone Turanza T005", qty: 32, destination: "Llantas del Bajío", user: "Admin", status: "Completado" },
    { id: 2, date: "2026-04-10", type: "Entrada", product: "Michelin Energy Saver", qty: 80, destination: "Compra a Michelin", user: "Admin", status: "Completado" },
    { id: 3, date: "2026-04-09", type: "Salida", product: "Continental PremiumContact 6", qty: 24, destination: "Auto Sport Racing", user: "Admin", status: "Completado" },
    { id: 4, date: "2026-04-08", type: "Entrada", product: "Pirelli P Zero Corsa", qty: 50, destination: "Proveedor Italia", user: "Admin", status: "Completado" },
    { id: 5, date: "2026-04-07", type: "Salida", product: "Hankook Ventus S1 evo3", qty: 48, destination: "Neumáticos Express", user: "Admin", status: "Completado" }
  ]);

  // ==================== UBICACIONES PREDEFINIDAS ====================
  const locations = {
    "Bodega Central": { lat: 19.4326, lng: -99.1332, name: "Bodega Central CDMX" },
    "Bodega Norte": { lat: 20.5888, lng: -100.3899, name: "Bodega Norte Querétaro" },
    "Bodega Sur": { lat: 18.9242, lng: -99.2216, name: "Bodega Sur Morelos" },
    "Bodega Este": { lat: 19.0413, lng: -98.2062, name: "Bodega Este Puebla" },
    "Bodega Oeste": { lat: 20.6736, lng: -103.344, name: "Bodega Oeste Guadalajara" },
    "Querétaro, QRO": { lat: 20.5888, lng: -100.3899, name: "Querétaro" },
    "León, GTO": { lat: 21.1167, lng: -101.6833, name: "León" },
    "Monterrey, NL": { lat: 25.6866, lng: -100.3161, name: "Monterrey" },
    "Llantas del Bajío": { lat: 20.5888, lng: -100.3899, name: "Llantas del Bajío" },
    "Auto Sport Racing": { lat: 19.4326, lng: -99.1332, name: "Auto Sport Racing" },
    "Neumáticos Express": { lat: 25.6866, lng: -100.3161, name: "Neumáticos Express" },
    "Performance Motors": { lat: 25.6866, lng: -100.3161, name: "Performance Motors" }
  };

  // ==================== ENVÍOS CON SEGUIMIENTO EN TIEMPO REAL ====================
  const [shipments, setShipments] = useState([
    { 
      id: "ENV-001", type: "Cliente", customer: "Auto Rodados S.A.", destination: "Querétaro, QRO", 
      date: "2026-04-12", estimated: "2026-04-14", status: "En tránsito", product: "Michelin Pilot Sport 4S", 
      quantity: 48, driver: "Juan Pérez", vehicle: "Truck-001", tracking: "TRK-001",
      currentLocation: { lat: 19.8, lng: -99.5, progress: 0.35 },
      route: [
        { lat: 19.4326, lng: -99.1332 },
        { lat: 20.5888, lng: -100.3899 }
      ],
      speed: 85,
      fuel: 65,
      lastUpdate: new Date().toISOString(),
      delay: 0
    },
    { 
      id: "ENV-002", type: "Proveedor", customer: "Continental México", destination: "Bodega Central", 
      date: "2026-04-11", estimated: "2026-04-13", status: "Pendiente", product: "Hankook Ventus S1 evo3", 
      quantity: 120, driver: "Carlos López", vehicle: "Truck-002", tracking: "TRK-002",
      currentLocation: { lat: 19.4326, lng: -99.1332, progress: 0 },
      route: [
        { lat: 20.5888, lng: -100.3899 },
        { lat: 19.4326, lng: -99.1332 }
      ],
      speed: 0,
      fuel: 95,
      lastUpdate: new Date().toISOString(),
      delay: 0
    },
    { 
      id: "ENV-003", type: "Cliente", customer: "Llantas del Bajío", destination: "León, GTO", 
      date: "2026-04-10", estimated: "2026-04-12", status: "Entregado", product: "Bridgestone Turanza T005", 
      quantity: 32, driver: "María García", vehicle: "Truck-003", tracking: "TRK-003",
      currentLocation: { lat: 21.1167, lng: -101.6833, progress: 1 },
      route: [
        { lat: 19.4326, lng: -99.1332 },
        { lat: 21.1167, lng: -101.6833 }
      ],
      speed: 0,
      fuel: 45,
      lastUpdate: new Date().toISOString(),
      delay: 0
    },
    { 
      id: "ENV-004", type: "Cliente", customer: "Performance Motors", destination: "Monterrey, NL", 
      date: "2026-04-13", estimated: "2026-04-15", status: "En tránsito", product: "Pirelli P Zero Corsa", 
      quantity: 24, driver: "Luis Ramírez", vehicle: "Truck-004", tracking: "TRK-004",
      currentLocation: { lat: 20.2, lng: -100.8, progress: 0.25 },
      route: [
        { lat: 19.4326, lng: -99.1332 },
        { lat: 25.6866, lng: -100.3161 }
      ],
      speed: 92,
      fuel: 78,
      lastUpdate: new Date().toISOString(),
      delay: 15
    },
    { 
      id: "ENV-005", type: "Proveedor", customer: "Goodyear México", destination: "Bodega Norte", 
      date: "2026-04-09", estimated: "2026-04-11", status: "En tránsito", product: "Goodyear Eagle F1", 
      quantity: 80, driver: "Ana Torres", vehicle: "Truck-005", tracking: "TRK-005",
      currentLocation: { lat: 19.9, lng: -99.8, progress: 0.65 },
      route: [
        { lat: 19.4326, lng: -99.1332 },
        { lat: 20.5888, lng: -100.3899 }
      ],
      speed: 78,
      fuel: 52,
      lastUpdate: new Date().toISOString(),
      delay: 0
    }
  ]);

  // ==================== ALERTAS ====================
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Envío ENV-004 con retraso de 15 minutos', time: 'Hace 5 min', read: false },
    { id: 2, type: 'info', message: 'Clima adverso en ruta a Monterrey', time: 'Hace 15 min', read: false },
    { id: 3, type: 'success', message: 'Envío ENV-003 entregado exitosamente', time: 'Hace 2 horas', read: true }
  ]);

  const [activeTab, setActiveTab] = useState('envios');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filtros de fecha
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const itemsPerPage = 5;

  // Estados para el mapa
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 23.6345, lng: -102.5528 });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showRoutesPanel, setShowRoutesPanel] = useState(false);
  const [showAlertsPanel, setShowAlertsPanel] = useState(true);

  // Modales
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [notification, setNotification] = useState(null);

  // Formulario Nuevo Envío
  const [newShipment, setNewShipment] = useState({
    type: "Cliente",
    customer: "",
    destination: "",
    product: "",
    quantity: "",
    estimated: "",
    driver: "",
    vehicle: ""
  });

  // Formulario Entrada de Inventario
  const [newStockEntry, setNewStockEntry] = useState({
    product: "",
    quantity: "",
    supplier: "",
    cost: ""
  });
  const [showStockModal, setShowStockModal] = useState(false);

  // ==================== SIMULACIÓN DE MOVIMIENTO EN TIEMPO REAL ====================
  useEffect(() => {
    const interval = setInterval(() => {
      setShipments(prev => prev.map(shipment => {
        if (shipment.status !== 'En tránsito') return shipment;
        
        const route = shipment.route;
        if (!route || route.length < 2) return shipment;
        
        let progress = shipment.currentLocation.progress + 0.005;
        if (progress >= 1) {
          progress = 1;
          return {
            ...shipment,
            status: 'Entregado',
            currentLocation: { ...shipment.currentLocation, progress: 1, lat: route[1].lat, lng: route[1].lng },
            speed: 0
          };
        }
        
        const lat = route[0].lat + (route[1].lat - route[0].lat) * progress;
        const lng = route[0].lng + (route[1].lng - route[0].lng) * progress;
        
        const speedVariation = Math.sin(Date.now() / 10000) * 5;
        const newSpeed = Math.max(40, Math.min(110, shipment.speed + speedVariation));
        const newFuel = Math.max(0, shipment.fuel - 0.1);
        
        let newDelay = shipment.delay;
        if (Math.random() < 0.05 && progress < 0.9) {
          newDelay += Math.floor(Math.random() * 5);
          if (newDelay > 0 && shipment.delay === 0) {
            addAlert('warning', `Envío ${shipment.id} está experimentando retrasos`, true);
          }
        }
        
        return {
          ...shipment,
          currentLocation: { lat, lng, progress },
          speed: Math.round(newSpeed),
          fuel: Math.round(newFuel),
          lastUpdate: new Date().toISOString(),
          delay: newDelay
        };
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // ==================== FUNCIONES AUXILIARES ====================
  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const addAlert = (type, message, showNotif = false) => {
    const newAlert = {
      id: Date.now(),
      type,
      message,
      time: 'Ahora',
      read: false
    };
    setAlerts(prev => [newAlert, ...prev]);
    if (showNotif) {
      showNotification(message, type === 'warning' ? 'warning' : 'info');
    }
  };

  const confirmDelivery = useCallback((id) => {
    const shipment = shipments.find(s => s.id === id);
    if (!shipment || shipment.status === 'Entregado') return;

    setShipments(prev => prev.map(s => s.id === id ? { ...s, status: 'Entregado', speed: 0 } : s));

    setInventory(prev => {
      const current = prev[shipment.product]?.stock || 0;
      const newStock = Math.max(0, current - shipment.quantity);
      const minStock = prev[shipment.product]?.minStock || 0;

      if (newStock < minStock && current >= minStock) {
        showNotification(`⚠️ Stock crítico: ${shipment.product} tiene ${newStock} unidades (mínimo: ${minStock})`, 'warning');
      }

      return { ...prev, [shipment.product]: { ...prev[shipment.product], stock: newStock } };
    });

    setHistory(prev => [{
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: "Salida",
      product: shipment.product,
      qty: shipment.quantity,
      destination: shipment.destination,
      user: "Admin",
      status: "Completado"
    }, ...prev]);

    addAlert('success', `✅ Envío ${shipment.id} entregado exitosamente`, true);
  }, [shipments]);

  const createNewShipment = useCallback(() => {
    // Validaciones
    if (!newShipment.customer || !newShipment.product || !newShipment.quantity) {
      showNotification("❌ Completa los campos obligatorios", 'error');
      return;
    }

    // Validación de cantidad
    const qty = parseInt(newShipment.quantity);
    if (isNaN(qty) || qty <= 0) {
      showNotification("❌ La cantidad debe ser un número mayor a 0", 'error');
      return;
    }

    // Validación de fecha estimada
    if (newShipment.estimated) {
      const estimatedDate = new Date(newShipment.estimated);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (estimatedDate < today) {
        showNotification("❌ La fecha estimada no puede ser anterior a hoy", 'error');
        return;
      }
    }

    // Validación de stock
    const productStock = inventory[newShipment.product]?.stock || 0;
    if (qty > productStock) {
      showNotification(`❌ Stock insuficiente. Solo hay ${productStock} unidades disponibles`, 'error');
      return;
    }

    const originCoords = locations["Bodega Central"] || { lat: 19.4326, lng: -99.1332 };
    const destKey = Object.keys(locations).find(key => 
      newShipment.destination.includes(key) || key.includes(newShipment.destination)
    );
    const destCoords = locations[destKey] || { lat: 19.4326, lng: -99.1332 };

    const shipment = {
      id: `ENV-${String(shipments.length + 100).padStart(3, '0')}`,
      type: newShipment.type,
      customer: newShipment.customer,
      destination: newShipment.destination,
      date: new Date().toISOString().split('T')[0],
      estimated: newShipment.estimated || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "Pendiente",
      product: newShipment.product,
      quantity: parseInt(newShipment.quantity),
      driver: newShipment.driver || "Por asignar",
      vehicle: newShipment.vehicle || "Por asignar",
      tracking: `TRK-${String(shipments.length + 100).padStart(3, '0')}`,
      currentLocation: { lat: originCoords.lat, lng: originCoords.lng, progress: 0 },
      route: [
        { lat: originCoords.lat, lng: originCoords.lng },
        { lat: destCoords.lat, lng: destCoords.lng }
      ],
      speed: 0,
      fuel: 100,
      lastUpdate: new Date().toISOString(),
      delay: 0
    };

    setShipments([shipment, ...shipments]);
    setShowNewModal(false);
    setNewShipment({ type: "Cliente", customer: "", destination: "", product: "", quantity: "", estimated: "", driver: "", vehicle: "" });
    showNotification("✅ Nuevo envío creado exitosamente", 'success');
    addAlert('info', `Nuevo envío creado: ${shipment.id} a ${shipment.destination}`, false);
  }, [newShipment, shipments, inventory]);

  const addStock = useCallback(() => {
    if (!newStockEntry.product || !newStockEntry.quantity) {
      showNotification("❌ Completa los campos obligatorios", 'error');
      return;
    }

    setInventory(prev => ({
      ...prev,
      [newStockEntry.product]: {
        ...prev[newStockEntry.product],
        stock: (prev[newStockEntry.product]?.stock || 0) + parseInt(newStockEntry.quantity)
      }
    }));

    setHistory(prev => [{
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: "Entrada",
      product: newStockEntry.product,
      qty: parseInt(newStockEntry.quantity),
      destination: newStockEntry.supplier || "Proveedor externo",
      user: "Admin",
      status: "Completado"
    }, ...prev]);

    setShowStockModal(false);
    setNewStockEntry({ product: "", quantity: "", supplier: "", cost: "" });
    showNotification(`✅ Stock agregado: ${newStockEntry.quantity} unidades de ${newStockEntry.product}`, 'success');
  }, [newStockEntry]);

  const markAlertAsRead = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  // ==================== EXPORTAR A EXCEL/CSV ====================
  const exportToCSV = useCallback((shipmentsToExport) => {
    const headers = ['ID', 'Cliente', 'Producto', 'Cantidad', 'Fecha', 'Estado', 'Destino', 'Conductor', 'Retraso (min)'];
    const rows = shipmentsToExport.map(s => [
      s.id,
      s.customer,
      s.product,
      s.quantity,
      s.date,
      s.status,
      s.destination,
      s.driver,
      s.delay || 0
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `envios_neumatiq_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showNotification('✅ Envíos exportados a CSV', 'success');
  }, []);

  const exportHistoryToCSV = useCallback(() => {
    const headers = ['Fecha', 'Tipo', 'Producto', 'Cantidad', 'Destino/Origen', 'Usuario', 'Estado'];
    const rows = history.map(item => [
      item.date,
      item.type,
      item.product,
      item.qty,
      item.destination,
      item.user,
      item.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historial_neumatiq_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showNotification('✅ Historial exportado a CSV', 'success');
  }, [history]);

  const filteredShipments = useMemo(() => {
    let filtered = [...shipments];
    
    // Filtro por búsqueda
    if (search) {
      filtered = filtered.filter(s => 
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.customer.toLowerCase().includes(search.toLowerCase()) ||
        s.product.toLowerCase().includes(search.toLowerCase()) ||
        s.destination.toLowerCase().includes(search.toLowerCase()) ||
        s.driver.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filtro por estado
    if (filter !== 'all') {
      filtered = filtered.filter(s => {
        if (filter === 'pending') return s.status === 'Pendiente';
        if (filter === 'transit') return s.status === 'En tránsito';
        if (filter === 'completed') return s.status === 'Entregado';
        return true;
      });
    }
    
    // Filtro por estado seleccionado
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(s => s.status === selectedStatus);
    }
    
    // Filtro por rango de fechas
    if (dateRange.start) {
      filtered = filtered.filter(s => new Date(s.date) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(s => new Date(s.date) <= new Date(dateRange.end));
    }
    
    // Ordenamiento
    filtered.sort((a, b) => {
      let valA, valB;
      switch(sortField) {
        case 'date': valA = new Date(a.date); valB = new Date(b.date); break;
        case 'customer': valA = a.customer; valB = b.customer; break;
        case 'status': valA = a.status; valB = b.status; break;
        case 'quantity': valA = a.quantity; valB = b.quantity; break;
        case 'delay': valA = a.delay || 0; valB = b.delay || 0; break;
        default: valA = a.date; valB = b.date;
      }
      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
    
    return filtered;
  }, [shipments, search, filter, selectedStatus, sortField, sortOrder, dateRange]);

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = useMemo(() => {
    const totalShipments = shipments.length;
    const completedShipments = shipments.filter(s => s.status === 'Entregado').length;
    const pendingShipments = shipments.filter(s => s.status === 'Pendiente').length;
    const inTransit = shipments.filter(s => s.status === 'En tránsito').length;
    const totalValue = shipments.reduce((sum, s) => sum + (s.quantity * 3500), 0);
    const onTimeRate = shipments.filter(s => s.status === 'Entregado' && new Date(s.estimated) >= new Date(s.date)).length;
    const deliveryRate = completedShipments > 0 ? (onTimeRate / completedShipments) * 100 : 0;
    const avgDelay = shipments.filter(s => s.delay > 0).reduce((sum, s) => sum + s.delay, 0) / (shipments.filter(s => s.delay > 0).length || 1);
    const totalDistance = shipments.reduce((sum, s) => {
      return sum + (s.route ? 
        Math.sqrt(
          Math.pow((s.route[1]?.lat || 0) - (s.route[0]?.lat || 0), 2) + 
          Math.pow((s.route[1]?.lng || 0) - (s.route[0]?.lng || 0), 2)
        ) * 111 : 0
      );
    }, 0);
    
    return { totalShipments, completedShipments, pendingShipments, inTransit, totalValue, deliveryRate, avgDelay, totalDistance };
  }, [shipments]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Entregado': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'En tránsito': return 'bg-[#1E90FF]/20 text-[#1E90FF] border border-[#1E90FF]/30';
      case 'Pendiente': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const activeShipments = shipments.filter(s => s.status === 'En tránsito');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050c1a] to-[#0B1E3A]">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0B1E3A]/90 to-[#102A4C]/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-[#1E90FF]/20 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[#1E90FF] to-[#3B82F6] rounded-2xl shadow-md">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">
                  Logística NeumatiQ
                </h1>
                <p className="text-sm text-[#AFC8E6] mt-1">Gestión integral de envíos, inventario y rastreo en tiempo real</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStockModal(true)}
                className="bg-[#102A4C]/80 hover:bg-[#1E4D7A] text-[#1E90FF] px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all border border-[#1E90FF]/30"
              >
                <Package className="w-4 h-4" /> Agregar Stock
              </button>
              <button
                onClick={() => setShowNewModal(true)}
                className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] hover:shadow-lg hover:shadow-[#1E90FF]/25 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all"
              >
                <Plus className="w-4 h-4" /> Nuevo Envío
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            { label: 'Total Envíos', value: stats.totalShipments, icon: Truck, color: 'from-[#1E90FF] to-[#3B82F6]' },
            { label: 'Entregados', value: stats.completedShipments, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
            { label: 'En Tránsito', value: stats.inTransit, icon: Navigation, color: 'from-amber-500 to-orange-600' },
            { label: 'Pendientes', value: stats.pendingShipments, icon: Clock, color: 'from-red-500 to-rose-600' },
            { label: 'Valor Total', value: `$${(stats.totalValue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'from-purple-500 to-pink-600' },
            { label: 'Retraso Prom.', value: `${stats.avgDelay.toFixed(0)} min`, icon: AlertTriangle, color: 'from-red-500 to-orange-500' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-[#AFC8E6] uppercase tracking-wide">{stat.label}</p>
                <div className={`p-1.5 bg-gradient-to-br ${stat.color} rounded-lg shadow-md text-white`}>
                  <stat.icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#EAF3FF]">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-[#1E90FF]/20 mb-6">
          {[
            { id: 'envios', label: '📦 Envíos Activos', icon: Truck },
            { id: 'mapa', label: '🗺️ Rastreo en Vivo', icon: MapIcon },
            { id: 'historial', label: '📖 Historial', icon: History },
            { id: 'estadisticas', label: '📊 Estadísticas', icon: BarChart3 },
            { id: 'alertas', label: '🔔 Alertas', icon: Bell }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md' 
                  : 'text-[#AFC8E6] hover:text-[#EAF3FF] hover:bg-[#1E4D7A]/50'
              }`}
            >
              {React.createElement(tab.icon, { className: 'w-4 h-4' })}
              {tab.label}
              {tab.id === 'alertas' && alerts.filter(a => !a.read).length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-red-500 rounded-full">
                  {alerts.filter(a => !a.read).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ==================== PESTAÑA: ENVÍOS ==================== */}
        {activeTab === 'envios' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Filtros */}
            <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E90FF]" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente, ID, producto o conductor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-sm text-[#EAF3FF] placeholder-[#AFC8E6]/50 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  />
                </div>
                
                {/* Filtros de fecha */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[#AFC8E6]">Desde:</span>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="px-2 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF]"
                  />
                  <span className="text-xs text-[#AFC8E6]">Hasta:</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="px-2 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-xs text-[#EAF3FF]"
                  />
                  {(dateRange.start || dateRange.end) && (
                    <button
                      onClick={() => setDateRange({ start: '', end: '' })}
                      className="px-2 py-1 text-xs text-red-400 hover:text-red-300"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { value: 'all', label: 'Todos', color: 'sky' },
                  { value: 'pending', label: 'Pendientes', color: 'amber' },
                  { value: 'transit', label: 'En Tránsito', color: 'blue' },
                  { value: 'completed', label: 'Entregados', color: 'emerald' }
                ].map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      filter === f.value
                        ? `bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md`
                        : 'bg-[#0B1E3A]/80 text-[#AFC8E6] hover:bg-[#1E4D7A] border border-[#1E90FF]/30'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
                <button
                  onClick={() => exportToCSV(filteredShipments)}
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3 h-3" />
                  Exportar
                </button>
              </div>
            </div>

            {/* Tabla de Envíos */}
            <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl shadow-lg border border-[#1E90FF]/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0B1E3A]/80 border-b border-[#1E90FF]/20">
                    <tr>
                      {[
                        { key: 'id', label: 'ID' },
                        { key: 'customer', label: 'Cliente' },
                        { key: 'product', label: 'Producto' },
                        { key: 'quantity', label: 'Cantidad' },
                        { key: 'date', label: 'Fecha' },
                        { key: 'status', label: 'Estado' },
                        { key: 'delay', label: 'Retraso' },
                        { key: 'actions', label: 'Acciones' }
                      ].map(header => (
                        <th
                          key={header.key}
                          onClick={() => header.key !== 'actions' && handleSort(header.key)}
                          className={`px-4 py-3 text-left text-xs font-semibold text-[#AFC8E6] uppercase tracking-wider ${
                            header.key !== 'actions' ? 'cursor-pointer hover:text-[#1E90FF] transition-colors' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {header.label}
                            {header.key !== 'actions' && sortField === header.key && (
                              sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E90FF]/10">
                    {paginatedShipments.map((ship, idx) => {
                      const stock = inventory[ship.product]?.stock || 0;
                      const isLowStock = stock < (inventory[ship.product]?.minStock || 0);
                      const hasDelay = ship.delay > 0;
                      return (
                        <motion.tr
                          key={ship.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-[#1E4D7A]/20 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono text-xs text-[#1E90FF]">{ship.id}</td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-[#EAF3FF]">{ship.customer}</p>
                            <p className="text-[10px] text-[#AFC8E6]">{ship.type}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-[#EAF3FF]">{ship.product}</p>
                            <p className="text-[10px] text-[#AFC8E6]">{ship.destination}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-semibold text-[#EAF3FF]">{ship.quantity} uni</p>
                            <p className={`text-[10px] ${isLowStock ? 'text-red-400' : 'text-[#AFC8E6]'}`}>
                              Stock: {stock} uni
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-[#EAF3FF]">{ship.date}</p>
                            <p className="text-[10px] text-[#AFC8E6]">ETA: {ship.estimated}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusColor(ship.status)}`}>
                              {ship.status === 'Entregado' ? <CheckCircle className="w-3 h-3" /> :
                               ship.status === 'En tránsito' ? <Truck className="w-3 h-3" /> :
                               <Clock className="w-3 h-3" />}
                              {ship.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {hasDelay ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-400">
                                <AlertTriangle className="w-3 h-3" />
                                {ship.delay} min
                              </span>
                            ) : (
                              <span className="text-[#AFC8E6] text-xs">--</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              {ship.status !== 'Entregado' && (
                                <button
                                  onClick={() => confirmDelivery(ship.id)}
                                  className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                  title="Confirmar entrega"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => { setSelectedShipment(ship); setShowMapModal(true); setMapCenter(ship.currentLocation); }}
                                className="p-1.5 bg-[#1E90FF]/20 rounded-lg text-[#1E90FF] hover:bg-[#1E90FF]/30 transition-colors"
                                title="Ver en mapa"
                              >
                                <MapPin className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setSelectedShipment(ship); setShowDetailsModal(true); }}
                                className="p-1.5 bg-[#0B1E3A]/80 rounded-lg text-[#AFC8E6] hover:bg-[#1E4D7A] transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-[#1E90FF]/20">
                  <p className="text-xs text-[#AFC8E6]">
                    Mostrando {paginatedShipments.length} de {filteredShipments.length} envíos
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-[#0B1E3A]/80 text-[#AFC8E6] disabled:opacity-50 border border-[#1E90FF]/30"
                    >
                      Anterior
                    </button>
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-[#0B1E3A]/80 text-[#AFC8E6] disabled:opacity-50 border border-[#1E90FF]/30"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Panel de Rutas Activas */}
            <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-[#1E90FF]" />
                  <h3 className="text-sm font-bold text-[#EAF3FF]">Rutas Activas</h3>
                </div>
                <span className="text-xs text-[#AFC8E6]">{activeShipments.length} vehículos en movimiento</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeShipments.map(ship => (
                  <div key={ship.id} className="bg-[#0B1E3A]/60 rounded-lg p-3 border border-[#1E90FF]/20">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-mono text-[#1E90FF]">{ship.id}</p>
                        <p className="text-sm font-semibold text-[#EAF3FF]">{ship.driver}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-[#AFC8E6]" />
                        <span className="text-xs text-[#EAF3FF]">{ship.speed} km/h</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-[#AFC8E6] mb-2">
                      <span>{ship.customer}</span>
                      <span>{ship.destination}</span>
                    </div>
                    <div className="w-full bg-[#163A6B] rounded-full h-1.5 mb-2">
                      <div 
                        className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${ship.currentLocation.progress * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#AFC8E6]">Progreso: {Math.round(ship.currentLocation.progress * 100)}%</span>
                      <span className="text-[#AFC8E6]">ETA: {ship.estimated}</span>
                    </div>
                    {ship.delay > 0 && (
                      <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Retraso: {ship.delay} minutos
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== PESTAÑA: MAPA EN TIEMPO REAL (CORREGIDA) ==================== */}
        {activeTab === 'mapa' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl shadow-lg border border-[#1E90FF]/20 overflow-hidden">
              <div className="p-4 border-b border-[#1E90FF]/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-[#1E90FF]" />
                  <h2 className="text-lg font-bold text-[#EAF3FF]">Rastreo en Tiempo Real</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRoutesPanel(!showRoutesPanel)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0B1E3A]/80 text-[#AFC8E6] border border-[#1E90FF]/30 hover:bg-[#1E4D7A] transition-all"
                  >
                    <Layers className="w-3 h-3 inline mr-1" />
                    {showRoutesPanel ? 'Ocultar' : 'Mostrar'} Rutas
                  </button>
                  <button
                    onClick={() => {
                      const activeRoutes = activeShipments.flatMap(s => s.route || []);
                      if (activeRoutes.length > 0) {
                        const lats = activeRoutes.map(p => p.lat);
                        const lngs = activeRoutes.map(p => p.lng);
                        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
                        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
                        setMapCenter({ lat: centerLat, lng: centerLng });
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0B1E3A]/80 text-[#AFC8E6] border border-[#1E90FF]/30 hover:bg-[#1E4D7A] transition-all"
                  >
                    <Navigation className="w-3 h-3 inline mr-1" />
                    Centrar Todo
                  </button>
                </div>
              </div>
              
              <div className="h-[500px] relative">
                <LazyMap center={mapCenter} zoom={6} mapContent={({ Marker, Popup, Polyline, CircleMarker, createVehicleIcon }) => (
                  <>
                    {shipments.filter(s => s.status === 'En tránsito' && s.route).map(ship => (
                      showRoutesPanel && (
                        <Polyline
                          key={`route-${ship.id}`}
                          positions={ship.route.map(p => [p.lat, p.lng])}
                          color="#1E90FF"
                          weight={3}
                          opacity={0.6}
                          dashArray="5, 10"
                        />
                      )
                    ))}
                    {shipments.filter(s => s.status === 'En tránsito').map(ship => (
                      <Marker
                        key={ship.id}
                        position={[ship.currentLocation.lat, ship.currentLocation.lng]}
                        icon={createVehicleIcon(ship.status, selectedVehicle === ship.id)}
                        eventHandlers={{
                          click: () => setSelectedVehicle(selectedVehicle === ship.id ? null : ship.id)
                        }}
                      >
                        <Popup>
                          <div className="text-sm">
                            <p className="font-bold text-[#1E90FF]">{ship.id}</p>
                            <p>{ship.driver}</p>
                            <p>{ship.destination}</p>
                            <p>{ship.product} x{ship.quantity}</p>
                            <p>Progreso: {Math.round(ship.currentLocation.progress * 100)}%</p>
                            <p>{ship.speed} km/h</p>
<p>Combustible: {ship.fuel}%</p>
                          {ship.delay > 0 && <p className="text-red-400">Retraso: {ship.delay} min</p>}
                        </div>
                        </Popup>
                      </Marker>
                    ))}
                    {showRoutesPanel && [...new Set(shipments.map(s => s.destination))].map(dest => {
                      const loc = locations[dest];
                      if (!loc) return null;
                      return (
                        <CircleMarker
                          key={`dest-${dest}`}
                          center={[loc.lat, loc.lng]}
                          radius={8}
                          fillColor="#10B981"
                          color="#fff"
                          weight={2}
                          opacity={1}
                          fillOpacity={0.8}
                        >
                          <Popup>{loc.name}</Popup>
                        </CircleMarker>
                      );
                    })}
                  </>
                )} />
            </div>
              
              {/* Leyenda */}
              <div className="p-3 border-t border-[#1E90FF]/20 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1E90FF]"></div>
                  <span className="text-[#AFC8E6]">Vehículo en tránsito</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-[#AFC8E6]">Destino</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-[#1E90FF] opacity-60 border-t border-dashed border-[#1E90FF]"></div>
                  <span className="text-[#AFC8E6]">Ruta planificada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-[#AFC8E6]">Con retraso</span>
                </div>
              </div>
            </div>
            
            {/* Panel de Vehículo Seleccionado */}
            {selectedVehicle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-[#1E90FF]" />
                    <h3 className="text-sm font-bold text-[#EAF3FF]">Detalles del Vehículo</h3>
                  </div>
                  <button onClick={() => setSelectedVehicle(null)} className="p-1 hover:bg-[#1E4D7A] rounded-lg">
                    <X className="w-4 h-4 text-[#AFC8E6]" />
                  </button>
                </div>
                {(() => {
                  const ship = shipments.find(s => s.id === selectedVehicle);
                  if (!ship) return null;
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] text-[#AFC8E6]">Conductor</p>
                        <p className="text-sm font-semibold text-[#EAF3FF]">{ship.driver}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#AFC8E6]">Vehículo</p>
                        <p className="text-sm font-semibold text-[#EAF3FF]">{ship.vehicle}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#AFC8E6]">Velocidad</p>
                        <p className="text-sm font-semibold text-[#1E90FF]">{ship.speed} km/h</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#AFC8E6]">Combustible</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#0B1E3A] rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all ${ship.fuel < 20 ? 'bg-red-500' : 'bg-emerald-500'}`}
                              style={{ width: `${ship.fuel}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#EAF3FF]">{ship.fuel}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#AFC8E6]">Progreso de ruta</p>
                        <p className="text-sm font-semibold text-[#EAF3FF]">{Math.round(ship.currentLocation.progress * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#AFC8E6]">ETA estimada</p>
                        <p className="text-sm font-semibold text-[#EAF3FF]">{ship.estimated}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#AFC8E6]">Última actualización</p>
                        <p className="text-sm font-semibold text-[#EAF3FF]">
                          {new Date(ship.lastUpdate).toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#AFC8E6]">Cliente</p>
                        <p className="text-sm font-semibold text-[#EAF3FF]">{ship.customer}</p>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ==================== PESTAÑA: HISTORIAL ==================== */}
        {activeTab === 'historial' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl shadow-lg border border-[#1E90FF]/20 overflow-hidden"
          >
            <div className="p-4 border-b border-[#1E90FF]/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#1E90FF]" />
                <h2 className="text-lg font-bold text-[#EAF3FF]">Historial de Movimientos</h2>
              </div>
              <button
                onClick={exportHistoryToCSV}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3 h-3" />
                Exportar
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0B1E3A]/80 border-b border-[#1E90FF]/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#AFC8E6]">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#AFC8E6]">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#AFC8E6]">Producto</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#AFC8E6]">Cantidad</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#AFC8E6]">Destino / Origen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E90FF]/10">
                  {history.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-[#1E4D7A]/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-[#EAF3FF]">{item.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${
                          item.type === 'Entrada' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {item.type === 'Entrada' ? <Package className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-[#EAF3FF]">{item.product}</td>
                      <td className="px-4 py-3 text-center text-sm font-semibold text-[#1E90FF]">{item.qty}</td>
                      <td className="px-4 py-3 text-sm text-[#AFC8E6]">{item.destination}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ==================== PESTAÑA: ESTADÍSTICAS ==================== */}
        {activeTab === 'estadisticas' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg border border-[#1E90FF]/20">
              <h3 className="text-base font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#1E90FF]" />
                KPIs de Logística
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-[#0B1E3A]/60 rounded-lg">
                  <p className="text-xs text-[#AFC8E6]">Tasa de entregas a tiempo</p>
                  <p className="text-3xl font-bold text-emerald-400">{stats.deliveryRate.toFixed(0)}%</p>
                </div>
                <div className="p-3 bg-[#0B1E3A]/60 rounded-lg">
                  <p className="text-xs text-[#AFC8E6]">Envíos este mes</p>
                  <p className="text-3xl font-bold text-[#EAF3FF]">{shipments.length}</p>
                </div>
                <div className="p-3 bg-[#0B1E3A]/60 rounded-lg">
                  <p className="text-xs text-[#AFC8E6]">Tiempo promedio de entrega</p>
                  <p className="text-3xl font-bold text-[#1E90FF]">2.4 días</p>
                </div>
                <div className="p-3 bg-[#0B1E3A]/60 rounded-lg">
                  <p className="text-xs text-[#AFC8E6]">Retraso promedio</p>
                  <p className="text-3xl font-bold text-amber-400">{stats.avgDelay.toFixed(0)} min</p>
                </div>
                <div className="p-3 bg-[#0B1E3A]/60 rounded-lg">
                  <p className="text-xs text-[#AFC8E6]">Distancia total recorrida</p>
                  <p className="text-3xl font-bold text-[#EAF3FF]">{stats.totalDistance.toFixed(0)} km</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-5 shadow-lg border border-[#1E90FF]/20">
              <h3 className="text-base font-bold text-[#EAF3FF] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#1E90FF]" />
                Estado del Inventario
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {Object.entries(inventory).map(([product, data]) => {
                  const percentage = (data.stock / data.maxStock) * 100;
                  const isLow = data.stock < data.minStock;
                  return (
                    <div key={product} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#EAF3FF]">{product}</span>
                        <span className={`font-semibold ${isLow ? 'text-red-400' : 'text-[#AFC8E6]'}`}>
                          {data.stock} / {data.maxStock}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#0B1E3A]/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-[#1E90FF]'}`}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== PESTAÑA: ALERTAS ==================== */}
        {activeTab === 'alertas' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl shadow-lg border border-[#1E90FF]/20 overflow-hidden"
          >
            <div className="p-4 border-b border-[#1E90FF]/20 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#1E90FF]" />
                <h2 className="text-lg font-bold text-[#EAF3FF]">Centro de Alertas</h2>
              </div>
              <button
                onClick={() => setAlerts([])}
                className="text-xs text-[#AFC8E6] hover:text-[#1E90FF] transition-colors"
              >
                Limpiar todas
              </button>
            </div>
            <div className="divide-y divide-[#1E90FF]/10">
              {alerts.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto text-[#AFC8E6]/30 mb-2" />
                  <p className="text-[#AFC8E6]">No hay alertas</p>
                </div>
              ) : (
                alerts.map(alert => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 ${!alert.read ? 'bg-[#1E90FF]/10' : ''} hover:bg-[#1E4D7A]/20 transition-colors cursor-pointer`}
                    onClick={() => markAlertAsRead(alert.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        alert.type === 'warning' ? 'bg-amber-500/20' :
                        alert.type === 'error' ? 'bg-red-500/20' :
                        alert.type === 'success' ? 'bg-emerald-500/20' :
                        'bg-[#1E90FF]/20'
                      }`}>
                        {alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                         alert.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-400" /> :
                         alert.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> :
                         <Info className="w-4 h-4 text-[#1E90FF]" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#EAF3FF]">{alert.message}</p>
                        <p className="text-xs text-[#AFC8E6] mt-1">{alert.time}</p>
                      </div>
                      {!alert.read && (
                        <div className="w-2 h-2 bg-[#1E90FF] rounded-full"></div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* ==================== MODALES ==================== */}

        {/* Modal Nuevo Envío */}
        <AnimatePresence>
          {showNewModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-6 w-full max-w-md border border-[#1E90FF]/30 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#EAF3FF] flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#1E90FF]" />
                    Nuevo Envío
                  </h2>
                  <button onClick={() => setShowNewModal(false)} className="p-1 rounded-lg hover:bg-[#1E4D7A]">
                    <X className="w-5 h-5 text-[#AFC8E6]" />
                  </button>
                </div>

                <div className="space-y-4">
                  <select
                    value={newShipment.type}
                    onChange={(e) => setNewShipment({ ...newShipment, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Proveedor">Proveedor</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Nombre del cliente o proveedor"
                    value={newShipment.customer}
                    onChange={(e) => setNewShipment({ ...newShipment, customer: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] placeholder-[#AFC8E6]/50 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                  />

                  <select
                    value={newShipment.product}
                    onChange={(e) => setNewShipment({ ...newShipment, product: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF]"
                  >
                    <option value="">Seleccionar producto</option>
                    {Object.keys(inventory).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={newShipment.quantity}
                    onChange={(e) => setNewShipment({ ...newShipment, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] placeholder-[#AFC8E6]/50"
                  />

                  <input
                    type="text"
                    placeholder="Destino"
                    value={newShipment.destination}
                    onChange={(e) => setNewShipment({ ...newShipment, destination: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] placeholder-[#AFC8E6]/50"
                  />

                  <input
                    type="text"
                    placeholder="Conductor"
                    value={newShipment.driver}
                    onChange={(e) => setNewShipment({ ...newShipment, driver: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] placeholder-[#AFC8E6]/50"
                  />

                  <button
                    onClick={createNewShipment}
                    className="w-full py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Crear Envío
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Agregar Stock */}
        <AnimatePresence>
          {showStockModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-6 w-full max-w-md border border-[#1E90FF]/30 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#EAF3FF] flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#1E90FF]" />
                    Agregar Stock
                  </h2>
                  <button onClick={() => setShowStockModal(false)} className="p-1 rounded-lg hover:bg-[#1E4D7A]">
                    <X className="w-5 h-5 text-[#AFC8E6]" />
                  </button>
                </div>

                <div className="space-y-4">
                  <select
                    value={newStockEntry.product}
                    onChange={(e) => setNewStockEntry({ ...newStockEntry, product: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF]"
                  >
                    <option value="">Seleccionar producto</option>
                    {Object.keys(inventory).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={newStockEntry.quantity}
                    onChange={(e) => setNewStockEntry({ ...newStockEntry, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg text-[#EAF3FF] placeholder-[#AFC8E6]/50"
                  />

                  <input
                    type="text"
                    placeholder="Proveedor"
                    value={newStockEntry.supplier}
                    onChange={(e) => setNewStockEntry({ ...newStockEntry, supplier: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg"
                  />

                  <button
                    onClick={addStock}
                    className="w-full py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Agregar Stock
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Mapa detallado (también necesita carga dinámica, pero lo dejamos similar) */}
        <AnimatePresence>
          {showMapModal && selectedShipment && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-6 w-full max-w-2xl border border-[#1E90FF]/30 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#EAF3FF] flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#1E90FF]" />
                    Rastreo en Tiempo Real • {selectedShipment.id}
                  </h2>
                  <button onClick={() => setShowMapModal(false)} className="p-1 rounded-lg hover:bg-[#1E4D7A]">
                    <X className="w-5 h-5 text-[#AFC8E6]" />
                  </button>
                </div>
                <div className="h-96 bg-gradient-to-br from-[#1E90FF]/20 to-[#3B82F6]/20 rounded-xl relative overflow-hidden">
                  <LazyMap center={selectedShipment.currentLocation} zoom={10} mapContent={({ Marker, Popup, Polyline, CircleMarker, createVehicleIcon }) => (
                    <>
                      {selectedShipment.route && (
                        <Polyline
                          positions={selectedShipment.route.map(p => [p.lat, p.lng])}
                          color="#1E90FF"
                          weight={4}
                            opacity={0.8}
                          />
                        )}
                        <Marker
                          position={[selectedShipment.currentLocation.lat, selectedShipment.currentLocation.lng]}
                          icon={createVehicleIcon(selectedShipment.status)}
                        >
                          <Popup>
                            <div className="text-sm">
                              <p className="font-bold">{selectedShipment.id}</p>
                              <p>Velocidad: {selectedShipment.speed} km/h</p>
                              <p>ETA: {selectedShipment.estimated}</p>
                            </div>
                          </Popup>
                        </Marker>
                        {selectedShipment.route && selectedShipment.route[1] && (
                          <CircleMarker
                          center={[selectedShipment.route[1].lat, selectedShipment.route[1].lng]}
                          radius={8}
                          fillColor="#10B981"
                          color="#fff"
                          weight={2}
                        >
                          <Popup>Destino: {selectedShipment.destination}</Popup>
                        </CircleMarker>
                      )}
                    </>
                  )} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#0B1E3A]/60 rounded-lg p-2">
                    <p className="text-[#AFC8E6] text-xs">Conductor</p>
                    <p className="font-semibold text-[#EAF3FF]">{selectedShipment.driver}</p>
                  </div>
                  <div className="bg-[#0B1E3A]/60 rounded-lg p-2">
                    <p className="text-[#AFC8E6] text-xs">Vehículo</p>
                    <p className="font-semibold text-[#EAF3FF]">{selectedShipment.vehicle}</p>
                  </div>
                  <div className="bg-[#0B1E3A]/60 rounded-lg p-2">
                    <p className="text-[#AFC8E6] text-xs">Progreso</p>
                    <p className="font-semibold text-[#1E90FF]">{Math.round(selectedShipment.currentLocation.progress * 100)}%</p>
                  </div>
                  <div className="bg-[#0B1E3A]/60 rounded-lg p-2">
                    <p className="text-[#AFC8E6] text-xs">ETA</p>
                    <p className="font-semibold text-[#EAF3FF]">{selectedShipment.estimated}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="mt-4 w-full py-2 bg-[#0B1E3A]/80 rounded-lg text-[#AFC8E6] border border-[#1E90FF]/30 hover:bg-[#1E4D7A] transition-all"
                >
                  Cerrar
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Detalles Envío */}
        <AnimatePresence>
          {showDetailsModal && selectedShipment && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl p-6 w-full max-w-md border border-[#1E90FF]/30 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#EAF3FF]">Detalles del Envío</h2>
                  <button onClick={() => setShowDetailsModal(false)} className="p-1 rounded-lg hover:bg-[#1E4D7A]">
                    <X className="w-5 h-5 text-[#AFC8E6]" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                    <span className="text-[#AFC8E6]">ID:</span>
                    <span className="font-semibold text-[#EAF3FF]">{selectedShipment.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                    <span className="text-[#AFC8E6]">Cliente:</span>
                    <span className="font-semibold text-[#EAF3FF]">{selectedShipment.customer}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                    <span className="text-[#AFC8E6]">Producto:</span>
                    <span className="font-semibold text-[#EAF3FF]">{selectedShipment.product}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                    <span className="text-[#AFC8E6]">Cantidad:</span>
                    <span className="font-semibold text-[#1E90FF]">{selectedShipment.quantity} uni</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                    <span className="text-[#AFC8E6]">Destino:</span>
                    <span className="font-semibold text-[#EAF3FF]">{selectedShipment.destination}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                    <span className="text-[#AFC8E6]">Conductor:</span>
                    <span className="font-semibold text-[#EAF3FF]">{selectedShipment.driver}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                    <span className="text-[#AFC8E6]">Vehículo:</span>
                    <span className="font-semibold text-[#EAF3FF]">{selectedShipment.vehicle}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                    <span className="text-[#AFC8E6]">Velocidad:</span>
                    <span className="font-semibold text-[#EAF3FF]">{selectedShipment.speed} km/h</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1E90FF]/20">
                    <span className="text-[#AFC8E6]">Combustible:</span>
                    <span className={`font-semibold ${selectedShipment.fuel < 20 ? 'text-red-400' : 'text-[#EAF3FF]'}`}>
                      {selectedShipment.fuel}%
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#AFC8E6]">Estado:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(selectedShipment.status)}`}>
                      {selectedShipment.status}
                    </span>
                  </div>
                  {selectedShipment.delay > 0 && (
                    <div className="flex justify-between py-2 bg-red-500/10 rounded-lg px-2">
                      <span className="text-red-400">Retraso:</span>
                      <span className="font-semibold text-red-400">{selectedShipment.delay} minutos</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Notificación flotante */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 ${
                notification.type === 'error' ? 'bg-red-500/90' :
                notification.type === 'warning' ? 'bg-amber-500/90' :
                'bg-emerald-500/90'
              } text-white`}
            >
              {notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
               notification.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
               <CheckCircle className="w-5 h-5" />}
              <span className="text-sm">{notification.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Logistic;