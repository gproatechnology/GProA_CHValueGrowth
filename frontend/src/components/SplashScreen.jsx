import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const splashStyles = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
`;

let splashStyleInjected = false;
function injectSplashStyles() {
  if (splashStyleInjected) return;
  const el = document.createElement('style');
  el.textContent = splashStyles;
  document.head.appendChild(el);
  splashStyleInjected = true;
}

const SplashScreen = ({ onComplete, minDuration = 7000 }) => {
  injectSplashStyles();

  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const startTimeRef = useRef(0);

  const EXIT_DURATION = 800; // animación de salida

  useEffect(() => {
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;

      // progreso sincronizado con el tiempo total (menos exit)
      const effectiveDuration = minDuration - EXIT_DURATION;
      const percentage = Math.min((elapsed / effectiveDuration) * 100, 100);

      setProgress(Math.floor(percentage));

      if (percentage >= 100) {
        clearInterval(interval);

        setIsComplete(true);

        // esperar animación de salida
        setTimeout(() => {
          setIsVisible(false);
          onComplete && onComplete();
        }, EXIT_DURATION);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  if (!isVisible) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: 'blur(10px)',
      transition: { duration: 0.6, ease: 'easeInOut' }
    }
  };

  const barVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.4 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate={isComplete ? 'exit' : 'visible'}
        exit="exit"
        style={{
          backgroundImage: 'url("/assets/Splashscreen_inicio.gif")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/30"
          animate={isComplete ? { opacity: 0 } : { opacity: 0.3 }}
          transition={{ duration: 0.5 }}
        />

        {/* Barra de carga */}
        <motion.div
          variants={barVariants}
          initial="hidden"
          animate={isComplete ? 'exit' : 'visible'}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 max-w-[80%]"
        >
          <div className="bg-black/40 backdrop-blur-md rounded-full p-1.5 border border-white/10 shadow-2xl">
            <div className="relative h-3 bg-black/50 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 rounded-full"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </div>

          {/* Texto */}
          <div className="text-center mt-3">
            <motion.span
              className="text-sky-300/90 text-sm font-bold tracking-wider drop-shadow-md font-mono"
              animate={isComplete ? { scale: 1.2, opacity: 0 } : {}}
              transition={{ duration: 0.3 }}
            >
              CARGANDO... {progress}%
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
