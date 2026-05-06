import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Timer, Zap, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

interface LandingOfferPopupProps {
  active: boolean;
  text: string;
  expiryDate?: string;
  product?: Product;
  onClose: () => void;
}

export const LandingOfferPopup: React.FC<LandingOfferPopupProps> = ({ active, text, expiryDate, product, onClose }) => {
  const [timeLeft, setTimeLeft] = React.useState<{d: number, h: number, m: number, s: number} | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Delay the popup slightly so it's not jarring immediately on load
    if (active && product) {
      const timeout = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timeout);
    }
  }, [active, product]);

  React.useEffect(() => {
    if (!expiryDate || !active || !isVisible) return;

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
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate, active, isVisible]);

  if (!active || !product || !isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0a0a0a] border-4 border-[#0a0a0a] shadow-2xl flex flex-col md:flex-row overflow-hidden"
        >
          {/* Playful Gradient Border/Background element */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF0055] via-[#00FF88] to-[#0a0a0a] opacity-20 pointer-events-none" />

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black text-white hover:text-[#FF0055] transition-colors rounded-full border border-white/10"
          >
            <X size={20} />
          </button>

          {/* Left: Product Image */}
          <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-black">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient for text readability on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
          </div>

          {/* Right: Offer Details */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10 bg-[#0a0a0a]">
            <div className="flex items-center gap-2 text-[#00FF88] mb-6">
              <Zap size={20} className="fill-[#00FF88] animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Special Offer</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter uppercase mb-2 leading-none text-white">
              {product.name}
            </h2>
            
            <p className="text-2xl font-black text-[#FF0055] mb-8">
              KES {product.price.toLocaleString()}
            </p>

            <div className="p-4 border-l-4 border-[#FF0055] bg-white/5 mb-8">
              <p className="text-sm font-bold uppercase tracking-widest text-white/80 leading-relaxed">
                {text}
              </p>
            </div>

            {timeLeft && (
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">Offer Ends In</p>
                <div className="flex gap-2 text-white font-mono font-black text-2xl">
                  <div className="flex flex-col items-center"><span className="bg-white/5 px-3 py-2 border border-white/10">{String(timeLeft.d).padStart(2, '0')}</span><span className="text-[9px] text-white/40 mt-1 uppercase">D</span></div>
                  <span className="py-2 text-[#00FF88]">:</span>
                  <div className="flex flex-col items-center"><span className="bg-white/5 px-3 py-2 border border-white/10">{String(timeLeft.h).padStart(2, '0')}</span><span className="text-[9px] text-white/40 mt-1 uppercase">H</span></div>
                  <span className="py-2 text-[#00FF88]">:</span>
                  <div className="flex flex-col items-center"><span className="bg-white/5 px-3 py-2 border border-white/10">{String(timeLeft.m).padStart(2, '0')}</span><span className="text-[9px] text-white/40 mt-1 uppercase">M</span></div>
                  <span className="py-2 text-[#00FF88]">:</span>
                  <div className="flex flex-col items-center"><span className="bg-[#FF0055]/20 text-[#FF0055] px-3 py-2 border border-[#FF0055]/30 animate-pulse">{String(timeLeft.s).padStart(2, '0')}</span><span className="text-[9px] text-white/40 mt-1 uppercase">S</span></div>
                </div>
              </div>
            )}

            <Link 
              to="/products"
              onClick={onClose}
              className="w-full bg-white text-black py-5 flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs hover:bg-[#00FF88] transition-colors"
            >
              <ShoppingBag size={18} />
              Shop Now
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
