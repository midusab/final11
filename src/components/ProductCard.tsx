import React from 'react';
import { motion } from 'motion/react';
import { Plus, Eye, Star, MessageCircle, Timer } from 'lucide-react';
import { Product } from '../types';
import { getOptimizedImageUrl, getProductSrcSet } from '../lib/imageOptimization';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const [timeLeft, setTimeLeft] = React.useState<{d: number, h: number, m: number, s: number} | null>(null);

  React.useEffect(() => {
    if (!product.is_upcoming || !product.release_date) return;

    const timer = setInterval(() => {
      const target = new Date(product.release_date!).getTime();
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
  }, [product.release_date, product.is_upcoming]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-dark-surface p-4 border border-dark-border hover:border-brand-red/50 transition-all duration-300 shadow-xl cursor-crosshair"
      onClick={() => onViewDetails?.(product)}
    >
      <div className="aspect-[1/1] overflow-hidden bg-dark-bg border border-dark-border relative transition-colors duration-500 flex items-center justify-center">
        {product.image ? (
          <img 
            src={getOptimizedImageUrl(product.image, 600)} 
            srcSet={getProductSrcSet(product.image)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-20">
            <span className="text-[10px] font-black tracking-[0.5em] uppercase">No Image</span>
            <div className="w-12 h-px bg-white/50" />
            <span className="text-[8px] font-bold tracking-widest text-brand-red">Missing Image</span>
          </div>
        )}
        
        {/* Kilimall-style Countdown Overlay */}
        {timeLeft && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Timer size={24} className="text-brand-red mb-4 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-4">Available In</span>
            <div className="flex gap-3 text-white font-mono font-black text-lg">
              <div className="flex flex-col items-center"><span className="bg-white/10 px-2 py-1 border border-white/20">{String(timeLeft.d).padStart(2, '0')}</span><span className="text-[8px] text-white/40 mt-1 uppercase">Days</span></div>
              <span className="py-1">:</span>
              <div className="flex flex-col items-center"><span className="bg-white/10 px-2 py-1 border border-white/20">{String(timeLeft.h).padStart(2, '0')}</span><span className="text-[8px] text-white/40 mt-1 uppercase">Hrs</span></div>
              <span className="py-1">:</span>
              <div className="flex flex-col items-center"><span className="bg-white/10 px-2 py-1 border border-white/20">{String(timeLeft.m).padStart(2, '0')}</span><span className="text-[8px] text-white/40 mt-1 uppercase">Min</span></div>
              <span className="py-1">:</span>
              <div className="flex flex-col items-center"><span className="bg-brand-red/20 text-brand-red px-2 py-1 border border-brand-red/40">{String(timeLeft.s).padStart(2, '0')}</span><span className="text-[8px] text-white/40 mt-1 uppercase">Sec</span></div>
            </div>
          </div>
        )}

        {/* F 11 Branding Overlay */}
        <div className="absolute inset-0 border-[10px] border-dark-bg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-10 h-10 bg-brand-red text-white flex items-center justify-center hover:bg-white hover:text-brand-red transition-all shadow-lg pointer-events-auto"
            title="Add to Bag"
          >
            <Plus size={20} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onViewDetails?.(product); }}
            className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-brand-red hover:text-white transition-all shadow-lg pointer-events-auto"
            title="Quick View"
          >
            <Eye size={20} />
          </button>
          <a 
            href={`https://wa.me/254794900546?text=${encodeURIComponent(`I'm interested in ${product.name}`)}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 bg-[#25D366] text-white flex items-center justify-center hover:bg-white hover:text-[#25D366] transition-all shadow-lg pointer-events-auto"
            title="Book via WhatsApp"
          >
            <MessageCircle size={20} />
          </a>
        </div>

        {/* Jumia-style badges */}
        <div className="absolute top-0 left-0 flex flex-col gap-1 p-2">
          {product.stock === 0 && (
            <div className="bg-brand-red text-white text-[8px] font-black px-2 py-0.5 tracking-tighter uppercase whitespace-nowrap z-20">
              SOLD OUT
            </div>
          )}
          {product.is_upcoming && (
            <div className="bg-white text-black text-[8px] font-black px-2 py-0.5 tracking-tighter uppercase whitespace-nowrap animate-pulse">
              UPCOMING
            </div>
          )}
          {product.promo_label && (
            <div className="bg-brand-red text-[8px] font-black text-white px-2 py-0.5 tracking-tighter uppercase whitespace-nowrap">
              {product.promo_label}
            </div>
          )}
          {!product.promo_label && (
            <div className="bg-white/10 backdrop-blur-sm text-[8px] font-black text-white px-2 py-0.5 tracking-tighter uppercase whitespace-nowrap">
              F 11 EXCLUSIVE
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col">
        <div className="flex items-center gap-1 mb-1">
          {product.reviews && product.reviews.length > 0 ? (
            <>
              {(() => {
                const avg = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
                return (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={8} className={i < Math.round(avg) ? "fill-brand-red text-brand-red" : "text-white/20"} />
                    ))}
                    <span className="text-[8px] text-white/30 font-bold ml-1 uppercase tracking-widest">({avg.toFixed(1)})</span>
                  </>
                );
              })()}
            </>
          ) : (
            <>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={8} className="text-white/10" />
              ))}
              <span className="text-[8px] text-white/20 font-bold ml-1 uppercase tracking-widest">NO_REVIEWS</span>
            </>
          )}
        </div>
        
        <h3 className="text-xs font-display font-bold tracking-tight text-white uppercase group-hover:text-brand-red transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-sm font-display font-black text-brand-green">
            KES {product.price.toLocaleString()}
          </p>
          <p className="text-[10px] text-white/20 line-through font-medium">
            KES {(product.price * 1.25).toLocaleString()}
          </p>
        </div>
        
        <button 
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className={`mt-4 w-full border py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
            product.stock === 0 
            ? 'border-dark-border text-white/20 cursor-not-allowed bg-black' 
            : 'border-white/10 hover:border-brand-red hover:bg-brand-red text-white/60 hover:text-white'
          }`}
        >
          {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
        </button>
      </div>
    </motion.div>
  );
};
