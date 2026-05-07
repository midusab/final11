import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const hasConsented = localStorage.getItem('f11_cookie_consent');
    if (!hasConsented) {
      // Small delay so it doesn't instantly block the screen on load
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('f11_cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('f11_cookie_consent', 'false');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[200] p-4 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-black border border-dark-border p-6 shadow-2xl pointer-events-auto flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-start gap-4">
              <Cookie className="text-brand-red shrink-0" size={24} />
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">Cookies & Privacy</h4>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest leading-relaxed">
                  We use cookies to secure your session, track inventory, and provide a premium checkout experience. By clicking "Accept", you agree to our brutalist data policy. No fluff, just functionality.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button 
                onClick={handleDecline}
                className="flex-1 md:flex-none border border-white/10 text-white/60 hover:text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Decline
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 md:flex-none bg-white text-black hover:bg-brand-green hover:text-black px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Accept
              </button>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-white/20 hover:text-brand-red md:hidden"
              aria-label="Close cookie banner"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
