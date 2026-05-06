import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, X } from 'lucide-react';

interface OfferBannerProps {
  active: boolean;
  text: string;
  expiryDate?: string;
  onClose?: () => void;
}

export const OfferBanner: React.FC<OfferBannerProps> = ({ active, text, expiryDate, onClose }) => {
  const [timeLeft, setTimeLeft] = React.useState<{h: number, m: number, s: number} | null>(null);

  React.useEffect(() => {
    if (!expiryDate || !active) return;

    const timer = setInterval(() => {
      const target = new Date(expiryDate).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft(null);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate, active]);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-gradient-to-r from-[#FF0055] via-[#00FF88] to-[#0a0a0a] text-black overflow-hidden fixed bottom-0 left-0 right-0 w-full z-[100] border-t-4 border-black shadow-[0_-10px_40px_rgba(0,255,136,0.1)]"
        id="global-offer-banner"
      >
        <div className="py-3 px-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          
          {/* Scrolling Ticker */}
          <div className="flex-1 w-full overflow-hidden whitespace-nowrap group">
            <motion.div 
              animate={{ x: [0, -1000] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex gap-8 items-center"
            >
              {[...Array(15)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Zap size={18} className="fill-black" />
                  <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em]">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Massive Countdown */}
          {timeLeft && (
            <div className="flex items-center gap-4 bg-black text-white px-6 py-2 shadow-xl shrink-0 transform md:-skew-x-12 border-2 border-white/20">
              <Timer size={20} className="text-[#00FF88] animate-pulse" />
              <div className="flex gap-2 text-sm md:text-base font-black font-mono uppercase tracking-widest">
                <span>{String(timeLeft.h).padStart(2, '0')}H</span>
                <span className="text-brand-red">:</span>
                <span>{String(timeLeft.m).padStart(2, '0')}M</span>
                <span className="text-brand-red">:</span>
                <span>{String(timeLeft.s).padStart(2, '0')}S</span>
              </div>
            </div>
          )}

          {onClose && (
            <button onClick={onClose} className="p-2 bg-black text-white rounded-full hover:bg-brand-red transition-colors shrink-0">
              <X size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
