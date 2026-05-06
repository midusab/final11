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
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-brand-red text-white overflow-hidden relative z-[200]"
      >
        <div className="py-2 px-4 flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-8 overflow-hidden whitespace-nowrap group">
            <motion.div 
              animate={{ x: [0, -1000] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-12 items-center"
            >
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Zap size={14} className="fill-white" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {timeLeft && (
            <div className="flex items-center gap-4 bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm border border-white/10 shrink-0">
              <Timer size={14} />
              <div className="flex gap-2 text-[10px] font-black font-mono">
                <span>{String(timeLeft.h).padStart(2, '0')}H</span>
                <span className="opacity-40">:</span>
                <span>{String(timeLeft.m).padStart(2, '0')}M</span>
                <span className="opacity-40">:</span>
                <span>{String(timeLeft.s).padStart(2, '0')}S</span>
              </div>
            </div>
          )}

          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors shrink-0">
              <X size={14} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
