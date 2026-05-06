import React from 'react';
import { motion } from 'motion/react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[1000] bg-dark-bg flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-2 border-transparent border-t-brand-red rounded-full shadow-[0_0_15px_rgba(255,0,0,0.5)]"
        />
        
        {/* Inner static/pulsing 11 */}
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute text-4xl font-display font-black tracking-tighter text-white"
        >
          11
        </motion.div>
      </div>
    </div>
  );
};
