import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Lock, LayoutGrid, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CollectionsPage: React.FC = () => {
  const collections = [
    {
      title: 'ALPHA PRIME',
      desc: 'The foundation of Finall 11. Core essentials in heavy fleece.',
      img: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80&w=800',
      count: '06 PIECES',
      status: 'AVAILABLE'
    },
    {
      title: 'CRIMSON OVERDRIVE',
      desc: 'Experimental acid washes and hand-distressed details.',
      img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
      count: '03 PIECES',
      status: 'LIMITED'
    },
    {
      title: 'GHETTO LUXE',
      desc: 'Upcoming drop exploring high-fashion silhouettes in urban contexts.',
      img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800',
      count: 'TBA',
      status: 'LOCKDOWN'
    }
  ];

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
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20">Organized Collective Drops // 2026</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {collections.map((c, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group"
                >
                    <div className="aspect-[4/5] bg-dark-surface border border-dark-border relative overflow-hidden mb-6">
                        <img 
                            src={c.img} 
                            alt={c.title} 
                            className={`w-full h-full object-cover transition-all duration-1000 ${c.status === 'LOCKDOWN' ? 'blur-md opacity-20' : 'grayscale group-hover:grayscale-0 group-hover:scale-110'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
                        
                        {c.status === 'LOCKDOWN' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <Lock size={48} className="text-brand-red animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-red">Vault Locked</p>
                            </div>
                        )}

                        <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                             <span className="text-[8px] font-black text-brand-red uppercase bg-black px-2 py-1 w-fit">{c.status}</span>
                             <h2 className="text-2xl font-display font-black tracking-tight">{c.title}</h2>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs text-white/40 leading-relaxed font-medium italic">"{c.desc}"</p>
                        <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{c.count}</span>
                            {c.status !== 'LOCKDOWN' ? (
                                <Link to="/products" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-brand-red transition-colors">
                                    Browse Range <ArrowRight size={14} />
                                </Link>
                            ) : (
                                <button className="text-[10px] font-black uppercase tracking-widest text-white/20 cursor-not-allowed">Scheduled</button>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};
