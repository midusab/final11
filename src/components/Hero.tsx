import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-dark-bg">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=2000"
          alt="Streetwear Culture"
          className="w-full h-full object-cover opacity-40 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-transparent to-dark-bg opacity-90" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-brand-red/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center gap-4"
        >
          <span className="h-px w-12 bg-brand-red" />
          <p className="text-xs uppercase tracking-[0.4em] font-bold text-brand-red">
            Drop 01 // Alpha Prime
          </p>
          <span className="h-px w-12 bg-brand-red" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12vw] md:text-[8vw] font-display font-black leading-[0.85] tracking-tighter uppercase text-white mb-8"
        >
          FINALL <span className="text-brand-red italic block md:inline md:not-italic">11</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-xl text-white/50 text-sm md:text-base leading-relaxed mb-10 uppercase tracking-widest font-medium"
        >
          Redefining the silhouette of international sports through the lens of urban ghetto culture.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link 
            to="/products"
            className="bg-brand-red hover:bg-brand-red-hover text-white px-10 py-4 font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-all group"
          >
            Shop Collection
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/collections"
            className="border border-white/20 hover:bg-white hover:text-black text-white px-10 py-4 font-bold text-xs uppercase tracking-widest transition-all text-center"
          >
            The Archive
          </Link>
        </motion.div>
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute left-6 bottom-12 hidden lg:flex flex-col gap-2">
        <p className="vertical-text text-[10px] uppercase font-bold tracking-widest text-white/20">
          STREETWEAR COLLECTIVE
        </p>
        <div className="h-12 w-px bg-white/20 mx-auto" />
      </div>

      <div className="absolute right-6 bottom-12 hidden lg:flex flex-col gap-2 items-center">
        <p className="text-[10px] uppercase font-bold tracking-widest text-white/20 rotate-90 origin-right">
          SCROLL TO EXPLORE
        </p>
        <div className="h-12 w-px bg-white/20" />
      </div>
    </section>
  );
};
