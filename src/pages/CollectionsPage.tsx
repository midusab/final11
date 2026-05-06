import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Lock, LayoutGrid, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Product } from '../types';

interface CollectionsPageProps {
  products: Product[];
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ products }) => {
  const upcomingProducts = products.filter(p => p.is_upcoming);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 border border-brand-red text-brand-red text-[8px] font-black uppercase tracking-widest mb-6"
            >
               <Layers size={10} />
               Catalogue Access
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase mb-4">
                THE <span className="text-brand-red underline decoration-white/20 underline-offset-8">ARCHIVE</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">Vault Locked Inventory // Scheduled Drops</p>
        </header>

        {upcomingProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dark-border bg-dark-surface/30">
            <Lock size={32} className="text-white/10 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">The vault is currently empty. No upcoming drops detected.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {upcomingProducts.map((p, i) => (
                  <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                  >
                      <div className="aspect-[4/5] bg-dark-surface border border-dark-border relative overflow-hidden mb-6">
                          <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-full h-full object-cover transition-all duration-1000 blur-md opacity-20 grayscale group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                              <Lock size={48} className="text-brand-red animate-pulse" />
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red">Vault Locked</p>
                          </div>

                          <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                               <span className="text-[8px] font-black text-brand-red uppercase bg-black px-2 py-1 w-fit">SCHEDULING...</span>
                               <h2 className="text-2xl font-display font-black tracking-tight">{p.name}</h2>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <p className="text-xs text-white/40 leading-relaxed font-medium italic">"{p.description}"</p>
                          <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{p.category}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono text-brand-red">F11-VAULT-{p.id.substring(0,4)}</span>
                                <button className="text-[10px] font-black uppercase tracking-widest text-white/20 cursor-not-allowed">Locked</button>
                              </div>
                          </div>
                      </div>
                  </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
      </div>
    </div>
  );
};
