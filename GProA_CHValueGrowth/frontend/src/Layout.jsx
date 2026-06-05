import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const useUserData = () => {
  return () => {
    try {
      const user = localStorage.getItem('chvalue_user') || sessionStorage.getItem('chvalue_user');
      return user ? JSON.parse(user) : { name: 'Admin', role: 'Administrador', avatar: 'NQ' };
    } catch {
      return { name: 'Admin', role: 'Administrador', avatar: 'NQ' };
    }
  };
};

const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const getUserData = useUserData();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('chvalue_token');
    localStorage.removeItem('chvalue_user');
    sessionStorage.removeItem('chvalue_token');
    sessionStorage.removeItem('chvalue_user');
    window.location.href = '/login';
  };

  const handleExit = () => {
    handleLogout();
    window.close();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: true }}>
      <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-[#001529] to-[#0B1E3A] flex flex-col">
        <Header 
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          getUserData={getUserData}
          onLogout={handleLogout}
          onExit={handleExit}
          isMobile={isMobile}
        />
        <div className="flex-1 flex overflow-hidden relative">
          <Sidebar 
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            isMobile={isMobile}
          />
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex absolute left-64 top-20 z-20 p-1.5 -ml-3 rounded-full bg-[#1890FF] shadow-lg hover:scale-110 transition-all"
            style={{ left: isSidebarCollapsed ? '5rem' : '16rem' }}
          >
            <ChevronLeft size={12} className={`text-white transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
          <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="bg-gradient-to-br from-[#0B1E3A]/80 to-[#001529]/80 rounded-tl-3xl rounded-tr-xl rounded-br-xl rounded-bl-xl border border-[#1890FF]/10 shadow-2xl min-h-full">
              <div className="p-5">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default Layout;

