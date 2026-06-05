import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Bot, User, Sparkles, TrendingUp, 
  DollarSign, Package, AlertCircle, ChevronDown, ChevronUp,
  Zap, Shield, Award, BarChart3, Truck, Clock, Calendar,
  Search, Filter, Download, RefreshCw, Mic, MicOff,
  HelpCircle, FileText, ExternalLink, ThumbsUp, ThumbsDown,
  Copy, Check, Volume2, VolumeX, Minimize2, Maximize2
} from 'lucide-react';

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Datos simulados del mercado (en producción vendrían de una API)
  const marketData = {
    brands: ['Michelin', 'Bridgestone', 'Continental', 'Pirelli', 'Goodyear', 'Hankook', 'Yokohama', 'Dunlop'],
    segments: {
      'Premium': ['Michelin', 'Pirelli', 'Continental'],
      'Quality': ['Bridgestone', 'Goodyear'],
      'Budget': ['Hankook', 'Yokohama', 'Dunlop']
    },
    tireSizes: ['205/55 R16', '195/65 R15', '225/45 R17', '235/55 R17', '215/60 R16', '245/40 R18', '255/35 R19', '265/70 R16'],
    currentPrices: {
      'Michelin Pilot Sport 4S': { price: 4250, competitor: 4450, stock: 45, margin: 28 },
      'Bridgestone Turanza T005': { price: 3250, competitor: 3350, stock: 32, margin: 25 },
      'Continental PremiumContact 6': { price: 3980, competitor: 4150, stock: 28, margin: 26 },
      'Pirelli P Zero Corsa': { price: 4850, competitor: 5100, stock: 15, margin: 30 },
      'Goodyear Eagle F1': { price: 3650, competitor: 3780, stock: 42, margin: 24 },
      'Hankook Ventus S1 evo3': { price: 2890, competitor: 3050, stock: 56, margin: 22 }
    },
    historicalData: {
      lastMonthSales: 1245000,
      currentMonthSales: 1350000,
      growth: 8.4,
      topSellingSize: '205/55 R16',
      topSellingBrand: 'Michelin',
      averageMargin: 25.8,
      inventoryTurnover: 4.2,
      priceIndex: 96.5
    },
    alerts: [
      { type: 'warning', message: 'Stock crítico en medida 235/55 R17', severity: 'high' },
      { type: 'info', message: 'Competidor bajó precios en segmento Premium', severity: 'medium' },
      { type: 'success', message: 'Crecimiento del 12% en ventas de SUV', severity: 'low' }
    ]
  };

  // Sugerencias de preguntas basadas en contexto
  const suggestedQuestions = [
    "¿Cuál es la diferencia de precio con la competencia?",
    "¿Qué medidas tienen mejor margen?",
    "Análisis de stock crítico",
    "Tendencias de mercado este mes",
    "Comparativa de marcas Premium",
    "¿Cómo va el cumplimiento de metas?",
    "Productos más rentables",
    "Alertas de inventario"
  ];

  // Respuestas predefinidas para consultas comunes
  const getResponse = (question) => {
    const q = question.toLowerCase();
    
    // Análisis de Precios y Competitividad
    if (q.includes('diferencia de precio') || q.includes('comparativa de precio') || q.includes('competencia')) {
      const michelinPrice = marketData.currentPrices['Michelin Pilot Sport 4S'];
      const diff = michelinPrice.competitor - michelinPrice.price;
      const diffPercent = ((diff / michelinPrice.competitor) * 100).toFixed(1);
      return {
        text: `📊 **Análisis de Precios vs Competencia**\n\n` +
               `**Michelin Pilot Sport 4S**\n` +
               `• Nuestro precio: $${michelinPrice.price.toLocaleString()} MXN\n` +
               `• Competencia: $${michelinPrice.competitor.toLocaleString()} MXN\n` +
               `• Diferencia: -$${diff.toLocaleString()} MXN (${diffPercent}% más competitivo)\n\n` +
               `**Recomendación:** Mantener precio actual. Estamos ${diffPercent}% por debajo de la competencia.`,
        kpi: 'price_index',
        action: 'show_chart'
      };
    }
    
    // Gestión de Inventarios y Stock
    if (q.includes('stock crítico') || q.includes('inventario') || q.includes('stock muerto')) {
      const criticalStock = Object.entries(marketData.currentPrices)
        .filter(([_, data]) => data.stock < 20)
        .map(([name, data]) => `• ${name}: ${data.stock} unidades`);
      
      return {
        text: `⚠️ **Alertas de Inventario**\n\n` +
               `**Stock Crítico (<20 unidades):**\n${criticalStock.join('\n')}\n\n` +
               `**Recomendaciones:**\n` +
               `• Realizar pedido urgente de Pirelli P Zero Corsa\n` +
               `• Evaluar promociones para liberar espacio en bodega\n` +
               `• Stock-to-Sales Ratio actual: ${marketData.historicalData.inventoryTurnover}:1`,
        kpi: 'inventory',
        action: 'show_alerts'
      };
    }
    
    // KPIs y Rentabilidad
    if (q.includes('margen') || q.includes('rentabilidad') || q.includes('kpi')) {
      return {
        text: `📈 **Reporte de Rentabilidad**\n\n` +
               `**Métricas Clave:**\n` +
               `• Margen Bruto Promedio: ${marketData.historicalData.averageMargin}%\n` +
               `• Producto con mayor margen: Pirelli P Zero Corsa (30%)\n` +
               `• Price Index vs Mercado: ${marketData.historicalData.priceIndex}\n` +
               `• ROI estimado (próximo trimestre): +5.2%\n\n` +
               `**Recomendación:** Enfocar esfuerzos en productos con margen >28%.`,
        kpi: 'margin',
        action: 'show_metrics'
      };
    }
    
    // Tendencias y Comportamiento del Consumidor
    if (q.includes('tendencia') || q.includes('demanda') || q.includes('crecimiento')) {
      return {
        text: `📊 **Tendencias de Mercado**\n\n` +
               `**Indicadores de Demanda:**\n` +
               `• Medida más demandada: ${marketData.historicalData.topSellingSize}\n` +
               `• Marca líder: ${marketData.historicalData.topSellingBrand}\n` +
               `• Crecimiento mensual: +${marketData.historicalData.growth}%\n` +
               `• Segmento de mayor crecimiento: SUV (+15%)\n\n` +
               `**Proyección:** Aumento de demanda en medidas 17" y 18" para próximo mes.`,
        kpi: 'trends',
        action: 'show_trends'
      };
    }
    
    // Comparativa de Marcas
    if (q.includes('comparativa') || q.includes('marca')) {
      return {
        text: `🏷️ **Comparativa de Marcas por Segmento**\n\n` +
               `**Premium (Margen >28%):**\n` +
               `• Michelin: 28% margen | $4,250\n` +
               `• Pirelli: 30% margen | $4,850\n` +
               `• Continental: 26% margen | $3,980\n\n` +
               `**Quality (Margen 24-27%):**\n` +
               `• Bridgestone: 25% margen | $3,250\n` +
               `• Goodyear: 24% margen | $3,650\n\n` +
               `**Budget (Margen <24%):**\n` +
               `• Hankook: 22% margen | $2,890\n` +
               `• Yokohama: 21% margen | $2,750\n\n` +
               `**Recomendación:** Priorizar ventas de marcas Premium por mayor rentabilidad.`,
        kpi: 'brand_comparison',
        action: 'show_brands'
      };
    }
    
    // Resumen Ejecutivo
    if (q.includes('resumen') || q.includes('ejecutivo') || q.includes('dashboard')) {
      return {
        text: `📋 **Resumen Ejecutivo - NeumatiQ**\n\n` +
               `**Ventas:**\n` +
               `• Mes actual: $${marketData.historicalData.currentMonthSales.toLocaleString()} MXN\n` +
               `• Crecimiento: +${marketData.historicalData.growth}% vs mes anterior\n` +
               `• Meta mensual: 85% cumplida\n\n` +
               `**Rentabilidad:**\n` +
               `• Margen promedio: ${marketData.historicalData.averageMargin}%\n` +
               `• Price Index: ${marketData.historicalData.priceIndex} (competitivo)\n\n` +
               `**Inventario:**\n` +
               `• Rotación: ${marketData.historicalData.inventoryTurnover} meses\n` +
               `• 3 productos con stock crítico\n\n` +
               `**Top Productos:**\n` +
               `1. Michelin Pilot Sport 4S - $4,250\n` +
               `2. Continental PremiumContact 6 - $3,980\n` +
               `3. Pirelli P Zero Corsa - $4,850`,
        kpi: 'executive_summary',
        action: 'show_dashboard'
      };
    }
    
    // Análisis Predictivo
    if (q.includes('predicción') || q.includes('pronóstico') || q.includes('what-if')) {
      return {
        text: `🔮 **Análisis Predictivo**\n\n` +
               `**Escenario Base (Próximo Trimestre):**\n` +
               `• Ventas proyectadas: $1,450,000 MXN (+7.4%)\n` +
               `• Margen estimado: 26.5%\n` +
               `• Demanda de SUV: +18%\n\n` +
               `**Escenario Optimista (+10% inversión):**\n` +
               `• Ventas: $1,580,000 MXN\n` +
               `• ROI proyectado: 15.2%\n\n` +
               `**Escenario Pesimista (competencia agresiva):**\n` +
               `• Ventas: $1,320,000 MXN\n` +
               `• Margen: 24.8%\n\n` +
               `**Recomendación:** Incrementar inventario de medidas 17" y 18" en 20%.`,
        kpi: 'predictive',
        action: 'show_forecast'
      };
    }
    
    // Consultas Operativas
    if (q.includes('promocion') || q.includes('liberar espacio')) {
      const lowStockProducts = Object.entries(marketData.currentPrices)
        .filter(([_, data]) => data.stock > 40)
        .slice(0, 5)
        .map(([name, data]) => `• ${name}: ${data.stock} unidades | $${data.price}`);
      
      return {
        text: `🎯 **Estrategia de Promociones**\n\n` +
               `**Productos para promocionar (Alto stock):**\n${lowStockProducts.join('\n')}\n\n` +
               `**Estrategias sugeridas:**\n` +
               `• Descuento del 10% en compra de 4 unidades\n` +
               `• Bundle: 2 llantas + montaje gratis\n` +
               `• Oferta por tiempo limitado (7 días)\n\n` +
               `**Impacto estimado:** Liberación de 150-200 unidades en 2 semanas.`,
        kpi: 'promotions',
        action: 'show_promotions'
      };
    }
    
    // Respuesta por defecto
    return {
      text: `🤖 **Asistente NeumatiQ**\n\n` +
             `Puedo ayudarte con:\n\n` +
             `💰 **Análisis de Precios**\n` +
             `• Comparativas con competencia\n` +
             `• Tendencias de precios\n` +
             `• Índices de competitividad\n\n` +
             `📦 **Gestión de Inventario**\n` +
             `• Stock crítico y rotación\n` +
             `• Puntos de reorden\n` +
             `• Productos con baja rotación\n\n` +
             `📊 **KPIs y Rentabilidad**\n` +
             `• Márgenes por producto\n` +
             `• Price Index\n` +
             `• Market Share\n\n` +
             `📈 **Tendencias**\n` +
             `• Demanda por medida\n` +
             `• Marcas líderes\n` +
             `• Proyecciones de venta\n\n` +
             `💡 **Ejemplos de preguntas:**\n` +
             `• "¿Cuál es la diferencia de precio con la competencia?"\n` +
             `• "¿Qué medidas tienen mejor margen?"\n` +
             `• "Análisis de stock crítico"\n` +
             `• "Resumen ejecutivo del dashboard"\n` +
             `• "Comparativa de marcas Premium"`,
      kpi: 'help',
      action: 'show_help'
    };
  };

  // Enviar mensaje
  const sendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage = { id: Date.now(), type: 'user', text: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simular tiempo de respuesta
    setTimeout(() => {
      const response = getResponse(message);
      const assistantMessage = { 
        id: Date.now() + 1, 
        type: 'assistant', 
        text: response.text,
        kpi: response.kpi,
        action: response.action,
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // Actualizar sugerencias basadas en contexto
      updateSuggestions(message);
    }, 1000 + Math.random() * 500);
  };

  // Actualizar sugerencias
  const updateSuggestions = (lastMessage) => {
    const newSuggestions = suggestedQuestions.filter(q => 
      !q.toLowerCase().includes(lastMessage.toLowerCase())
    ).slice(0, 4);
    setSuggestions(newSuggestions);
  };

  // Copiar mensaje
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Leer mensaje en voz alta
  const speakMessage = (text) => {
    if (!voiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Reconocimiento de voz
  const toggleVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
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
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
      inputRef.current?.focus();
    };
    
    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Mensaje de bienvenida
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'assistant',
        text: `🎉 **¡Bienvenido a NeumatiQ Assistant!**\n\n` +
               `Soy tu asistente inteligente especializado en el mercado de neumáticos. ` +
               `Puedo ayudarte a analizar precios, gestionar inventario, monitorear KPIs ` +
               `y tomar decisiones basadas en datos.\n\n` +
               `¿En qué puedo ayudarte hoy?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setSuggestions(suggestedQuestions.slice(0, 4));
    }
  }, [isOpen, messages.length]);

  return (
    <>
      {/* Botón flotante del asistente */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-white"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Panel del asistente - CORREGIDO: AnimatePresence con un solo hijo */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="assistant-panel"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed bottom-24 right-6 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-sky-200 flex flex-col overflow-hidden transition-all duration-300 ${
              isExpanded ? 'w-[95vw] h-[90vh] md:w-[800px] md:h-[700px]' : 'w-[380px] h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-4 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold">NeumatiQ Assistant</h3>
                  <p className="text-xs text-white/80">Inteligencia de Mercado</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                  title={voiceEnabled ? 'Desactivar voz' : 'Activar voz'}
                >
                  {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages - Scrollable area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-sky-50/30 to-white">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        msg.type === 'user' 
                          ? 'bg-gradient-to-r from-sky-500 to-blue-500' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}>
                        {msg.type === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                      </div>
                      <div className={`relative group ${
                        msg.type === 'user' 
                          ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-2xl rounded-tr-none'
                          : 'bg-white border border-sky-100 text-gray-700 rounded-2xl rounded-tl-none shadow-soft'
                      } p-3`}>
                        <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                        <div className="flex items-center justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="p-1 hover:bg-black/10 rounded-lg transition-all"
                          >
                            {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                          </button>
                          {msg.type === 'assistant' && (
                            <button
                              onClick={() => speakMessage(msg.text)}
                              className="p-1 hover:bg-black/10 rounded-lg transition-all"
                            >
                              <Volume2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
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
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="bg-white border border-sky-100 rounded-2xl rounded-tl-none p-3 shadow-soft">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Sugerencias */}
            {suggestions.length > 0 && (
              <div className="px-4 py-2 border-t border-sky-100 bg-white/50 flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(suggestion)}
                      className="px-3 py-1.5 bg-white border border-sky-200 rounded-full text-xs text-sky-600 hover:bg-sky-50 transition-all whitespace-nowrap shadow-soft flex-shrink-0"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-sky-100 bg-white/50 flex-shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={toggleVoiceRecognition}
                  className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-white/60 border border-sky-200 text-sky-600 hover:bg-sky-50'
                  }`}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                  placeholder={isListening ? 'Escuchando...' : 'Escribe tu pregunta...'}
                  className="flex-1 px-4 py-2 bg-white/80 border border-sky-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent text-gray-700 placeholder-gray-400"
                  disabled={isListening}
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isListening}
                  className="p-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl text-white hover:shadow-md transition-all disabled:opacity-50 flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                NeumatiQ Assistant v1.0 · Datos actualizados en tiempo real
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Assistant;