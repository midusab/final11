import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="h-screen bg-dark-bg flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-brand-red/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-xl w-full text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="p-6 border border-brand-red/20 bg-brand-red/5 rounded-full">
            <AlertTriangle size={48} className="text-brand-red animate-pulse" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-8xl md:text-[12rem] font-display font-black tracking-tighter text-white/5 leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-6">
            NODE <span className="text-brand-red">NOT FOUND</span>
          </h2>
          <p className="text-white/40 text-xs md:text-sm uppercase tracking-[0.3em] font-bold mb-12 leading-relaxed">
            The coordinates you provided do not exist in the archive. <br/>
            Your access to this sector has been restricted.
          </p>

          <Link 
            to="/"
            className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Return to Base
          </Link>
        </motion.div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-12 left-12 w-12 h-12 border-t-2 border-l-2 border-white/5" />
      <div className="absolute top-12 right-12 w-12 h-12 border-t-2 border-r-2 border-white/5" />
      <div className="absolute bottom-12 left-12 w-12 h-12 border-b-2 border-l-2 border-white/5" />
      <div className="absolute bottom-12 right-12 w-12 h-12 border-b-2 border-r-2 border-white/5" />
    </div>
  );
};
