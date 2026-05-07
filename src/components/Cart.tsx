import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  isAuthenticated: boolean;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, isAuthenticated, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-surface border-l border-dark-border z-[101] flex flex-col pt-24 pb-8"
          >
            <div className="absolute top-8 left-8 right-8 flex items-center justify-between">
              <h2 className="text-xl font-display font-black tracking-tighter uppercase">
                YOUR BAG <span className="text-brand-red">({items.length})</span>
              </h2>
              <button 
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p className="text-xs uppercase tracking-widest font-bold">Your bag is empty</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 bg-dark-bg border border-dark-border overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale brightness-75" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold uppercase tracking-tight text-white">{item.name}</h4>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-white/20 hover:text-brand-red transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-4">Size: M</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-dark-border">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="px-2 py-1 text-white hover:bg-dark-border transition-colors"
                            >-</button>
                            <span className="px-3 py-1 text-xs font-mono">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="px-2 py-1 text-white hover:bg-dark-border transition-colors"
                            >+</button>
                          </div>
                          <p className="text-sm font-bold">KES {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-8 pt-8 border-t border-dark-border">
                <div className="flex justify-between items-end mb-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40">Total Amount</p>
                  <p className="text-3xl font-display font-black tracking-tighter">KES {total.toLocaleString()}</p>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-white text-black font-black uppercase tracking-widest py-5 text-xs hover:bg-brand-green hover:text-black transition-all"
                >
                  {isAuthenticated ? 'Finalize Order' : 'Auth to Order'}
                </button>
                <button 
                  onClick={onClose}
                  className="w-full mt-4 text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
