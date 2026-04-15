import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const splashStyles = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(234, 179, 8, 0.3); }
  50% { box-shadow: 0 0 40px rgba(234, 179, 8, 0.6); }
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

const SplashScreen = ({ onComplete, minDuration = 7000, demoTextPosition = 'center' }) => {
  injectSplashStyles();

  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const startTimeRef = React.useRef(Date.now());
  const mountedRef = React.useRef(true);

  const loadingSteps = [
    { progress: 10, delay: 100 },
    { progress: 25, delay: 150 },
    { progress: 40, delay: 150 },
    { progress: 55, delay: 150 },
    { progress: 70, delay: 150 },
    { progress: 85, delay: 150 },
    { progress: 100, delay: 300 }
  ];

  const simulateLoading = React.useRef(async () => {
    try {
      for (let i = 0; i < loadingSteps.length; i++) {
        const step = loadingSteps[i];
        if (!mountedRef.current) return;
        
        setProgress(step.progress);
        
        const stepDelay = i === loadingSteps.length - 1 ? 300 : step.delay;
        await new Promise(resolve => setTimeout(resolve, stepDelay));
      }

      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed < minDuration && mountedRef.current) {
        await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
      }

      if (mountedRef.current) {
        setIsComplete(true);
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
        }, 800);
      }
    } catch (error) {
      console.error('Error during loading:', error);
    }
  });

  useEffect(() => {
    mountedRef.current = true;
    simulateLoading.current();
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (!isVisible) return null;



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      scale: 1.1,
      filter: 'blur(10px)',
      transition: { duration: 0.6, ease: 'easeInOut' }
    }
  };

  const demoVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.2 }
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
        className="fixed inset-0 z-50 h-screen w-screen flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate={isComplete ? 'exit' : 'visible'}
        exit="exit"
        style={{
          backgroundImage: 'url("/assets/Splashscreen_inicio.gif")',
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text visibility */}
        <motion.div 
          className="absolute inset-0 bg-black/30"
          animate={isComplete ? { opacity: 0 } : { opacity: 0.3 }}
          transition={{ duration: 0.5 }}
        />



        {/* Loading Bar Container */}
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
                initial={{ width: 0 }}
                animate={{ width: isComplete ? '100%' : `${progress}%` }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </div>
          
          {/* Progress Text */}
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