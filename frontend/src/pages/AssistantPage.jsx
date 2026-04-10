import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Sparkles, TrendingUp, DollarSign, Package, AlertCircle,
  ChevronRight, Zap, Shield, Award, BarChart3, Truck, Clock,
  Calendar, MessageCircle, X, Send, User, Mic, MicOff,
  Volume2, VolumeX, Copy, Check, Minimize2, Maximize2,
  Download, RefreshCw, Filter, Search, HelpCircle, FileText,
  ThumbsUp, ThumbsDown, ExternalLink, Star, Target, Activity,
  CircleDot, Menu, PanelLeftClose, PanelLeftOpen, History,
  Bookmark, Share2, Image, Link
} from 'lucide-react';

// Componente simple de mensaje con formato (sin dependencias externas)
const FormattedMessage = ({ content }) => {
  // Función para procesar formato básico markdown
  const formatText = (text) => {
    // Procesar negritas **texto**
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#EAF3FF] font-bold">$1</strong>');
    // Procesar listas con •
    formatted = formatted.replace(/• (.*?)(\n|$)/g, '<li class="ml-4 text-[#AFC8E6]">• $1</li>');
    // Procesar números de lista
    formatted = formatted.replace(/(\d+)\. \*\*(.*?)\*\*/g, '<div class="flex items-start gap-2 mt-2"><span class="text-[#1E90FF] font-bold">$1.</span><strong class="text-[#EAF3FF]">$2</strong></div>');
    // Procesar líneas con emojis
    formatted = formatted.replace(/([📊💰📦🏆🎯⚠️💡])\s/g, '<span class="text-[#1E90FF] mr-1">$1</span>');
    // Procesar saltos de línea
    formatted = formatted.replace(/\n/g, '<br/>');
    
    return formatted;
  };

  // Dividir el contenido en secciones
  const sections = content.split(/\n\n/);
  
  return (
    <div className="text-sm leading-relaxed space-y-2">
      {sections.map((section, idx) => {
        if (section.startsWith('**') && section.includes('**')) {
          // Es un título
          return (
            <div key={idx} className="font-semibold text-[#EAF3FF] mt-2 first:mt-0">
              <div dangerouslySetInnerHTML={{ __html: formatText(section) }} />
            </div>
          );
        }
        return (
          <div key={idx} className="text-[#AFC8E6]" dangerouslySetInnerHTML={{ __html: formatText(section) }} />
        );
      })}
    </div>
  );
};

// Componente de tarjeta de insight
const InsightCard = ({ title, value, change, icon: Icon, color }) => {
  const getColorClasses = () => {
    switch(color) {
      case 'emerald': return 'bg-emerald-500/20 text-emerald-400';
      case 'sky': return 'bg-[#1E90FF]/20 text-[#1E90FF]';
      case 'amber': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-[#1E90FF]/20 text-[#1E90FF]';
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-3 border border-[#1E90FF]/20 hover:shadow-lg hover:shadow-[#1E90FF]/10 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-1.5 rounded-lg ${getColorClasses()}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        {change && (
          <span className={`text-[10px] font-medium ${change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-[10px] text-[#AFC8E6]">{title}</p>
      <p className="text-lg font-bold text-[#EAF3FF]">{value}</p>
    </div>
  );
};

// Componente de sugerencia de pregunta
const SuggestionChip = ({ text, onClick, icon: Icon }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -1 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-full text-[11px] text-[#1E90FF] hover:bg-[#1E4D7A] hover:border-[#1E90FF] transition-all whitespace-nowrap shadow-sm flex-shrink-0 font-medium"
  >
    {Icon && <Icon className="w-3 h-3" />}
    {text}
  </motion.button>
);

// Componente de historial de conversación
const ConversationHistory = ({ messages, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  
  // Agrupar conversaciones por día
  const groupedMessages = useMemo(() => {
    const groups = {};
    messages.forEach(msg => {
      const date = new Date(msg.timestamp).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  }, [messages]);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-[#102A4C]/80 border border-[#1E90FF]/30 text-[#1E90FF] hover:bg-[#1E4D7A] transition-all"
        title="Historial de conversación"
      >
        <History size={16} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-[#102A4C] rounded-xl shadow-2xl border border-[#1E90FF]/20 z-30 max-h-96 overflow-y-auto custom-scrollbar"
          >
            <div className="p-3 border-b border-[#1E90FF]/20 sticky top-0 bg-[#102A4C]">
              <h4 className="text-sm font-semibold text-[#EAF3FF]">Historial de Conversación</h4>
            </div>
            <div className="p-2 space-y-3">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <p className="text-[10px] text-[#AFC8E6] px-2 mb-1 capitalize">
                    {formatDate(msgs[0].timestamp)}
                  </p>
                  {msgs.slice(0, 3).map((msg, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelect(msg);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#AFC8E6] hover:bg-[#1E4D7A] transition-colors truncate"
                    >
                      {msg.text.substring(0, 50)}...
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente de exportación de chat
const ExportChatModal = ({ isOpen, onClose, messages, onExport }) => {
  const [format, setFormat] = useState('txt');
  
  if (!isOpen) return null;
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  const handleExport = () => {
    let content = '';
    const dateStr = formatDate();
    
    if (format === 'txt') {
      messages.forEach(msg => {
        const prefix = msg.type === 'user' ? '👤 Usuario' : '🤖 Asistente';
        content += `[${prefix} - ${formatTime(msg.timestamp)}]\n${msg.text}\n\n`;
      });
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chat_export_${dateStr}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const exportData = { messages, exportDate: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chat_export_${dateStr}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
    
    onExport(format);
    onClose();
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
        className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-2xl max-w-md w-full p-6 border border-[#1E90FF]/30 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#EAF3FF] flex items-center gap-2">
            <Download className="w-5 h-5 text-[#1E90FF]" />
            Exportar Conversación
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#1E4D7A] transition-colors">
            <X className="w-5 h-5 text-[#AFC8E6]" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#AFC8E6] mb-2">Formato de exportación</label>
            <div className="flex gap-2">
              {[
                { id: 'txt', label: 'Texto Plano', icon: FileText },
                { id: 'json', label: 'JSON', icon: Code }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFormat(opt.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    format === opt.id
                      ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white shadow-md'
                      : 'bg-[#0B1E3A]/80 border border-[#1E90FF]/30 text-[#AFC8E6] hover:bg-[#1E4D7A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-[#0B1E3A]/60 rounded-lg p-3">
            <p className="text-xs text-[#AFC8E6]">
              <strong className="text-[#EAF3FF]">Vista previa:</strong> Se exportarán {messages.length} mensajes
            </p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={handleExport} className="flex-1 py-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white font-medium">
              Exportar
            </button>
            <button onClick={onClose} className="flex-1 py-2 bg-[#0B1E3A]/80 rounded-lg text-[#AFC8E6] border border-[#1E90FF]/30">
              Cancelar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Icono Code para el modal
const Code = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const AssistantPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showInsights, setShowInsights] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Datos de mercado
  const marketData = {
    historicalData: {
      currentMonthSales: 1350000,
      growth: 8.4,
      averageMargin: 25.8,
      priceIndex: 96.5,
      stockToSalesRatio: 1.8
    },
    alerts: [
      { severity: 'high', message: 'Stock crítico en medida 235/55 R17' },
      { severity: 'medium', message: 'Competidor bajó precios en segmento Premium' },
      { severity: 'low', message: 'Crecimiento del 12% en ventas de SUV' }
    ]
  };
  
  // Sistema de respuestas mejorado
  const getResponse = useCallback((question) => {
    const q = question.toLowerCase();
    
    if (q.includes('diferencia de precio') || q.includes('competencia')) {
      return {
        text: `📊 **Análisis de Precios vs Competencia**

**Producto Premium más vendido:** Michelin Pilot Sport 4S
• Nuestro precio: $4,250 MXN
• Competencia: $4,450 MXN
• Diferencia: -$200 MXN (4.5% más competitivo)

**Comparativa por Segmento:**
• Premium: -4.5% (Michelin)
• Quality: -3.0% (Bridgestone)
• Budget: -5.2% (Hankook)

**Recomendación:** Mantener precio actual en segmento Premium.`,
        category: 'prices'
      };
    }
    
    if (q.includes('stock crítico') || q.includes('inventario')) {
      return {
        text: `⚠️ **Alertas de Inventario**

**Stock Crítico (<20 unidades):**
• Pirelli P Zero Corsa: 15 unidades
• Continental PremiumContact 6: 28 unidades

**Recomendaciones:**
• Realizar pedido urgente de Pirelli P Zero Corsa
• Evaluar promociones para liberar espacio
• Stock-to-Sales Ratio actual: 1.8:1`,
        category: 'inventory'
      };
    }
    
    if (q.includes('resumen ejecutivo') || q.includes('kpis')) {
      return {
        text: `📋 **Resumen Ejecutivo - NeumatiQ**

**📊 Ventas:**
• Mes actual: $1,350,000 MXN
• Crecimiento: +8.4% vs mes anterior
• Meta mensual: 85% cumplida

**💰 Rentabilidad:**
• Margen promedio: 25.8%
• Price Index: 96.5 (Competitivo)
• Producto más rentable: Pirelli P Zero Corsa (30%)

**📦 Inventario:**
• Rotación: 4.2 meses
• Stock-to-Sales: 1.8:1
• 3 productos con stock crítico

**🏆 Top Productos:**
1. Michelin Pilot Sport 4S - $4,250
2. Continental PremiumContact 6 - $3,980
3. Pirelli P Zero Corsa - $4,850`,
        category: 'kpis'
      };
    }
    
    if (q.includes('tendencia') || q.includes('demanda')) {
      return {
        text: `📈 **Tendencias de Mercado**

**Medida con Mayor Crecimiento:**
1. **225/45R17** - Crecimiento: +23%
2. **205/55R16** - Crecimiento: +18%
3. **235/55R17** - Crecimiento: +15%

**Análisis:**
• Tendencia hacia medidas más grandes (17"-18")
• Mayor demanda en segmento de vehículos deportivos
• Correlación con aumento de ventas de autos nuevos

**Recomendación:** Incrementar inventario en 20% para estas medidas.`,
        category: 'trends'
      };
    }
    
    if (q.includes('promocionar') || q.includes('liberar espacio')) {
      return {
        text: `🎯 **Estrategia de Promociones para Liberar Espacio**

**Top Productos con Alto Stock:**
• Hankook Ventus S1 evo3: 56 unidades | $2,890
• Goodyear Eagle F1: 42 unidades | $3,650
• Michelin Pilot Sport 4S: 45 unidades | $4,250

**Estrategias Sugeridas:**
• 📦 **Bundle 2x1:** Compra 2 llantas + montaje gratis
• 🏷️ **Descuento por volumen:** 10% en compra de 4 unidades
• ⏰ **Oferta flash:** 15% descuento por 48 horas

**Impacto Estimado:** Liberación de 150-200 unidades en 2 semanas.`,
        category: 'promotions'
      };
    }
    
    return {
      text: `🤖 **NeumatiQ Assistant - Guía Rápida**

Puedo ayudarte con las siguientes categorías:

💰 **Análisis de Precios**
• "¿Cuál es la diferencia de precio con la competencia?"

📦 **Gestión de Inventario**
• "Análisis de stock crítico"
• "¿Qué productos promocionar para liberar espacio?"

📊 **KPIs y Rentabilidad**
• "Resumen ejecutivo de los KPIs más importantes"

📈 **Tendencias**
• "¿Qué medida está creciendo más en demanda?"

💡 **Tip:** Haz preguntas más específicas para obtener análisis detallados.`,
      category: 'help'
    };
  }, []);
  
  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    setTimeout(() => {
      const response = getResponse(message);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: response.text,
        category: response.category,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  }, [getResponse]);
  
  const copyToClipboard = useCallback((text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);
  
  const speakMessage = useCallback((text) => {
    if (!voiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
    utterance.lang = 'es-MX';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);
  
  const toggleVoiceRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz');
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
      inputRef.current?.focus();
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening]);
  
  const clearConversation = useCallback(() => {
    setMessages([]);
    setSuggestions(suggestedQuestions.slice(0, 4));
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'assistant',
        text: `🎉 **¡Bienvenido a NeumatiQ Assistant!**

Soy tu asistente inteligente especializado en el mercado de neumáticos.

**¿Qué te gustaría consultar hoy?**

💡 *Prueba preguntando: "Resumen ejecutivo de KPIs" o "Análisis de stock crítico"*`,
        timestamp: new Date().toISOString(),
        category: 'welcome'
      };
      setMessages([welcomeMessage]);
      setSuggestions(suggestedQuestions.slice(0, 4));
    }
  }, [messages.length]);
  
  const suggestedQuestions = [
    "¿Cuál es la diferencia de precio con la competencia?",
    "Análisis de stock crítico",
    "Resumen ejecutivo de KPIs",
    "Tendencias de mercado este mes",
    "¿Qué productos promocionar?"
  ];
  
  const quickActions = [
    { icon: TrendingUp, label: 'KPIs', action: () => sendMessage('Resumen ejecutivo de KPIs') },
    { icon: Package, label: 'Stock', action: () => sendMessage('Análisis de stock crítico') },
    { icon: DollarSign, label: 'Precios', action: () => sendMessage('Diferencia de precio con competencia') },
    { icon: Activity, label: 'Tendencias', action: () => sendMessage('Tendencias de mercado este mes') }
  ];
  
  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-[#050c1a] to-[#0B1E3A]">
      <div className="h-full w-full flex flex-col p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0B1E3A]/90 to-[#102A4C]/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-[#1E90FF]/20 mb-4 flex-shrink-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-xl blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-[#1E90FF] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#1E90FF] via-[#3B82F6] to-[#1E90FF] bg-clip-text text-transparent">
                  NeumatiQ Assistant
                </h1>
                <p className="text-xs text-[#AFC8E6]">Inteligencia de Mercado para Neumáticos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Acciones rápidas */}
              <div className="hidden md:flex items-center gap-1 bg-[#102A4C]/80 rounded-lg p-1 border border-[#1E90FF]/20">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.action}
                    className="p-1.5 rounded-lg hover:bg-[#1E4D7A] transition-all text-[#AFC8E6] hover:text-[#1E90FF]"
                    title={action.label}
                  >
                    <action.icon size={14} />
                  </button>
                ))}
              </div>
              
              {/* Historial */}
              <ConversationHistory messages={messages} onSelect={(msg) => sendMessage(msg.text)} />
              
              {/* Exportar */}
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2 rounded-lg bg-[#102A4C]/80 border border-[#1E90FF]/30 text-[#1E90FF] hover:bg-[#1E4D7A] transition-all"
                title="Exportar conversación"
              >
                <Download size={16} />
              </button>
              
              {/* Limpiar conversación */}
              <button
                onClick={clearConversation}
                className="p-2 rounded-lg bg-[#102A4C]/80 border border-[#1E90FF]/30 text-[#1E90FF] hover:bg-[#1E4D7A] transition-all"
                title="Limpiar conversación"
              >
                <RefreshCw size={16} />
              </button>
              
              {/* Toggle Insights */}
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="p-2 rounded-lg bg-[#102A4C]/80 border border-[#1E90FF]/30 text-[#1E90FF] hover:bg-[#1E4D7A] transition-all"
              >
                {showInsights ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Contenido principal */}
        <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
          {/* Panel de Insights */}
          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:w-80 flex-shrink-0 overflow-hidden"
              >
                <div className="h-full overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {/* KPIs Rápidos */}
                  <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
                    <h3 className="font-semibold text-[#EAF3FF] mb-3 text-sm">KPIs del Día</h3>
                    <div className="space-y-3">
                      <InsightCard
                        title="Margen Promedio"
                        value={`${marketData.historicalData.averageMargin}%`}
                        icon={TrendingUp}
                        color="emerald"
                      />
                      <InsightCard
                        title="Price Index"
                        value={marketData.historicalData.priceIndex}
                        icon={Target}
                        color="sky"
                      />
                      <InsightCard
                        title="Crecimiento"
                        value={`+${marketData.historicalData.growth}%`}
                        icon={Activity}
                        color="emerald"
                        change={marketData.historicalData.growth}
                      />
                      <InsightCard
                        title="Stock-to-Sales"
                        value={`${marketData.historicalData.stockToSalesRatio}:1`}
                        icon={Package}
                        color="amber"
                      />
                    </div>
                  </div>
                  
                  {/* Alertas Activas */}
                  <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
                    <h3 className="font-semibold text-[#EAF3FF] mb-3 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Alertas Activas
                    </h3>
                    <div className="space-y-2">
                      {marketData.alerts.map((alert, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg text-xs ${
                            alert.severity === 'high' ? 'bg-red-500/20 text-red-400 border-l-2 border-red-500' :
                            alert.severity === 'medium' ? 'bg-amber-500/20 text-amber-400 border-l-2 border-amber-500' :
                            'bg-emerald-500/20 text-emerald-400 border-l-2 border-emerald-500'
                          }`}
                        >
                          {alert.message}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Consultas Rápidas */}
                  <div className="bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl p-4 shadow-lg border border-[#1E90FF]/20">
                    <h3 className="font-semibold text-[#EAF3FF] mb-3 text-sm">Consultas Rápidas</h3>
                    <div className="space-y-2">
                      {suggestedQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(question)}
                          className="w-full text-left py-2 px-2 rounded-lg text-xs text-[#AFC8E6] hover:bg-[#1E4D7A] transition-all flex items-center gap-2 group"
                        >
                          <CircleDot size={10} className="text-[#1E90FF] flex-shrink-0" />
                          <span className="truncate group-hover:text-[#EAF3FF]">{question}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Chat Principal */}
          <div className="flex-1 min-w-0 flex flex-col bg-gradient-to-br from-[#163A6B] to-[#102A4C] rounded-xl shadow-lg border border-[#1E90FF]/20 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] p-3 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Asistente Inteligente</h3>
                  <p className="text-[10px] text-white/80">Online · Datos en tiempo real</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-all"
                  title={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
                >
                  {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0B1E3A]/30 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        msg.type === 'user' 
                          ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6]' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}>
                        {msg.type === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                      </div>
                      <div className={`relative group ${
                        msg.type === 'user' 
                          ? 'bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] text-white rounded-xl rounded-tr-none'
                          : 'bg-[#0B1E3A]/80 border border-[#1E90FF]/30 text-[#AFC8E6] rounded-xl rounded-tl-none shadow-sm'
                      } p-3`}>
                        {msg.type === 'assistant' ? (
                          <FormattedMessage content={msg.text} />
                        ) : (
                          <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                        )}
                        <div className="flex items-center justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="p-1 hover:bg-white/10 rounded transition-all"
                          >
                            {copiedId === msg.id ? <Check size={12} className="text-[#1E90FF]" /> : <Copy size={12} className="text-[#AFC8E6]" />}
                          </button>
                          {msg.type === 'assistant' && (
                            <button
                              onClick={() => speakMessage(msg.text)}
                              className="p-1 hover:bg-white/10 rounded transition-all"
                            >
                              <Volume2 size={12} className="text-[#AFC8E6]" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] text-[#AFC8E6]/50 mt-1 ml-10">
                      {new Date(msg.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-xl rounded-tl-none p-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#1E90FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-[#1E90FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-[#1E90FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Suggestions Chips */}
            {suggestions.length > 0 && (
              <div className="px-4 py-2 bg-[#0B1E3A]/50 border-t border-[#1E90FF]/20 flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {suggestions.map((suggestion, idx) => (
                    <SuggestionChip
                      key={idx}
                      text={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      icon={MessageCircle}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Area */}
            <div className="p-3 bg-[#0B1E3A]/50 border-t border-[#1E90FF]/20 flex-shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={toggleVoiceRecognition}
                  className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-[#0B1E3A]/80 border border-[#1E90FF]/30 text-[#1E90FF] hover:bg-[#1E4D7A]'
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                  placeholder={isListening ? 'Escuchando...' : 'Escribe tu pregunta aquí...'}
                  className="flex-1 px-3 py-2 bg-[#0B1E3A]/80 border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent text-[#EAF3FF] placeholder-[#AFC8E6]/50 text-sm"
                  disabled={isListening}
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isListening}
                  className="p-2 bg-gradient-to-r from-[#1E90FF] to-[#3B82F6] rounded-lg text-white hover:shadow-lg hover:shadow-[#1E90FF]/25 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[9px] text-[#AFC8E6]/50">
                  NeumatiQ Assistant v3.0 · Datos actualizados
                </p>
                <div className="flex gap-2">
                  <button className="text-[9px] text-[#AFC8E6]/50 hover:text-[#1E90FF] transition-colors">
                    <HelpCircle size={10} />
                  </button>
                  <button className="text-[9px] text-[#AFC8E6]/50 hover:text-[#1E90FF] transition-colors">
                    <FileText size={10} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <ExportChatModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            messages={messages}
            onExport={(format) => console.log(`Exportando en formato ${format}`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssistantPage;